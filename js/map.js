// map.js - Leaflet/OpenStreetMap based map rendering

import {
    INTEL_HOTSPOTS, REGION_KEYWORDS,
    US_HOTSPOTS, MIDEAST_HOTSPOTS, UKRAINE_HOTSPOTS, TAIWAN_HOTSPOTS,
    EUROPE_HOTSPOTS, ASIA_HOTSPOTS, RUSSIA_HOTSPOTS,
    LOCATION_COORDS
} from './constants.js';
import { escapeHtml, getTimeAgo } from './utils.js';

// Map state
let map = null;
let markersLayer = null;
let hotspotMarkers = null;
let currentView = 'global';

// Region definitions with center coords and zoom levels
const REGIONS = {
    'global': { center: [20, 0], zoom: 2, title: 'GLOBAL ACTIVITY MONITOR' },
    'us': { center: [39, -98], zoom: 4, title: 'UNITED STATES' },
    'europe': { center: [54, 15], zoom: 4, title: 'EUROPE' },
    'asia': { center: [25, 105], zoom: 3, title: 'ASIA-PACIFIC' },
    'russia': { center: [60, 80], zoom: 3, title: 'RUSSIA & EURASIA' },
    'mideast': { center: [29, 42], zoom: 5, title: 'MIDDLE EAST' },
    'ukraine': { center: [48.5, 35], zoom: 6, title: 'UKRAINE CONFLICT ZONE' },
    'taiwan': { center: [24, 121], zoom: 6, title: 'TAIWAN STRAIT' }
};

// Export state getters/setters
export function getMapViewMode() { return currentView; }
export function getMapZoom() { return map ? map.getZoom() : 2; }
export function getMapPan() { return map ? map.getCenter() : { lat: 0, lng: 0 }; }

// Map control functions
export function mapZoomIn() {
    if (map) map.zoomIn();
}

export function mapZoomOut() {
    if (map) map.zoomOut();
}

export function mapZoomReset() {
    if (map) {
        const region = REGIONS[currentView] || REGIONS['global'];
        map.setView(region.center, region.zoom);
    }
}

// Set map view to a specific region
export function setMapView(mode, refreshCallback) {
    currentView = mode;
    if (map) {
        const region = REGIONS[mode] || REGIONS['global'];
        map.flyTo(region.center, region.zoom, { duration: 1 });
        
        // Update title
        const titleEl = document.querySelector('.panel[data-panel="map"] .panel-title');
        if (titleEl) titleEl.textContent = region.title;
        
        // Update map view buttons
        document.querySelectorAll('.map-view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });
        
        // Also sync the header region filter buttons
        const headerRegion = mode === 'global' ? 'all' : mode;
        document.querySelectorAll('.region-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.region === headerRegion);
        });
    }
    if (refreshCallback) refreshCallback();
}

// Flashback feature (placeholder - can be expanded)
export function updateFlashback() {
    console.log('Flashback feature - to be implemented with historical data');
}

// Location priority - more specific locations should be preferred over general regions
const LOCATION_PRIORITY = {
    // Cities are most specific (priority 3)
    'kyiv': 3, 'moscow': 3, 'beijing': 3, 'taipei': 3, 'jerusalem': 3, 'tehran': 3,
    'washington': 3, 'london': 3, 'paris': 3, 'berlin': 3, 'tokyo': 3, 'seoul': 3,
    'tallinn': 3, 'riga': 3, 'vilnius': 3, 'warsaw': 3, 'cairo': 3, 'baghdad': 3,
    // Countries are medium specific (priority 2)
    'ukraine': 2, 'russia': 2, 'china': 2, 'taiwan': 2, 'israel': 2, 'iran': 2,
    'usa': 2, 'united states': 2, 'germany': 2, 'france': 2, 'uk': 2, 'japan': 2,
    'greenland': 2, 'denmark': 2, 'estonia': 2, 'latvia': 2, 'lithuania': 2, 'poland': 2,
    // Regions are least specific (priority 1)
    'europe': 1, 'asia': 1, 'middle east': 1, 'arctic': 1, 'baltic': 1, 'mediterranean': 1
};

// Get location priority (higher = more specific)
function getLocationPriority(keyword) {
    return LOCATION_PRIORITY[keyword.toLowerCase()] || 2; // Default to country-level
}

// Analyze hotspot activity based on news mentions
// Each article is assigned to its MOST SPECIFIC matching location only
export function analyzeHotspotActivity(allNews) {
    const activity = {};
    
    if (!allNews || allNews.length === 0) return activity;
    
    // For each news item, find the BEST matching location (most specific)
    allNews.forEach(item => {
        const title = (item.title || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const text = title + ' ' + desc;
        const topics = (item.topics || []).map(t => t.toLowerCase());
        
        // Find all matching locations with their priorities
        const matches = [];
        Object.entries(LOCATION_COORDS).forEach(([keyword, coords]) => {
            const keywordLower = keyword.toLowerCase();
            // Check if keyword appears in title (higher weight) or description/topics
            const inTitle = title.includes(keywordLower);
            const inText = text.includes(keywordLower) || topics.includes(keywordLower);
            
            if (inText) {
                const basePriority = getLocationPriority(keywordLower);
                // Boost priority if keyword is in title
                const priority = inTitle ? basePriority + 1 : basePriority;
                matches.push({ keyword, coords, priority });
            }
        });
        
        // Only assign to the BEST (highest priority) location
        if (matches.length > 0) {
            // Sort by priority descending, then by keyword length (longer = more specific)
            matches.sort((a, b) => {
                if (b.priority !== a.priority) return b.priority - a.priority;
                return b.keyword.length - a.keyword.length;
            });
            
            const best = matches[0];
            const key = `${best.coords.lat},${best.coords.lon}`;
            
            if (!activity[key]) {
                activity[key] = {
                    lat: best.coords.lat,
                    lon: best.coords.lon,
                    name: best.coords.name || best.keyword,
                    count: 0,
                    headlines: []
                };
            }
            activity[key].count++;
            if (activity[key].headlines.length < 10) {
                activity[key].headlines.push({
                    title: item.title,
                    link: item.link || '',
                    time: item.pubDate,
                    source: item.source
                });
            }
        }
    });
    
    return activity;
}

// Get activity level based on count
function getActivityLevel(count) {
    if (count >= 8) return 'high';       // Red - lots of activity
    if (count >= 4) return 'elevated';   // Orange/yellow
    if (count >= 2) return 'moderate';   // Green
    return 'low';                         // Blue - minimal activity
}

// Get marker color based on activity level
function getMarkerColor(level) {
    switch (level) {
        case 'high': return '#ff4444';     // Red
        case 'elevated': return '#ffaa00'; // Orange
        case 'moderate': return '#44ff88'; // Green
        default: return '#4488ff';         // Blue
    }
}

// Create a custom marker icon - size scales with news count
function createMarkerIcon(color, count) {
    // Size based on count: min 20px for 1, scales up logarithmically
    const size = Math.min(44, Math.max(20, 16 + count * 3));
    return L.divIcon({
        className: 'news-marker',
        html: `<div style="
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.9);
            box-shadow: 0 0 ${size/2}px ${color}, 0 2px 6px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${Math.max(10, size / 3)}px;
            font-weight: bold;
            color: #fff;
            text-shadow: 0 1px 2px #000;
        ">${count}</div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
    });
}

// Create hotspot marker icon
function createHotspotIcon(hotspot) {
    const colors = {
        'critical': '#ff4444',
        'high': '#ff6644',
        'elevated': '#ffaa00',
        'moderate': '#44ff88',
        'low': '#4488ff'
    };
    const color = colors[hotspot.level] || colors['moderate'];
    
    return L.divIcon({
        className: 'hotspot-marker',
        html: `<div class="hotspot-dot" style="
            position: relative;
            width: 24px;
            height: 24px;
        ">
            <div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: ${color};
                border-radius: 50%;
                opacity: 0.3;
                animation: pulse-ring 2s ease-out infinite;
            "></div>
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 14px;
            ">${hotspot.icon || '📍'}</div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
}

// Initialize the Leaflet map
function initMap(container) {
    // Clear any existing map
    if (map) {
        map.remove();
        map = null;
    }
    
    // Create the map with dark theme
    map = L.map(container, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
        zoomControl: false // We'll add custom controls
    });
    
    // Dark tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
    
    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);
    
    // Initialize marker layers
    markersLayer = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            const level = getActivityLevel(count);
            const color = getMarkerColor(level);
            return L.divIcon({
                html: `<div class="cluster-marker" style="
                    background: ${color};
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 3px solid rgba(255,255,255,0.9);
                    box-shadow: 0 0 15px ${color};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: bold;
                    color: #fff;
                ">${count}</div>`,
                className: 'marker-cluster',
                iconSize: [36, 36]
            });
        }
    });
    map.addLayer(markersLayer);
    
    hotspotMarkers = L.layerGroup().addTo(map);
    
    return map;
}

// Render the global map
export async function renderGlobalMap(
    activityData,
    earthquakes,
    allNews,
    mapLayers,
    getMonitorHotspots,
    fetchFlightData,
    classifyAircraft,
    getAircraftArrow
) {
    const mapPanel = document.getElementById('mapPanel');
    if (!mapPanel) return;
    
    // Check if map container exists, if not create it
    let mapContainer = mapPanel.querySelector('#leaflet-map');
    if (!mapContainer) {
        // Clean map container - region buttons are in the header
        mapPanel.innerHTML = `<div id="leaflet-map" style="width: 100%; height: 100%; min-height: 300px;"></div>`;
        mapContainer = mapPanel.querySelector('#leaflet-map');
        
        // Initialize map after container is in DOM
        setTimeout(() => {
            initMap(mapContainer);
            updateMarkers(activityData, allNews, mapLayers, getMonitorHotspots);
        }, 100);
    } else {
        // Map already exists, just update markers
        updateMarkers(activityData, allNews, mapLayers, getMonitorHotspots);
    }
}

// Update markers on the map
function updateMarkers(activityData, allNews, mapLayers, getMonitorHotspots) {
    if (!map || !markersLayer) return;
    
    // Clear existing markers
    markersLayer.clearLayers();
    hotspotMarkers.clearLayers();
    
    // Add news activity markers - only for locations with actual news mentions and headlines
    Object.values(activityData).forEach(location => {
        // Skip locations with no mentions or no headlines
        if (location.count < 1 || !location.headlines || location.headlines.length === 0) return;
        
        const level = getActivityLevel(location.count);
        const color = getMarkerColor(level);
        const icon = createMarkerIcon(color, location.count);
        
        const marker = L.marker([location.lat, location.lon], { icon });
        
        // Create popup content with clickable headlines
        const popupContent = `
            <div class="map-popup">
                <div class="popup-title">${escapeHtml(location.name)}</div>
                <div class="popup-count">${location.count} mention${location.count !== 1 ? 's' : ''}</div>
                <div class="popup-headlines">
                    ${location.headlines.slice(0, 5).map(h => `
                        <div class="popup-headline">
                            ${h.link ? 
                                `<a href="${escapeHtml(h.link)}" target="_blank" rel="noopener" class="headline-link">${escapeHtml(h.title)}</a>` :
                                `<span class="headline-text">${escapeHtml(h.title)}</span>`
                            }
                            <span class="headline-meta">${h.source || ''} • ${getTimeAgo(h.time)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'dark-popup'
        });
        
        markersLayer.addLayer(marker);
    });
    
    // NOTE: Static hotspot icons (intel, regional) have been removed 
    // to show only pure news activity markers. The emoji icons were 
    // cluttering the map and appearing for any keyword match.
    
    // Add custom monitor hotspots (user-created monitors only)
    if (getMonitorHotspots) {
        const monitorHotspots = getMonitorHotspots();
        monitorHotspots.forEach(hotspot => {
            if (hotspot.lat && hotspot.lon) {
                const icon = L.divIcon({
                    className: 'monitor-marker',
                    html: `<div style="
                        width: 20px;
                        height: 20px;
                        background: ${hotspot.color || '#ff44ff'};
                        border-radius: 50%;
                        border: 2px solid #fff;
                        box-shadow: 0 0 10px ${hotspot.color || '#ff44ff'};
                    "></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                
                const marker = L.marker([hotspot.lat, hotspot.lon], { icon });
                marker.bindPopup(`
                    <div class="map-popup">
                        <div class="popup-title">${escapeHtml(hotspot.name)}</div>
                        <div class="popup-keywords">${hotspot.keywords?.join(', ') || ''}</div>
                    </div>
                `, { className: 'dark-popup' });
                
                hotspotMarkers.addLayer(marker);
            }
        });
    }
}

// Get hotspots for current view
function getHotspotsForView(view) {
    switch (view) {
        case 'us': return US_HOTSPOTS || [];
        case 'europe': return EUROPE_HOTSPOTS || [];
        case 'asia': return ASIA_HOTSPOTS || [];
        case 'russia': return RUSSIA_HOTSPOTS || [];
        case 'mideast': return MIDEAST_HOTSPOTS || [];
        case 'ukraine': return UKRAINE_HOTSPOTS || [];
        case 'taiwan': return TAIWAN_HOTSPOTS || [];
        case 'global': 
        default: 
            return INTEL_HOTSPOTS || [];
    }
}

// Legacy function stubs for compatibility
export async function loadWorldMap() { return null; }
export async function loadUSStates() { return null; }
