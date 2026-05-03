// js/routeEngine.js

const RouteEngine = {
    /**
     * Generates a closed-loop geometric polygon around a starting point.
     * @param {number} lat - Starting latitude
     * @param {number} lng - Starting longitude
     * @param {number} targetDistance - In meters
     * @param {number} radiusFactor - Scaling factor for fuzzy logic iterations
     * @param {number} sides - Number of polygon sides
     * @param {boolean} startAtLocation - Whether to start exactly at (lat, lng)
     * @returns {Array} Array of {lat, lng} coordinate objects
     */
    generateGeometricLoop: function(lat, lng, targetDistance, radiusFactor = 1.0, sides = 6, startAtLocation = true) {

        
        // Rough Earth circumference calculation for radius
        // 1 degree latitude is approx 111.32 km
        const radiusInMeters = (targetDistance * radiusFactor) / (2 * Math.PI);
        const radiusInDegrees = radiusInMeters / 111320;
        
        const waypoints = [];
        const randomOffset = Math.random() * Math.PI * 2;

        // Calculate center. 
        // If startAtLocation is true, we calculate center such that (lat, lng) is on perimeter.
        const centerLat = lat - radiusInDegrees * Math.cos(randomOffset);
        // Approximation for longitude spacing based on latitude
        const centerLng = lng - (radiusInDegrees / Math.cos(lat * Math.PI / 180)) * Math.sin(randomOffset);

        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides + randomOffset;
            const pLat = centerLat + radiusInDegrees * Math.cos(angle);
            const pLng = centerLng + (radiusInDegrees / Math.cos(centerLat * Math.PI / 180)) * Math.sin(angle);
            
            // For the first point (i=0), if startAtLocation is true, use the EXACT provided coordinates
            // to avoid precision drift or center-point mismatch.
            if (i === 0 && startAtLocation) {
                waypoints.push({ lat: lat, lng: lng });
            } else {
                waypoints.push({ lat: pLat, lng: pLng });
            }
        }

        // Close the loop
        waypoints.push(waypoints[0]);
        return waypoints;
    },

    /**
     * Fetches a snapped route from the public OSRM API
     * @param {Array} waypoints - Array of {lat, lng} objects
     * @returns {Promise<Object>} Route data containing distance, duration, and geometry
     */
    fetchOSRMRoute: async function(waypoints) {
        // OSRM expects coordinates in "longitude,latitude" format
        const coordsString = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
        
        // Using the public demo server. In production, host your own OSRM instance.
        const url = `https://router.project-osrm.org/route/v1/foot/${coordsString}?overview=full&geometries=geojson`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`OSRM API responded with status: ${response.status}`);
            
            const data = await response.json();
            
            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error("No route found by OSRM.");
            }

            const route = data.routes[0];
            
            // Convert GeoJSON LineString (lng, lat) back to Leaflet format (lat, lng)
            const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            return {
                distance: route.distance, // in meters
                duration: route.duration, // in seconds
                coordinates: coordinates,
                waypoints: waypoints,
                isMock: false
            };
        } catch (error) {
            console.warn("OSRM API failed. Falling back to geometric mock.", error);
            // Fallback to pure geometric distance for Simulation Mode
            let mockDistance = 0;
            // Haversine formula approximation for mock distance
            for(let i=0; i<waypoints.length - 1; i++) {
                const p1 = waypoints[i];
                const p2 = waypoints[i+1];
                const R = 6371e3; // metres
                const φ1 = p1.lat * Math.PI/180;
                const φ2 = p2.lat * Math.PI/180;
                const Δφ = (p2.lat-p1.lat) * Math.PI/180;
                const Δλ = (p2.lng-p1.lng) * Math.PI/180;

                const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ/2) * Math.sin(Δλ/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                mockDistance += R * c;
            }

            // Add simulated variance to the mock distance so the fuzzy logic has something to work with
            const variance = 0.85 + (Math.random() * 0.1); 
            mockDistance = mockDistance * variance;

            return {
                distance: mockDistance,
                duration: mockDistance / 1.4, // approx 1.4 m/s walking speed
                coordinates: waypoints.map(p => [p.lat, p.lng]),
                waypoints: waypoints,
                isMock: true
            };
        }
    },

    /**
     * Fuzzy distance matching with recursive scaling.
     */
    findOptimizedRoute: async function(lat, lng, targetDistanceMeters, options = {}) {
        const {
            maxRetries = 5,
            currentAttempt = 1,
            radiusFactor = 1.0,
            sides = 6,
            startAtLocation = true
        } = options;

        console.log(`Generating route... Attempt ${currentAttempt}, Target: ${targetDistanceMeters}m`);
        
        const waypoints = this.generateGeometricLoop(lat, lng, targetDistanceMeters, radiusFactor, sides, startAtLocation);
        const routeData = await this.fetchOSRMRoute(waypoints);

        const errorMargin = Math.abs(routeData.distance - targetDistanceMeters) / targetDistanceMeters;
        const ACCEPTABLE_ERROR = 0.10; // Accept within 10%

        if (errorMargin > ACCEPTABLE_ERROR && currentAttempt < maxRetries) {
            console.log(`Distance ${Math.round(routeData.distance)}m is off target. Recalculating...`);
            
            // If the route is drastically longer than target, dropping a waypoint might fix huge detours
            if (routeData.distance > targetDistanceMeters * 1.2 && sides > 3) {
                 console.log("Dropping a major stop to reduce detour distance...");
                 return this.findOptimizedRoute(lat, lng, targetDistanceMeters, {
                     ...options,
                     currentAttempt: currentAttempt + 1,
                     sides: sides - 1,
                     radiusFactor: radiusFactor
                 });
            }

            // Adjust radius proportional to the error, with dampening
            const correctionFactor = targetDistanceMeters / routeData.distance;
            const newRadiusFactor = radiusFactor * (0.6 + (0.4 * correctionFactor));
            
            return this.findOptimizedRoute(lat, lng, targetDistanceMeters, {
                ...options,
                currentAttempt: currentAttempt + 1,
                radiusFactor: newRadiusFactor
            });
        }

        console.log(`Route finalized at ${Math.round(routeData.distance)}m after ${currentAttempt} attempts.`);
        return routeData;
    },

    /**
     * Calculates kilometer-by-kilometer splits for a given distance and pace.
     * @param {number} totalDistanceMeters 
     * @param {number} avgPaceMinPerKm 
     * @returns {Array} Array of {km, time}
     */
    calculateSplits: function(totalDistanceMeters, avgPaceMinPerKm = 5.5) {
        const totalKm = totalDistanceMeters / 1000;
        const splits = [];
        
        for (let i = 1; i <= Math.ceil(totalKm); i++) {
            // Add slight variance to pace for realism (±5%)
            const variance = 0.95 + (Math.random() * 0.1);
            const pace = avgPaceMinPerKm * variance;
            
            const mins = Math.floor(pace);
            const secs = Math.round((pace - mins) * 60);
            const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
            
            splits.push({
                km: i,
                time: timeStr
            });
        }
        return splits;
    },

    /**
     * Generates a standard GPX format string and triggers a file download in the browser.
     */
    exportToGPX: function(routeData) {
        let gpx = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        gpx += `<gpx version="1.1" creator="run.to Monolith" xmlns="http://www.topografix.com/GPX/1/1">\n`;
        gpx += `  <trk>\n`;
        gpx += `    <name>Generated Run</name>\n`;
        gpx += `    <trkseg>\n`;
        
        routeData.coordinates.forEach(coord => {
            // Leaflet/OSRM coordinates are [lat, lng]
            gpx += `      <trkpt lat="${coord[0]}" lon="${coord[1]}"></trkpt>\n`;
        });
        
        gpx += `    </trkseg>\n`;
        gpx += `  </trk>\n`;
        gpx += `</gpx>`;

        // Create a blob and trigger download
        const blob = new Blob([gpx], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `run_to_route_${Math.round(routeData.distance)}m.gpx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
