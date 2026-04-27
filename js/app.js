// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // UI Elements
    const modeDistance = document.getElementById('mode-distance');
    const modeTime = document.getElementById('mode-time');
    const inputLabel = document.getElementById('input-label');
    const inputDisplay = document.getElementById('input-display');
    const inputSlider = document.getElementById('input-slider');
    const inputTicks = document.getElementById('input-ticks');
    const btnGenerate = document.getElementById('btn-generate');
    const btnExportGpx = document.getElementById('btn-export-gpx');
    const resultsSection = document.getElementById('results-section');
    const resultDistance = document.getElementById('result-distance');
    const resultTime = document.getElementById('result-time');
    const loadingOverlay = document.getElementById('loading-overlay');
    const mockWarning = document.getElementById('mock-warning');
    const btnGoogleMaps = document.getElementById('btn-google-maps');
    const locationBlocker = document.getElementById('location-blocker');
    const btnRetryLocation = document.getElementById('btn-retry-location');
    const btnSkipLocation = document.getElementById('btn-skip-location');

    // State
    let currentMode = 'distance'; // 'distance' or 'time'
    let currentRouteData = null;
    let map = null;
    let routePolyline = null;
    let startMarker = null;
    let userLocation = { lat: 51.505, lng: -0.09 }; // Default: London

    // Initialize Map
    function initMap() {
        map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        }).setView([userLocation.lat, userLocation.lng], 13);

        // Standard OSM tiles (inverted via CSS for dark mode)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        startMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
            radius: 8,
            fillColor: "#22d3ee",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
    }

    // Geolocation
    function locateUser() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    locationBlocker.classList.add('hidden');
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    if (map) {
                        map.setView([userLocation.lat, userLocation.lng], 14);
                        startMarker.setLatLng([userLocation.lat, userLocation.lng]);
                    }
                },
                (error) => {
                    console.warn("Geolocation denied or failed.", error);
                    locationBlocker.classList.remove('hidden');
                    
                    if (error.code === 1) {
                        const title = locationBlocker.querySelector('h2');
                        const desc = locationBlocker.querySelector('p.text-sm');
                        
                        // Detect if the denial is due to HTTP testing
                        if (error.message && error.message.toLowerCase().includes('secure')) {
                            if (title) title.innerText = "HTTPS Required";
                            if (desc) desc.innerHTML = "Your browser blocks location services on non-secure connections. To test locally, you must access this via <strong>http://localhost:8000</strong> on your desktop, or deploy to a secure server (HTTPS).";
                        } else {
                            if (title) title.innerText = "Permission Blocked";
                            if (desc) desc.innerHTML = "Your browser is blocking location access. <strong>You must click the 'Lock' icon in your URL bar</strong> (or check Safari Settings on iOS) to manually allow access, then try again.";
                        }
                    }
                },
                { enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    btnRetryLocation.addEventListener('click', () => {
        // Must call locateUser synchronously to preserve the user gesture context for iOS Safari
        locateUser();
        
        // Show loading state on retry button briefly
        const originalText = btnRetryLocation.innerHTML;
        btnRetryLocation.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Requesting...`;
        lucide.createIcons();
        
        // Revert button text after a short delay
        setTimeout(() => {
            btnRetryLocation.innerHTML = originalText;
            lucide.createIcons();
        }, 1000);
    });

    if (btnSkipLocation) {
        btnSkipLocation.addEventListener('click', () => {
            locationBlocker.classList.add('hidden');
        });
    }

    // UI Event Listeners
    modeDistance.addEventListener('click', () => {
        currentMode = 'distance';
        modeDistance.classList.add('bg-accent', 'text-bg', 'shadow-sm');
        modeDistance.classList.remove('hover:text-text');
        modeTime.classList.remove('bg-accent', 'text-bg', 'shadow-sm');
        modeTime.classList.add('hover:text-text');

        inputLabel.innerText = 'Target Distance';
        inputSlider.min = '1';
        inputSlider.max = '20';
        inputSlider.step = '0.5';
        inputSlider.value = '5';
        inputDisplay.innerHTML = `5.0<span class="text-xs text-text-dim ml-1 uppercase" id="input-unit">km</span>`;
        inputTicks.innerHTML = `<span>1KM</span><span>10KM</span><span>20KM</span>`;
    });

    modeTime.addEventListener('click', () => {
        currentMode = 'time';
        modeTime.classList.add('bg-accent', 'text-bg', 'shadow-sm');
        modeTime.classList.remove('hover:text-text');
        modeDistance.classList.remove('bg-accent', 'text-bg', 'shadow-sm');
        modeDistance.classList.add('hover:text-text');

        inputLabel.innerText = 'Target Time';
        inputSlider.min = '10';
        inputSlider.max = '120';
        inputSlider.step = '5';
        inputSlider.value = '30';
        inputDisplay.innerHTML = `30<span class="text-xs text-text-dim ml-1 uppercase" id="input-unit">min</span>`;
        inputTicks.innerHTML = `<span>10M</span><span>60M</span><span>120M</span>`;
    });

    inputSlider.addEventListener('input', (e) => {
        if (currentMode === 'distance') {
            const val = parseFloat(e.target.value).toFixed(1);
            inputDisplay.innerHTML = `${val}<span class="text-xs text-text-dim ml-1 uppercase" id="input-unit">km</span>`;
        } else {
            const val = parseInt(e.target.value);
            inputDisplay.innerHTML = `${val}<span class="text-xs text-text-dim ml-1 uppercase" id="input-unit">min</span>`;
        }
    });

    btnGenerate.addEventListener('click', async () => {
        let distanceMeters = 0;
        if (currentMode === 'distance') {
            distanceMeters = parseFloat(inputSlider.value) * 1000;
        } else {
            // Convert time to distance based on 5.5 min/km running pace
            const targetMins = parseInt(inputSlider.value);
            distanceMeters = (targetMins / 5.5) * 1000;
        }

        // UI Loading State
        btnGenerate.disabled = true;
        btnGenerate.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Generating`;
        lucide.createIcons();
        loadingOverlay.classList.remove('hidden');
        setTimeout(() => loadingOverlay.classList.remove('opacity-0'), 10);
        resultsSection.classList.add('opacity-0');

        try {
            // Call Route Engine
            currentRouteData = await RouteEngine.findOptimizedRoute(userLocation.lat, userLocation.lng, distanceMeters);

            // Draw on map
            if (routePolyline) {
                map.removeLayer(routePolyline);
            }

            routePolyline = L.polyline(currentRouteData.coordinates, {
                color: '#22d3ee',
                weight: 5,
                opacity: 0.9,
                lineJoin: 'round'
            }).addTo(map);

            map.invalidateSize();
            
            // Adjust padding to ensure the route isn't hidden behind the mobile bottom sheet
            const isMobile = window.innerWidth < 768;
            const bottomPad = isMobile ? window.innerHeight * 0.55 : 50;
            
            map.fitBounds(routePolyline.getBounds(), { 
                paddingTopLeft: [50, 50],
                paddingBottomRight: [50, bottomPad]
            });

            // Update UI Results
            resultDistance.innerText = (currentRouteData.distance / 1000).toFixed(2) + ' km';
            
            // Estimate running time based on an average 5.5 min/km pace
            const estimatedMins = Math.round((currentRouteData.distance / 1000) * 5.5);
            resultTime.innerText = estimatedMins + ' m';
            
            // Generate Google Maps Link
            if (currentRouteData.waypoints && currentRouteData.waypoints.length > 0) {
                const origin = `${currentRouteData.waypoints[0].lat},${currentRouteData.waypoints[0].lng}`;
                const destination = origin; // Closed loop
                const viaWaypoints = currentRouteData.waypoints.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${viaWaypoints}&travelmode=walking`;
                btnGoogleMaps.href = mapsUrl;
            }
            
            if (currentRouteData.isMock) {
                mockWarning.classList.remove('hidden');
            } else {
                mockWarning.classList.add('hidden');
            }

            // Show Results pane
            resultsSection.classList.remove('hidden');
            setTimeout(() => resultsSection.classList.remove('opacity-0'), 100);

        } catch (error) {
            console.error("Error generating route:", error);
            alert("Failed to generate route. Check console for details.");
        } finally {
            // Restore UI
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> Generate Route`;
            lucide.createIcons();
            loadingOverlay.classList.add('opacity-0');
            setTimeout(() => loadingOverlay.classList.add('hidden'), 300);
        }
    });

    btnExportGpx.addEventListener('click', () => {
        if (currentRouteData) {
            RouteEngine.exportToGPX(currentRouteData);
        }
    });

    // Boot
    initMap();
    locateUser();

    // Bottom Sheet Swipe Logic
    const bottomSheet = document.getElementById('bottom-sheet');
    const dragHandle = document.getElementById('drag-handle');
    
    if (bottomSheet && dragHandle) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        let sheetHeight = 0;
        let isCollapsed = false;

        function setSheetPosition(y) {
            if (y < 0) y = 0;
            bottomSheet.style.transform = `translateY(${y}px)`;
        }

        dragHandle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            sheetHeight = bottomSheet.offsetHeight;
            isDragging = true;
            bottomSheet.style.transition = 'none';
        }, {passive: true});

        dragHandle.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const deltaY = e.touches[0].clientY - startY;
            
            if (isCollapsed) {
                currentY = (sheetHeight - 40) + deltaY;
            } else {
                currentY = deltaY;
            }
            
            if (currentY < 0) currentY = 0;
            if (currentY > sheetHeight - 40) currentY = sheetHeight - 40;
            
            setSheetPosition(currentY);
        }, {passive: true});

        dragHandle.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            bottomSheet.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
            
            const threshold = sheetHeight * 0.2;
            
            if (isCollapsed) {
                if (currentY < (sheetHeight - 40) - threshold) {
                    isCollapsed = false;
                    setSheetPosition(0);
                } else {
                    setSheetPosition(sheetHeight - 40);
                }
            } else {
                if (currentY > threshold) {
                    isCollapsed = true;
                    setSheetPosition(sheetHeight - 40);
                } else {
                    setSheetPosition(0);
                }
            }
        });

        dragHandle.addEventListener('click', () => {
            sheetHeight = bottomSheet.offsetHeight;
            bottomSheet.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
            isCollapsed = !isCollapsed;
            setSheetPosition(isCollapsed ? sheetHeight - 40 : 0);
        });
        
        // Auto-collapse slightly when map is clicked
        map.on('click', () => {
            if (!isCollapsed && window.innerWidth < 768) {
                sheetHeight = bottomSheet.offsetHeight;
                bottomSheet.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
                isCollapsed = true;
                setSheetPosition(sheetHeight - 40);
            }
        });
    }

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').then(reg => {
                console.log('Service Worker registered with scope:', reg.scope);
            }).catch(err => {
                console.warn('Service Worker registration failed:', err);
            });
        });
    }
});
