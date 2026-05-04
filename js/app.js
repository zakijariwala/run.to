// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // UI Elements
    const themeSelect = document.getElementById('theme-select');
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const appLogo = document.getElementById('app-logo');
    const statusText = document.getElementById('status-text');
    const modeDistance = document.getElementById('mode-distance');
    const modeTime = document.getElementById('mode-time');
    const inputLabel = document.getElementById('input-label');
    const inputDisplay = document.getElementById('input-display');
    const inputSlider = document.getElementById('input-slider');
    const inputUnit = document.getElementById('input-unit');
    const btnGenerate = document.getElementById('btn-generate');
    const btnExportGpx = document.getElementById('btn-export-gpx');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.querySelector('.results-stack');
    const resultDistance = document.getElementById('result-distance');
    const resultTime = document.getElementById('result-time');
    const splitsList = document.getElementById('splits-list');
    const loadingOverlay = document.getElementById('loading-overlay');
    const btnGoogleMaps = document.getElementById('btn-google-maps');
    const toggleNearby = document.getElementById('toggle-nearby');
    const locationBlocker = document.getElementById('location-blocker');
    const btnRetryLocation = document.getElementById('btn-retry-location');
    const btnSkipLocation = document.getElementById('btn-skip-location');

    // Themes Data
    const THEMES = {
        'run.to': { logo: 'run.to', status: 'Sky Talker OK', distance: 'Distance', time: 'Time', hunt: 'Target Distance', run: 'Target Time', start: 'Start exactly here', path: 'Generated Route', length: 'Distance', speed: 'Time', foot: 'Pace & Splits', rest: 'Major Stops', map: 'Open in Google Maps', carve: 'Export GPX', find: 'Generate Route', thinking: 'Calculating Path...' },
        'stone.to': { logo: 'Big Stone', status: 'Sky Talker OK', distance: 'How Far', time: 'How Long', hunt: 'Hunt Size', run: 'Run Time', start: 'Start at Cave', path: 'Path Found', length: 'Length', speed: 'Speed', foot: 'Foot Speed', rest: 'Rest Rocks', map: 'Show Big Map', carve: 'Carve Rock', find: 'Find Loop', thinking: 'Thinking...' },
        'cyber.to': { logo: 'cyber.to', status: 'SYSTEM ONLINE', distance: 'RANGE', time: 'UPTIME', hunt: 'TARGET RANGE', run: 'TARGET UPTIME', start: 'GEO-SYNC HERE', path: 'LINK ESTABLISHED', length: 'KM', speed: 'MIN', foot: 'TELEMETRY', rest: 'NODES', map: 'EXTERNAL HUD', carve: 'DOWNLOAD DATA', find: 'SYNC PATH', thinking: 'UPLOADING...' },
        'steam.to': { logo: 'steam.to', status: 'BOILER PRESSURE OK', distance: 'MILEAGE', time: 'CHRONO', hunt: 'GOAL MILES', run: 'GOAL TIME', start: 'STATION START', path: 'MAP DRAWN', length: 'DISTANCE', speed: 'DURATION', foot: 'VALVE TIMING', rest: 'DEPOTS', map: 'CHART COURSE', carve: 'PRINT TICKET', find: 'IGNITE ENGINE', thinking: 'STEAMING...' },
        'pastel.to': { logo: 'pastel.to', status: 'All Good!', distance: 'Dist.', time: 'Time', hunt: 'Goal Dist.', run: 'Goal Time', start: 'Start Here', path: 'My Route', length: 'Length', speed: 'Time', foot: 'My Pace', rest: 'Stops', map: 'Open Maps', carve: 'Save Route', find: 'Go!', thinking: 'Working...' },
        'void.to': { logo: 'void.to', status: '...', distance: 'D', time: 'T', hunt: 'D_TARGET', run: 'T_TARGET', start: 'START', path: 'ROUTE', length: 'D', speed: 'T', foot: 'PACE', rest: 'WAYPOINTS', map: 'MAPS', carve: 'GPX', find: 'RUN', thinking: '...' },
        'neon.to': { logo: 'neon.to', status: 'VIBE CHECK OK', distance: 'GLIDE', time: 'BEAT', hunt: 'GLIDE TARGET', run: 'BEAT TARGET', start: 'DROP IN', path: 'GLOW PATH', length: 'KM', speed: 'MIN', foot: 'RHYTHM', rest: 'CHILL SPOTS', map: 'RETRO MAP', carve: 'BURN GPX', find: 'VIBE ON', thinking: 'CHARGING...' },
        'retro.to': { logo: 'retro.to', status: 'LEVEL 1-1', distance: 'SCORE', time: 'TIMER', hunt: 'GOAL SCORE', run: 'GOAL TIME', start: 'INSERT COIN', path: 'STAGE MAP', length: 'DIST', speed: 'TIME', foot: 'STATS', rest: 'POWER-UPS', map: 'WORLD MAP', carve: 'SAVE GAME', find: 'START GAME', thinking: 'LOADING...' },
        'paper.to': { logo: 'paper.to', status: 'INK DRIED', distance: 'Length', time: 'Duration', hunt: 'Target Length', run: 'Target Duration', start: 'Origin', path: 'Drafted Path', length: 'KM', speed: 'MIN', foot: 'Pace', rest: 'Checkpoints', map: 'Atlas', carve: 'Publish', find: 'Write Path', thinking: 'Drafting...' },
        'glass.to': { logo: 'glass.to', status: 'Crystal Clear', distance: 'Distance', time: 'Time', hunt: 'Goal Distance', run: 'Goal Time', start: 'Pinpoint', path: 'Refracted Route', length: 'KM', speed: 'MIN', foot: 'Pace', rest: 'Focal Points', map: 'Horizon', carve: 'Crystallize', find: 'Focus', thinking: 'Processing...' },
        'moss.to': { logo: 'moss.to', status: 'Nature Pulse OK', distance: 'Trail', time: 'Sun', hunt: 'Trail Length', run: 'Sun Duration', start: 'Sprout', path: 'Root Path', length: 'KM', speed: 'MIN', foot: 'Growth', rest: 'Shelters', map: 'Wild Map', carve: 'Seed GPX', find: 'Grow Route', thinking: 'Blooming...' },
        'blood.to': { logo: 'blood.to', status: 'Pulse Detected', distance: 'Hunt', time: 'Night', hunt: 'Hunt Target', run: 'Night Target', start: 'Lair', path: 'Cursed Path', length: 'KM', speed: 'MIN', foot: 'Heartbeat', rest: 'Altars', map: 'Hellscape', carve: 'Scribe', find: 'Sacrifice', thinking: 'Summoning...' },
        'gold.to': { logo: 'gold.to', status: 'Prestige Active', distance: 'Journey', time: 'Era', hunt: 'Journey Goal', run: 'Era Goal', start: 'Estate', path: 'Golden Path', length: 'KM', speed: 'MIN', foot: 'Elegance', rest: 'Resorts', map: 'Concierge', carve: 'Mint', find: 'Refine', thinking: 'Polishing...' }
    };

    // State
    let currentMode = 'distance'; // 'distance' or 'time'
    let currentRouteData = null;
    let map = null;
    let routePolyline = null;
    let startMarker = null;
    let userLocation = { lat: 51.505, lng: -0.09 }; // Default: London

    // Animation Module
    const Animate = {
        spring(el, props, duration = 300) {
            el.style.transition = `all ${duration}ms var(--spring)`;
            Object.assign(el.style, props);
        },
        
        staggerEntry(selector) {
            const items = document.querySelectorAll(selector);
            items.forEach((item, i) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    this.spring(item, { opacity: '1', transform: 'translateY(0)' });
                }, i * 60);
            });
        },

        tweenNumber(el, end, duration = 800, suffix = '') {
            const currentText = el.innerText.split(' ')[0];
            const start = parseFloat(currentText) || 0;
            const startTime = performance.now();
            
            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const current = start + (end - start) * ease;
                
                const valStr = current.toFixed(end % 1 === 0 ? 0 : 1);
                el.innerHTML = `${valStr} <span class="data-unit-suffix">${suffix}</span>`;
                
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        }
    };

    // Theme Management
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme-pref', theme);
        themeSelect.value = theme;

        const data = THEMES[theme] || THEMES['run.to'];
        
        // Update Text
        appLogo.innerText = data.logo;
        statusText.innerText = data.status;
        
        modeDistance.innerText = data.distance;
        modeTime.innerText = data.time;
        inputLabel.innerText = currentMode === 'distance' ? data.hunt : data.run;

        const startLabel = document.querySelector('.hud-toggle-label');
        if (startLabel) startLabel.innerHTML = `<i data-lucide="map-pin" class="w-3 h-3 text-accent"></i> ${data.start}`;
        
        const pathLabel = document.querySelector('#results-section label');
        if (pathLabel) pathLabel.innerHTML = `<i data-lucide="map" class="w-3 h-3 text-accent"></i> ${data.path}`;
        
        const headers = document.querySelectorAll('.telemetry-header');
        headers.forEach(h => {
            const txt = h.innerText.toUpperCase();
            if (txt === 'LENGTH' || txt === 'DISTANCE') h.innerText = data.length;
            if (txt === 'SPEED' || txt === 'TIME') h.innerText = data.speed;
            if (txt === 'TELEMETRY' || txt === 'PACE & SPLITS' || txt === 'FOOT SPEED') h.innerHTML = `<i data-lucide="timer" class="w-3 h-3 text-accent"></i> ${data.foot}`;
            if (txt === 'REST ROCKS' || txt === 'MAJOR STOPS') h.innerHTML = `<i data-lucide="map-pin" class="w-3 h-3 text-emerald-400"></i> ${data.rest}`;
        });
        
        if (btnGoogleMaps) btnGoogleMaps.innerText = data.map;
        if (btnGenerate) btnGenerate.innerHTML = `<i data-lucide="play" class="w-5 h-5"></i> ${data.find}`;
        
        const loadingText = document.querySelector('#loading-overlay div:nth-child(2)');
        if (loadingText) loadingText.innerText = data.thinking;

        lucide.createIcons();

        // Update Map Accent
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        if (routePolyline) routePolyline.setStyle({ color: accent });
        if (startMarker) startMarker.setStyle({ fillColor: accent });
    }

    themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));

    // Dark Mode Logic
    function toggleDarkMode(force) {
        const isDark = force !== undefined ? force : !document.body.classList.contains('dark');
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('dark-mode', isDark);
        
        if (themeToggleIcon) {
            themeToggleIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            lucide.createIcons();
        }
        
        // Refresh theme colors
        applyTheme(themeSelect.value);
    }

    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            toggleDarkMode();
            // Tactile feedback: spring scale
            Animate.spring(btnThemeToggle, { transform: 'scale(0.95)' });
            setTimeout(() => Animate.spring(btnThemeToggle, { transform: 'scale(1)' }), 100);
        });
    }

    // Initialize Map
    function initMap() {
        map = L.map('map', { zoomControl: false, attributionControl: false }).setView([userLocation.lat, userLocation.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || "#00bcd4";
        startMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
            radius: 8, fillColor: accent, color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8
        }).addTo(map);
    }

    // Geolocation
    function locateUser() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                locationBlocker.classList.add('hidden');
                userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                if (map) {
                    map.setView([userLocation.lat, userLocation.lng], 14);
                    startMarker.setLatLng([userLocation.lat, userLocation.lng]);
                }
            }, (error) => {
                locationBlocker.classList.remove('hidden');
            }, { enableHighAccuracy: true });
        }
    }

    // Slider Logic
    function updateSliderTrack() {
        const val = inputSlider.value;
        const min = inputSlider.min ? inputSlider.min : 0;
        const max = inputSlider.max ? inputSlider.max : 100;
        const pct = ((val - min) / (max - min)) * 100;
        inputSlider.style.setProperty('--pct', pct + '%');
    }

    inputSlider.addEventListener('input', (e) => {
        updateSliderTrack();
        inputDisplay.innerText = currentMode === 'distance' ? parseFloat(e.target.value).toFixed(1) : parseInt(e.target.value);
    });

    // UI Event Listeners
    modeDistance.addEventListener('click', () => {
        currentMode = 'distance';
        modeDistance.classList.add('active-tab');
        modeTime.classList.remove('active-tab');
        
        const theme = themeSelect.value;
        const data = THEMES[theme] || THEMES['run.to'];
        inputLabel.innerText = data.hunt;
        inputSlider.min = '1'; inputSlider.max = '20'; inputSlider.step = '0.5'; inputSlider.value = '5';
        inputDisplay.innerText = '5.0'; inputUnit.innerText = 'km';
        updateSliderTrack();
    });

    modeTime.addEventListener('click', () => {
        currentMode = 'time';
        modeTime.classList.add('active-tab');
        modeDistance.classList.remove('active-tab');

        const theme = themeSelect.value;
        const data = THEMES[theme] || THEMES['run.to'];
        inputLabel.innerText = data.run;
        inputSlider.min = '10'; inputSlider.max = '120'; inputSlider.step = '5'; inputSlider.value = '30';
        inputDisplay.innerText = '30'; inputUnit.innerText = 'min';
        updateSliderTrack();
    });

    btnGenerate.addEventListener('click', async () => {
        const distanceMeters = currentMode === 'distance' ? parseFloat(inputSlider.value) * 1000 : (parseInt(inputSlider.value) / 5.5) * 1000;
        const theme = themeSelect.value;
        const data = THEMES[theme] || THEMES['run.to'];

        btnGenerate.disabled = true;
        btnGenerate.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> ${data.thinking}`;
        lucide.createIcons();
        
        resultsSection.classList.remove('hidden');

        try {
            currentRouteData = await RouteEngine.findOptimizedRoute(userLocation.lat, userLocation.lng, distanceMeters, {
                startAtLocation: toggleNearby.checked
            });

            if (routePolyline) map.removeLayer(routePolyline);

            const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            routePolyline = L.polyline(currentRouteData.coordinates, {
                color: accent, weight: 6, opacity: 0.9, lineJoin: 'round'
            }).addTo(map);

            // Path draw animation
            const path = routePolyline._path;
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            setTimeout(() => {
                path.style.transition = 'stroke-dashoffset 1.5s var(--spring)';
                path.style.strokeDashoffset = '0';
            }, 50);

            map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });

            // Animate Results
            Animate.staggerEntry('.animate-entry');
            Animate.tweenNumber(resultDistance, currentRouteData.distance / 1000, 1000, 'km');
            Animate.tweenNumber(resultTime, Math.round((currentRouteData.distance / 1000) * 5.5), 1000, 'm');

            const splits = RouteEngine.calculateSplits(currentRouteData.distance, 5.5);
            splitsList.innerHTML = splits.map((s, i) => `
                <div class="telemetry-row animate-row" style="opacity:0; transform:translateY(8px); transition: all 300ms var(--spring); transition-delay: ${i * 40}ms">
                    <span class="telemetry-label">KM ${s.km}</span>
                    <span class="telemetry-value">${s.time}</span>
                </div>
            `).join('');
            
            // Trigger row animations
            setTimeout(() => {
                document.querySelectorAll('.animate-row').forEach(r => {
                    r.style.opacity = '1';
                    r.style.transform = 'translateY(0)';
                });
            }, 100);

            if (currentRouteData.waypoints) {
                const origin = `${currentRouteData.waypoints[0].lat},${currentRouteData.waypoints[0].lng}`;
                const via = currentRouteData.waypoints.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
                btnGoogleMaps.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${origin}&waypoints=${via}&travelmode=walking`;
            }

        } finally {
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = `<i data-lucide="play" class="w-5 h-5"></i> ${data.find}`;
            lucide.createIcons();
        }
    });

    // Boot
    initMap();
    locateUser();
    updateSliderTrack();
    
    // Init Dark Mode
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true' || 
                         (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    toggleDarkMode(savedDarkMode);

    applyTheme(localStorage.getItem('theme-pref') || 'run.to');

    // Drag Handle Logic (Restored & Enhanced)
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
            bottomSheet.style.transition = 'none';
            bottomSheet.style.transform = `translateY(${y}px)`;
        }

        dragHandle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            sheetHeight = bottomSheet.offsetHeight;
            isDragging = true;
        }, {passive: true});

        dragHandle.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const deltaY = e.touches[0].clientY - startY;
            currentY = isCollapsed ? (sheetHeight - 60) + deltaY : deltaY;
            if (currentY < 0) currentY = 0;
            if (currentY > sheetHeight - 60) currentY = sheetHeight - 60;
            setSheetPosition(currentY);
        }, {passive: true});

        dragHandle.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const threshold = sheetHeight * 0.2;
            if (isCollapsed) {
                if (currentY < (sheetHeight - 60) - threshold) {
                    isCollapsed = false;
                    Animate.spring(bottomSheet, { transform: 'translateY(0)' });
                } else {
                    Animate.spring(bottomSheet, { transform: `translateY(${sheetHeight - 60}px)` });
                }
            } else {
                if (currentY > threshold) {
                    isCollapsed = true;
                    Animate.spring(bottomSheet, { transform: `translateY(${sheetHeight - 60}px)` });
                } else {
                    Animate.spring(bottomSheet, { transform: 'translateY(0)' });
                }
            }
        });

        dragHandle.addEventListener('click', () => {
            sheetHeight = bottomSheet.offsetHeight;
            isCollapsed = !isCollapsed;
            Animate.spring(bottomSheet, { transform: isCollapsed ? `translateY(${sheetHeight - 60}px)` : 'translateY(0)' });
        });
        
        if (window.innerWidth < 768) {
            map.on('click', () => {
                if (!isCollapsed) {
                    sheetHeight = bottomSheet.offsetHeight;
                    isCollapsed = true;
                    Animate.spring(bottomSheet, { transform: `translateY(${sheetHeight - 60}px)` });
                }
            });
        }
    }
});
