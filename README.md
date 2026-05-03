# run.to | Open Engine

A modern, PWA-ready running route generator that creates optimized, closed-loop paths based on target distance or time. Built for runners who want a fresh route every time they step out the door.

![run.to Preview](pic.png)

## 🚀 Features

- **Geometric Loop Generation**: Intelligently calculates closed-loop routes starting and ending at your current location.
- **Distance & Time Targets**: Generate routes by kilometer target or by estimated running time.
- **Pace & Splits**: Automatic kilometer-by-kilometer split estimation based on an average 5.5 min/km pace.
- **OSRM Snapping**: Geometric shapes are "snapped" to real walkable paths using the Open Source Routing Machine (OSRM) API.
- **Fluid UI**: Modern "Cyber-Dark" aesthetic with skeleton loading states and interactive Leaflet maps.
- **Mobile Optimized**: Bottom-sheet navigation and touch-friendly controls designed for on-the-go use.
- **Export Options**: 
    - One-tap export to **Google Maps** for turn-by-turn navigation.
    - Download standards-compliant **GPX files** for Garmin, Strava, or Apple Watch.
- **Offline Ready**: PWA support with service worker caching for use in areas with poor connectivity.

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), Tailwind CSS
- **Mapping**: [Leaflet.js](https://leafletjs.com/)
- **Routing**: [OSRM API](http://project-osrm.org/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Fonts**: Inter & JetBrains Mono

## 🏁 Getting Started

### Prerequisites
- A modern web browser with Geolocation support.
- **Important**: To use location services locally, access the app via `http://localhost` or a secure `https://` connection. Browsers block location on non-secure `http://` IP addresses.

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/zakijariwala/run.to.git
   ```
2. Open `index.html` in your browser (preferably via a local server like `npx serve` or Live Server).

## 🧠 How it Works

The "Monolith" engine uses a fuzzy-logic recursive algorithm:
1. It creates a geometric polygon (e.g., a hexagon) around a calculated center point near the user.
2. It sends these waypoints to the OSRM API to get a real-world walkable path.
3. It compares the result to the user's target.
4. If the distance is off, it scales the radius and waypoint count, then retries until the margin of error is <10%.

## 📄 License
MIT License - feel free to use and modify for your own running adventures.
