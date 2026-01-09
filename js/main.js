// main.js - Application entry point

// Import all modules
import { FEEDS, REGION_KEYWORDS, ALERT_KEYWORDS } from './constants.js';
import { setStatus, escapeHtml } from './utils.js';
import {
    fetchCategory, fetchMarkets, fetchSectors, fetchCommodities,
    fetchEarthquakes, fetchCongressTrades, fetchWhaleTransactions,
    fetchGovContracts, fetchAINews, fetchFedBalance, fetchPolymarket,
    fetchLayoffs, fetchSituationNews, fetchIntelFeed,
    fetchCyberThreats, fetchDisasters, fetchSocialTrends
} from './data.js';
import {
    renderGlobalMap, analyzeHotspotActivity, setMapView,
    mapZoomIn, mapZoomOut, mapZoomReset, updateFlashback
} from './map.js';
import {
    mapLayers, toggleLayer, toggleSatelliteLayer,
    fetchFlightData, classifyAircraft, getAircraftArrow
} from './layers.js';
import {
    isPanelEnabled, togglePanel, toggleSettings, applyPanelSettings,
    initPanels, saveLivestreamUrl, resetPanelOrder,
    selectStream, prevStream, nextStream, toggleTileMode, startStreamCycle, stopStreamCycle,
    toggleStreamSelection, renderStreamSelector, updateLivestreamEmbed
} from './panels.js';
import {
    renderNews, renderMarkets, renderHeatmap, renderCommodities,
    renderPolymarket, renderCongressTrades, renderWhaleWatch,
    renderMainCharacter, renderGovContracts, renderAINews,
    renderMoneyPrinter, renderIntelFeed, renderLayoffs, renderSituation,
    renderNewsTicker, renderCyberThreats, renderDisasters, renderSocialTrends
} from './renderers.js';
import {
    analyzeCorrelations, renderCorrelationEngine,
    analyzeNarratives, renderNarrativeTracker,
    calculateMainCharacter
} from './intelligence.js';
import {
    renderMonitorsList, openMonitorForm, closeMonitorForm,
    selectMonitorColor, saveMonitor, editMonitor, deleteMonitor,
    renderMonitorsPanel, getMonitorHotspots
} from './monitors.js';
import {
    showHotspotPopup, showConflictPopup, showUSCityPopup,
    showUSHotspotPopup, showChokepointPopup, showQuakePopup,
    showCyberPopup, showCustomHotspotPopup, showAircraftPopup
} from './popups.js';

// Alert state
let alertsEnabled = localStorage.getItem('alertsEnabled') === 'true';
let seenAlerts = new Set(JSON.parse(localStorage.getItem('seenAlerts') || '[]'));

// Toggle desktop notifications
function toggleAlerts() {
    alertsEnabled = !alertsEnabled;
    localStorage.setItem('alertsEnabled', alertsEnabled);
    
    const btn = document.querySelector('.alert-btn');
    if (btn) {
        btn.classList.toggle('active', alertsEnabled);
        btn.title = alertsEnabled ? 'Alerts ON - Click to disable' : 'Alerts OFF - Click to enable';
    }
    
    if (alertsEnabled && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    
    setStatus(alertsEnabled ? 'Alerts enabled' : 'Alerts disabled');
}

// Check for alert-worthy news and send notification
function checkForAlerts(news) {
    if (!alertsEnabled || Notification.permission !== 'granted') return;
    
    const criticalKeywords = ['breaking', 'missile', 'attack', 'invasion', 'nuclear', 'war', 'emergency', 'assassination', 'crash', 'explosion'];
    
    news.forEach(item => {
        const id = item.title?.substring(0, 50);
        if (seenAlerts.has(id)) return;
        
        const title = (item.title || '').toLowerCase();
        const isCritical = criticalKeywords.some(kw => title.includes(kw));
        
        if (isCritical || item.isAlert) {
            seenAlerts.add(id);
            new Notification('⚠️ Alert: ' + item.source, {
                body: item.title,
                icon: '🚨',
                tag: id
            });
        }
    });
    
    // Keep only last 100 alerts
    if (seenAlerts.size > 100) {
        const arr = Array.from(seenAlerts);
        seenAlerts = new Set(arr.slice(-100));
    }
    localStorage.setItem('seenAlerts', JSON.stringify(Array.from(seenAlerts)));
}

// ========== HEADLINE NOTIFICATIONS (in-app popups) ==========
let notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false'; // Default on
let seenHeadlines = new Set(JSON.parse(localStorage.getItem('seenHeadlines') || '[]'));

function toggleNotifications() {
    notificationsEnabled = !notificationsEnabled;
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    updateNotificationToggle();
}

function updateNotificationToggle() {
    const toggle = document.getElementById('notificationsToggle');
    if (toggle) {
        toggle.classList.toggle('on', notificationsEnabled);
    }
}

function showHeadlineNotification(item) {
    if (!notificationsEnabled) return;
    
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    // Limit to 5 notifications at a time
    const existing = container.querySelectorAll('.notification-popup');
    if (existing.length >= 5) {
        existing[existing.length - 1].remove();
    }
    
    const popup = document.createElement('div');
    popup.className = 'notification-popup' + (item.isAlert ? ' alert' : '');
    popup.innerHTML = `
        <div class="notification-header">
            <span class="notification-source">${item.source || 'News'}</span>
            <div>
                <span class="notification-time">just now</span>
                <button class="notification-close" onclick="event.stopPropagation(); this.closest('.notification-popup').remove()">×</button>
            </div>
        </div>
        <div class="notification-title">${item.title}</div>
    `;
    
    popup.onclick = () => {
        if (item.link) {
            openArticle(item.link);
        }
        popup.remove();
    };
    
    container.insertBefore(popup, container.firstChild);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        popup.classList.add('closing');
        setTimeout(() => popup.remove(), 300);
    }, 8000);
}

function checkForNewHeadlines(news) {
    if (!notificationsEnabled) return;
    
    // Check for new headlines not seen before
    const newItems = news.filter(item => {
        const id = item.title?.substring(0, 50);
        if (!id || seenHeadlines.has(id)) return false;
        seenHeadlines.add(id);
        return true;
    }).slice(0, 3); // Max 3 new notifications per refresh
    
    // Show notifications with slight delay between each
    newItems.forEach((item, i) => {
        setTimeout(() => showHeadlineNotification(item), i * 500);
    });
    
    // Keep only last 200 headlines
    if (seenHeadlines.size > 200) {
        const arr = Array.from(seenHeadlines);
        seenHeadlines = new Set(arr.slice(-200));
    }
    localStorage.setItem('seenHeadlines', JSON.stringify(Array.from(seenHeadlines)));
}

// Expose to window
window.toggleNotifications = toggleNotifications;

// ========== PINNED PANELS ==========
let pinnedPanels = new Set(JSON.parse(localStorage.getItem('pinnedPanels') || '[]'));

function togglePinPanel(panelId) {
    if (pinnedPanels.has(panelId)) {
        pinnedPanels.delete(panelId);
    } else {
        pinnedPanels.add(panelId);
    }
    localStorage.setItem('pinnedPanels', JSON.stringify(Array.from(pinnedPanels)));
    updatePinButtons();
    renderPinnedPanels();
}

function updatePinButtons() {
    document.querySelectorAll('.panel-pin').forEach(btn => {
        const panelId = btn.dataset.panel;
        btn.classList.toggle('pinned', pinnedPanels.has(panelId));
        btn.textContent = pinnedPanels.has(panelId) ? '●' : '○';
        btn.title = pinnedPanels.has(panelId) ? 'Unpin from dashboard' : 'Pin to dashboard';
    });
}

function renderPinnedPanels() {
    const container = document.getElementById('pinnedPanelsContainer');
    if (!container) return;
    
    // Clear the container first
    container.innerHTML = '';
    
    if (pinnedPanels.size === 0) {
        // Show empty state
        container.innerHTML = `
            <div class="pinned-empty">
                <div style="font-size: 32px; margin-bottom: 12px;">○</div>
                <div style="font-size: 14px; color: var(--text-dim);">Pin panels from other tabs to show them here</div>
                <div style="font-size: 12px; color: var(--text-dim); margin-top: 8px;">Click the ○ icon on any panel to pin it</div>
            </div>
        `;
        return;
    }
    
    pinnedPanels.forEach(panelId => {
        // Find the original panel (not a clone)
        const originalPanel = document.querySelector(`.panel[data-panel="${panelId}"]:not(.pinned-panel-clone)`);
        if (!originalPanel) {
            console.warn('Could not find original panel for:', panelId);
            return;
        }
        
        // Clone the panel
        const clone = originalPanel.cloneNode(true);
        clone.classList.add('pinned-panel-clone');

        // Pinned clones should be uniform size: strip any inline sizing copied from resizable panels
        clone.style.width = '';
        clone.style.minWidth = '';
        clone.style.maxWidth = '';
        clone.style.height = '';
        clone.style.minHeight = '';
        clone.style.maxHeight = '';

        // Remove resize handles from clones (they can bleed outside and visually overlap)
        clone.querySelectorAll('.panel-resize-handle').forEach(el => el.remove());
        
        // Remove IDs from cloned elements to avoid duplicate ID conflicts
        // This ensures renderNews etc. target the original panels, not the clones
        clone.querySelectorAll('[id]').forEach(el => {
            el.removeAttribute('id');
        });
        
        // Update the pin button in the clone
        const pinBtn = clone.querySelector('.panel-pin');
        if (pinBtn) {
            pinBtn.onclick = () => togglePinPanel(panelId);
        }
        
        container.appendChild(clone);
    });
}

// Expose to window
window.togglePinPanel = togglePinPanel;

// ========== COUNTDOWN TIMER ==========
let countdownSeconds = 300; // 5 minutes
let countdownInterval = null;

function startCountdown() {
    countdownSeconds = 300;
    updateCountdownDisplay();
    
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        countdownSeconds--;
        if (countdownSeconds <= 0) {
            countdownSeconds = 300;
        }
        updateCountdownDisplay();
    }, 1000);
}

function updateCountdownDisplay() {
    const el = document.getElementById('countdown');
    if (el) {
        const mins = Math.floor(countdownSeconds / 60);
        const secs = countdownSeconds % 60;
        el.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

function resetCountdown() {
    countdownSeconds = 300;
    updateCountdownDisplay();
}

// ========== ERROR TRACKING ==========
let lastErrors = [];

function trackError(source, error) {
    const msg = error?.message || String(error);
    lastErrors.push({ source, message: msg, time: new Date() });
    // Keep only last 10 errors
    if (lastErrors.length > 10) lastErrors.shift();
    console.warn(`[${source}] Error:`, msg);
}

function clearErrors() {
    lastErrors = [];
}

function setStatusWithErrors(text, hasErrors = false) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = text;
        statusEl.classList.toggle('has-errors', hasErrors);
        
        // Build tooltip content
        if (hasErrors && lastErrors.length > 0) {
            const tooltipHtml = `
                <div class="status-tooltip">
                    <div class="status-tooltip-title">⚠️ Failed to update (${lastErrors.length}):</div>
                    ${lastErrors.map(e => `<div class="status-tooltip-item">• ${escapeHtml(e.source)}: ${escapeHtml(e.message)}</div>`).join('')}
                </div>
            `;
            statusEl.innerHTML = text + tooltipHtml;
            statusEl.title = `${lastErrors.length} errors - hover for details`;
        } else {
            statusEl.innerHTML = text;
            statusEl.title = '';
        }
    }
}

// ========== TIME FILTER ==========
let currentTimeFilter = 'all';

function toggleTimeFilter() {
    const dropdown = document.getElementById('timeFilterDropdown');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

function setTimeFilter(filter) {
    currentTimeFilter = filter;
    
    // Update button states
    document.querySelectorAll('.time-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.time === filter);
    });
    
    // Close dropdown
    const dropdown = document.getElementById('timeFilterDropdown');
    if (dropdown) dropdown.classList.remove('open');
    
    // Re-render with filter
    renderFilteredNews();
}

function filterNewsByTime(news) {
    if (currentTimeFilter === 'all') return news;
    
    const now = new Date();
    const hours = {
        '1h': 1,
        '6h': 6,
        '12h': 12,
        '24h': 24
    };
    const maxHours = hours[currentTimeFilter] || 999999;
    const cutoff = new Date(now.getTime() - maxHours * 60 * 60 * 1000);
    
    return news.filter(item => {
        // Try to parse the date from various fields
        const dateStr = item.pubDate || item.date || item.time;
        if (!dateStr) return false; // Exclude items without dates when filtering
        
        const itemDate = new Date(dateStr);
        // Check if date is valid
        if (isNaN(itemDate.getTime())) return false;
        
        return itemDate >= cutoff;
    });
}

// Expose time filter functions
window.toggleTimeFilter = toggleTimeFilter;
window.setTimeFilter = setTimeFilter;

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.time-filter-wrapper')) {
        const dropdown = document.getElementById('timeFilterDropdown');
        if (dropdown) dropdown.classList.remove('open');
    }
});

// Global search functionality
let searchTimeout = null;
function handleGlobalSearch(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const normalizedQuery = query.toLowerCase().trim();
        
        document.querySelectorAll('.panel-content .item, .panel-content .news-item').forEach(item => {
            const title = item.querySelector('.item-title, .news-title')?.textContent?.toLowerCase() || '';
            const source = item.querySelector('.item-source, .news-source')?.textContent?.toLowerCase() || '';
            const matches = normalizedQuery === '' || title.includes(normalizedQuery) || source.includes(normalizedQuery);
            item.style.display = matches ? '' : 'none';
        });
        
        // Highlight search results
        if (normalizedQuery) {
            document.getElementById('globalSearch')?.classList.add('has-query');
        } else {
            document.getElementById('globalSearch')?.classList.remove('has-query');
        }
    }, 200);
}

function clearGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.value = '';
        handleGlobalSearch('');
    }
}

// Expose functions to window for onclick handlers
window.togglePanel = (id) => togglePanel(id, refreshAll);
window.toggleSettings = () => toggleSettings(renderMonitorsList);
window.toggleAlerts = toggleAlerts;
window.handleGlobalSearch = handleGlobalSearch;
window.clearGlobalSearch = clearGlobalSearch;
window.saveLivestreamUrl = saveLivestreamUrl;
window.selectStream = selectStream;
window.prevStream = prevStream;
window.nextStream = nextStream;
window.toggleTileMode = toggleTileMode;
window.startStreamCycle = startStreamCycle;
window.stopStreamCycle = stopStreamCycle;
window.toggleStreamSelection = toggleStreamSelection;
window.resetPanelOrder = resetPanelOrder;
window.setMapView = (mode) => setMapView(mode, refreshAll);
window.mapZoomIn = mapZoomIn;
window.mapZoomOut = mapZoomOut;
window.mapZoomReset = mapZoomReset;
window.toggleLayer = (layer) => {
    toggleLayer(layer, refreshAll);
};
window.toggleSatelliteLayer = () => toggleSatelliteLayer(refreshAll);
window.updateFlashback = updateFlashback;
window.openMonitorForm = openMonitorForm;
window.closeMonitorForm = closeMonitorForm;
window.selectMonitorColor = selectMonitorColor;
window.saveMonitor = () => saveMonitor(refreshAll);
window.editMonitor = editMonitor;
window.deleteMonitor = (id) => deleteMonitor(id, refreshAll);
window.showHotspotPopup = showHotspotPopup;
window.showConflictPopup = showConflictPopup;
window.showUSCityPopup = showUSCityPopup;
window.showUSHotspotPopup = showUSHotspotPopup;
window.showChokepointPopup = showChokepointPopup;
window.showQuakePopup = showQuakePopup;
window.showCyberPopup = showCyberPopup;
window.showCustomHotspotPopup = showCustomHotspotPopup;
window.showAircraftPopup = showAircraftPopup;

// ========== TAB SWITCHING ==========
let currentTab = 'dashboard';

function switchTab(tabId) {
    currentTab = tabId;
    
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
    
    // Refresh map when switching to dashboard (it may need to resize)
    if (tabId === 'dashboard' && window.map) {
        setTimeout(() => window.map.invalidateSize(), 100);
    }
}
window.switchTab = switchTab;

// ========== ARTICLE READER ==========
let currentArticleUrl = '';

function openArticle(url) {
    if (!url) return;
    currentArticleUrl = url;
    // Browser-only: open externally to avoid iframe embedding blocks (X-Frame-Options/CSP)
    window.open(url, '_blank', 'noopener');
}

function closeArticle() {
    const modal = document.getElementById('articleModal');
    const frame = document.getElementById('articleFrame');
    
    if (modal) modal.classList.remove('open');
    if (frame) frame.src = 'about:blank';
    currentArticleUrl = '';
}

function openArticleExternal() {
    if (currentArticleUrl) {
        window.open(currentArticleUrl, '_blank', 'noopener');
    }
}

window.openArticle = openArticle;
window.closeArticle = closeArticle;
window.openArticleExternal = openArticleExternal;

// Intercept news item clicks to open in article reader instead of new window
function initArticleClickHandler() {
    document.addEventListener('click', (e) => {
        // Ensure target has closest method (not a text node)
        if (!e.target || typeof e.target.closest !== 'function') return;
        
        const link = e.target.closest('.item-title, .ai-title, .headline-link');
        if (link && link.href) {
            e.preventDefault();
            openArticle(link.href);
        }
    });
}

// Global state for fast updates
let lastAllNews = [];
let lastEarthquakes = [];
let currentRegionFilter = 'all';

// Region filter keywords
const REGION_FILTER_KEYWORDS = {
    'all': null,
    'us': ['us', 'usa', 'america', 'washington', 'trump', 'biden', 'congress', 'white house', 'pentagon', 'california', 'texas', 'new york', 'florida', 'fbi', 'cia', 'doj', 'federal'],
    'europe': ['europe', 'eu', 'european', 'nato', 'uk', 'britain', 'germany', 'france', 'poland', 'italy', 'spain', 'brussels', 'berlin', 'paris', 'london', 'brexit'],
    'asia': ['china', 'chinese', 'taiwan', 'japan', 'korea', 'seoul', 'tokyo', 'beijing', 'shanghai', 'asia', 'pacific', 'indo-pacific', 'asean', 'philippines', 'vietnam', 'india', 'delhi', 'singapore', 'hong kong'],
    'mideast': ['israel', 'iran', 'saudi', 'syria', 'iraq', 'gaza', 'hamas', 'hezbollah', 'yemen', 'houthi', 'lebanon', 'tehran', 'jerusalem', 'tel aviv', 'middle east', 'idf', 'netanyahu'],
    'russia': ['russia', 'russian', 'moscow', 'putin', 'kremlin', 'siberia', 'arctic'],
    'ukraine': ['ukraine', 'ukrainian', 'kyiv', 'zelensky', 'donbas', 'crimea', 'kherson', 'bakhmut', 'kharkiv']
};

// Filter news by region
function filterNewsByRegion(news, region) {
    if (region === 'all' || !REGION_FILTER_KEYWORDS[region]) return news;
    
    const keywords = REGION_FILTER_KEYWORDS[region];
    return news.filter(item => {
        const text = ((item.title || '') + ' ' + (item.description || '') + ' ' + (item.source || '')).toLowerCase();
        return keywords.some(kw => text.includes(kw.toLowerCase()));
    });
}

// Set region filter and update UI
function setRegionFilter(region) {
    currentRegionFilter = region;
    
    // Update button states
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.region === region);
    });
    
    // Update map title
    const titleEl = document.getElementById('mapTitle');
    const regionNames = {
        'all': 'Global Map',
        'us': 'United States',
        'europe': 'Europe',
        'asia': 'Asia Pacific',
        'mideast': 'Middle East',
        'russia': 'Russia',
        'ukraine': 'Ukraine'
    };
    if (titleEl) titleEl.textContent = regionNames[region] || 'Global Map';
    
    // Also update map view to match region
    setMapView(region === 'all' ? 'global' : region, () => {});
    
    // Re-render news panels with filtered content
    renderFilteredNews();
}

// Store extra news data for filtering
let lastCyberThreats = [];
let lastDisasters = [];
let lastSocialTrends = [];
let lastAINews = [];
let lastLayoffs = [];
let lastIntelFeed = [];

// Re-render news panels with current filter
function renderFilteredNews() {
    if (lastAllNews.length === 0) return;
    
    // Apply both region and time filters
    let filtered = filterNewsByRegion(lastAllNews, currentRegionFilter);
    filtered = filterNewsByTime(filtered);
    
    // Split filtered news into categories based on source
    const politicsFiltered = filtered.filter(n => n.category === 'politics' || !n.category);
    const techFiltered = filtered.filter(n => n.category === 'tech');
    const financeFiltered = filtered.filter(n => n.category === 'finance');
    const govFiltered = filtered.filter(n => n.category === 'gov');
    
    // If we don't have enough categorized items, distribute all filtered items
    if (politicsFiltered.length + techFiltered.length + financeFiltered.length < 10) {
        const chunk = Math.ceil(filtered.length / 4);
        if (isPanelEnabled('politics')) renderNews(filtered.slice(0, chunk), 'politicsPanel', 'politicsCount');
        if (isPanelEnabled('tech')) renderNews(filtered.slice(chunk, chunk*2), 'techPanel', 'techCount');
        if (isPanelEnabled('finance')) renderNews(filtered.slice(chunk*2, chunk*3), 'financePanel', 'financeCount');
        if (isPanelEnabled('gov')) renderNews(filtered.slice(chunk*3), 'govPanel', 'govCount');
    } else {
        if (isPanelEnabled('politics')) renderNews(politicsFiltered, 'politicsPanel', 'politicsCount');
        if (isPanelEnabled('tech')) renderNews(techFiltered, 'techPanel', 'techCount');
        if (isPanelEnabled('finance')) renderNews(financeFiltered, 'financePanel', 'financeCount');
        if (isPanelEnabled('gov')) renderNews(govFiltered, 'govPanel', 'govCount');
    }
    
    // Also filter and render News tab panels
    if (isPanelEnabled('politics')) {
        renderNews(filterNewsByTime(filterNewsByRegion(politicsFiltered, currentRegionFilter)), 'worldPanel', 'worldCount');
    }
    if (isPanelEnabled('cyber') && lastCyberThreats.length > 0) {
        renderCyberThreats(filterNewsByTime(filterNewsByRegion(lastCyberThreats, currentRegionFilter)));
    }
    if (isPanelEnabled('disasters') && lastDisasters.length > 0) {
        renderDisasters(filterNewsByTime(filterNewsByRegion(lastDisasters, currentRegionFilter)));
    }
    if (isPanelEnabled('social') && lastSocialTrends.length > 0) {
        renderSocialTrends(filterNewsByTime(filterNewsByRegion(lastSocialTrends, currentRegionFilter)));
    }
    if (isPanelEnabled('ai') && lastAINews.length > 0) {
        renderAINews(filterNewsByTime(filterNewsByRegion(lastAINews, currentRegionFilter)));
    }
    if (isPanelEnabled('layoffs') && lastLayoffs.length > 0) {
        renderLayoffs(filterNewsByTime(filterNewsByRegion(lastLayoffs, currentRegionFilter)));
    }
    if (isPanelEnabled('intel') && lastIntelFeed.length > 0) {
        renderIntelFeed(filterNewsByTime(filterNewsByRegion(lastIntelFeed, currentRegionFilter)));
    }
    
    // Update map with filtered news
    if (isPanelEnabled('map')) {
        const activityData = analyzeHotspotActivity(filtered);
        renderGlobalMap(
            activityData,
            lastEarthquakes,
            filtered,
            mapLayers,
            getMonitorHotspots,
            fetchFlightData,
            classifyAircraft,
            getAircraftArrow
        );
    }

    // Pinned dashboard panels are clones; refresh them so they reflect the updated content.
    renderPinnedPanels();
}

// Expose region filter to window
window.setRegionFilter = setRegionFilter;

// Lightweight map refresh using cached data
async function refreshMapOnly() {
    if (isPanelEnabled('map')) {
        const activityData = analyzeHotspotActivity(lastAllNews);
        await renderGlobalMap(
            activityData,
            lastEarthquakes,
            lastAllNews,
            mapLayers,
            getMonitorHotspots,
            fetchFlightData,
            classifyAircraft,
            getAircraftArrow
        );
    }
}

// Expose fast refresh for UI interactions
window.setMapView = (mode) => setMapView(mode, refreshMapOnly);
window.toggleLayer = (layer) => toggleLayer(layer, refreshMapOnly);
window.toggleSatelliteLayer = () => toggleSatelliteLayer(refreshMapOnly);

// Staged refresh - loads critical data first for faster perceived startup
async function refreshAll() {
    const btn = document.getElementById('refreshBtn');
    if (btn) btn.disabled = true;
    setStatus('Loading critical...', true);
    
    // Update splash status if visible
    const splashStatus = document.getElementById('splashStatus');
    const updateSplash = (msg) => { if (splashStatus) splashStatus.textContent = msg; };
    
    // Reset countdown and clear previous errors
    resetCountdown();
    clearErrors();

    let allNews = [];
    let hadErrors = false;

    try {
        updateSplash('Fetching news feeds...');
        
        // STAGE 1: Critical data (news + markets) - loads first
        const stage1Promise = Promise.allSettled([
            isPanelEnabled('politics') ? fetchCategory(FEEDS.politics) : Promise.resolve([]),
            isPanelEnabled('tech') ? fetchCategory(FEEDS.tech) : Promise.resolve([]),
            isPanelEnabled('finance') ? fetchCategory(FEEDS.finance) : Promise.resolve([]),
            isPanelEnabled('markets') ? fetchMarkets() : Promise.resolve([]),
            isPanelEnabled('heatmap') ? fetchSectors() : Promise.resolve([]),
            fetchIntelFeed() // Always fetch regional intel for map
        ]);

        const stage1Results = await stage1Promise;
        const [politicsRes, techRes, financeRes, marketsRes, sectorsRes, intelNewsRes] = stage1Results;
        
        // Extract values with error tracking
        const politics = politicsRes.status === 'fulfilled' ? politicsRes.value : (trackError('Politics Feed', politicsRes.reason), hadErrors = true, []);
        const tech = techRes.status === 'fulfilled' ? techRes.value : (trackError('Tech Feed', techRes.reason), hadErrors = true, []);
        const finance = financeRes.status === 'fulfilled' ? financeRes.value : (trackError('Finance Feed', financeRes.reason), hadErrors = true, []);
        const markets = marketsRes.status === 'fulfilled' ? marketsRes.value : (trackError('Markets', marketsRes.reason), hadErrors = true, []);
        const sectors = sectorsRes.status === 'fulfilled' ? sectorsRes.value : (trackError('Sectors', sectorsRes.reason), hadErrors = true, []);
        const intelNews = intelNewsRes.status === 'fulfilled' ? intelNewsRes.value : (trackError('Intel News', intelNewsRes.reason), hadErrors = true, []);

        // Tag news items with their category
        politics.forEach(item => item.category = 'politics');
        tech.forEach(item => item.category = 'tech');
        finance.forEach(item => item.category = 'finance');
        intelNews.forEach(item => item.category = 'politics'); // Regional news goes to politics

        // Merge intel news into politics for display
        const politicsWithIntel = [...politics, ...intelNews].sort((a, b) => {
            return new Date(b.pubDate) - new Date(a.pubDate);
        }).slice(0, 30);

        // Render Stage 1 immediately
        if (isPanelEnabled('politics')) {
            renderNews(politicsWithIntel, 'politicsPanel', 'politicsCount');
            // Also render to News tab's World panel
            renderNews(politicsWithIntel, 'worldPanel', 'worldCount');
        }
        if (isPanelEnabled('tech')) renderNews(tech, 'techPanel', 'techCount');
        if (isPanelEnabled('finance')) renderNews(finance, 'financePanel', 'financeCount');
        if (isPanelEnabled('markets')) renderMarkets(markets);
        if (isPanelEnabled('heatmap')) renderHeatmap(sectors);

        allNews = [...politicsWithIntel, ...tech, ...finance];
        setStatus('Loading more...', true);
        updateSplash('Loading market data...');

        // STAGE 2: Secondary data
        const stage2Promise = Promise.all([
            isPanelEnabled('gov') ? fetchCategory(FEEDS.gov) : Promise.resolve([]),
            isPanelEnabled('commodities') ? fetchCommodities() : Promise.resolve([]),
            isPanelEnabled('polymarket') ? fetchPolymarket() : Promise.resolve([]),
            isPanelEnabled('printer') ? fetchFedBalance() : Promise.resolve({ value: 0, change: 0, changePercent: 0, percentOfMax: 0 }),
            isPanelEnabled('map') ? fetchEarthquakes() : Promise.resolve([])
        ]);

        const [gov, commodities, polymarket, fedBalance, earthquakes] = await stage2Promise;

        // Tag gov news with category
        gov.forEach(item => item.category = 'gov');

        if (isPanelEnabled('gov')) {
            renderNews(gov, 'govPanel', 'govCount');
            allNews = [...allNews, ...gov];
        }
        if (isPanelEnabled('commodities')) renderCommodities(commodities);
        if (isPanelEnabled('polymarket')) renderPolymarket(polymarket);
        if (isPanelEnabled('printer')) renderMoneyPrinter(fedBalance);

        // Store all news for region filtering
        lastAllNews = allNews;
        lastEarthquakes = earthquakes;

        // Render breaking news ticker
        renderNewsTicker(allNews);
        
        // Check for new headlines and show notifications
        checkForNewHeadlines(allNews);

        // Render map with earthquakes and shipping alert data
        if (isPanelEnabled('map')) {
            updateSplash('Rendering map...');
            const activityData = analyzeHotspotActivity(allNews);
            await renderGlobalMap(
                activityData,
                earthquakes,
                allNews,
                mapLayers,
                getMonitorHotspots,
                fetchFlightData,
                classifyAircraft,
                getAircraftArrow
            );
        }
        if (isPanelEnabled('mainchar')) {
            const mainCharRankings = calculateMainCharacter(allNews);
            renderMainCharacter(mainCharRankings);
        }

        if (isPanelEnabled('correlation')) {
            const correlations = analyzeCorrelations(allNews);
            renderCorrelationEngine(correlations);
        }

        if (isPanelEnabled('narrative')) {
            const narratives = analyzeNarratives(allNews);
            renderNarrativeTracker(narratives);
        }

        setStatus('Loading extras...', true);

        // STAGE 3: Extra data - lowest priority
        const stage3Promise = Promise.all([
            isPanelEnabled('congress') ? fetchCongressTrades() : Promise.resolve([]),
            isPanelEnabled('whales') ? fetchWhaleTransactions() : Promise.resolve([]),
            isPanelEnabled('contracts') ? fetchGovContracts() : Promise.resolve([]),
            isPanelEnabled('ai') ? fetchAINews() : Promise.resolve([]),
            isPanelEnabled('layoffs') ? fetchLayoffs() : Promise.resolve([]),
            isPanelEnabled('venezuela') ? fetchSituationNews('venezuela maduro caracas crisis') : Promise.resolve([]),
            isPanelEnabled('greenland') ? fetchSituationNews('greenland denmark trump arctic') : Promise.resolve([]),
            isPanelEnabled('intel') ? fetchIntelFeed() : Promise.resolve([]),
            isPanelEnabled('cyber') ? fetchCyberThreats() : Promise.resolve([]),
            isPanelEnabled('disasters') ? fetchDisasters() : Promise.resolve([]),
            isPanelEnabled('social') ? fetchSocialTrends() : Promise.resolve([])
        ]);

        const [congressTrades, whales, contracts, aiNews, layoffs, venezuelaNews, greenlandNews, intelFeed, cyberThreats, disasters, socialTrends] = await stage3Promise;

        // Store for region filtering
        lastAINews = aiNews;
        lastLayoffs = layoffs;
        lastIntelFeed = intelFeed;
        lastCyberThreats = cyberThreats;
        lastDisasters = disasters;
        lastSocialTrends = socialTrends;

        if (isPanelEnabled('congress')) renderCongressTrades(congressTrades);
        if (isPanelEnabled('whales')) renderWhaleWatch(whales);
        if (isPanelEnabled('contracts')) renderGovContracts(contracts);
        if (isPanelEnabled('ai')) renderAINews(aiNews);
        if (isPanelEnabled('layoffs')) renderLayoffs(layoffs);
        if (isPanelEnabled('intel')) renderIntelFeed(intelFeed);
        if (isPanelEnabled('cyber')) renderCyberThreats(cyberThreats);
        if (isPanelEnabled('disasters')) renderDisasters(disasters);
        if (isPanelEnabled('social')) renderSocialTrends(socialTrends);
        if (isPanelEnabled('venezuela')) {
            renderSituation('venezuelaPanel', 'venezuelaStatus', venezuelaNews, {
                title: 'Venezuela Crisis',
                subtitle: 'Political instability & humanitarian situation',
                criticalKeywords: ['invasion', 'military', 'coup', 'violence', 'sanctions', 'arrested']
            });
        }
        if (isPanelEnabled('greenland')) {
            renderSituation('greenlandPanel', 'greenlandStatus', greenlandNews, {
                title: 'Greenland Dispute',
                subtitle: 'US-Denmark tensions over Arctic territory',
                criticalKeywords: ['purchase', 'trump', 'military', 'takeover', 'independence', 'referendum']
            });
        }

        // Render My Monitors panel with all news
        if (isPanelEnabled('monitors')) {
            renderMonitorsPanel(allNews);
        }

        // Clear any remaining "Loading..." messages for panels that didn't get data
        document.querySelectorAll('.panel-content .loading-msg').forEach(el => {
            el.textContent = 'No data available';
            el.classList.remove('loading-msg');
            el.classList.add('error-msg');
        });

        // Re-render pinned panels to sync with updated content
        // Use setTimeout to ensure all DOM updates have completed
        setTimeout(() => renderPinnedPanels(), 50);

        const now = new Date();
        if (hadErrors) {
            setStatusWithErrors(`Updated ${now.toLocaleTimeString()} (some errors)`, true);
        } else {
            setStatusWithErrors(`Updated ${now.toLocaleTimeString()}`);
        }
    } catch (error) {
        console.error('Refresh error:', error);
        trackError('General', error);
        setStatusWithErrors('Error updating', true);
        // Still try to render pinned panels even on error
        setTimeout(() => renderPinnedPanels(), 50);
    }

    if (btn) btn.disabled = false;
}

// Expose refreshAll to window
window.refreshAll = refreshAll;

// Initialize scroll delay for panel content (800ms hover to enable scrolling)
// Also allow scrolling page when mouse is near edges
function initScrollDelay() {
    let hoverTimers = new Map();
    
    document.addEventListener('mouseenter', (e) => {
        const panelContent = e.target.closest('.panel-content');
        if (panelContent && !panelContent.classList.contains('scroll-enabled')) {
            const timer = setTimeout(() => {
                panelContent.classList.add('scroll-enabled');
            }, 500);
            hoverTimers.set(panelContent, timer);
        }
    }, true);
    
    document.addEventListener('mouseleave', (e) => {
        const panelContent = e.target.closest('.panel-content');
        if (panelContent) {
            const timer = hoverTimers.get(panelContent);
            if (timer) {
                clearTimeout(timer);
                hoverTimers.delete(panelContent);
            }
            panelContent.classList.remove('scroll-enabled');
        }
    }, true);
}

// Help tooltips rendered at <body> level to avoid clipping behind panel overflow.
function initHelpTooltips() {
    const tooltip = document.createElement('div');
    tooltip.className = 'help-tooltip';
    tooltip.style.display = 'none';
    tooltip.innerHTML = `<div class="help-tooltip-body"></div>`;
    document.body.appendChild(tooltip);

    const bodyEl = tooltip.querySelector('.help-tooltip-body');

    let activeAnchor = null;
    let rafId = null;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    function positionTooltip(anchor) {
        if (!anchor) return;

        // Make visible to measure size.
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden';
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';

        const rect = anchor.getBoundingClientRect();
        const tipRect = tooltip.getBoundingClientRect();

        const margin = 10;
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;

        // Prefer above; if not enough room, place below.
        const aboveTop = rect.top - tipRect.height - 10;
        const belowTop = rect.bottom + 10;
        const top = (aboveTop >= margin) ? aboveTop : clamp(belowTop, margin, viewportH - tipRect.height - margin);

        // Center horizontally on the icon.
        const centerX = rect.left + rect.width / 2;
        const left = clamp(centerX - tipRect.width / 2, margin, viewportW - tipRect.width - margin);

        tooltip.style.left = `${Math.round(left)}px`;
        tooltip.style.top = `${Math.round(top)}px`;
        tooltip.style.visibility = 'visible';
    }

    function scheduleReposition() {
        if (!activeAnchor) return;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => positionTooltip(activeAnchor));
    }

    function show(anchor) {
        const helpText = anchor?.getAttribute('data-help');
        if (!helpText) return;

        activeAnchor = anchor;
        bodyEl.textContent = helpText;
        scheduleReposition();
    }

    function hide(anchor) {
        if (anchor && anchor !== activeAnchor) return;
        activeAnchor = null;
        tooltip.style.display = 'none';
        tooltip.style.visibility = 'hidden';
        bodyEl.textContent = '';
    }

    document.addEventListener('mouseenter', (e) => {
        const anchor = e.target?.closest?.('.help-icon');
        if (!anchor) return;
        show(anchor);
    }, true);

    document.addEventListener('mouseleave', (e) => {
        const anchor = e.target?.closest?.('.help-icon');
        if (!anchor) return;
        hide(anchor);
    }, true);

    window.addEventListener('scroll', scheduleReposition, true);
    window.addEventListener('resize', scheduleReposition);
}

function boot() {
    // Initialize panels
    initPanels(renderMonitorsList);
    
    // Initialize scroll delay
    initScrollDelay();

    // Initialize help tooltips
    initHelpTooltips();
    
    // Initialize article click handler
    initArticleClickHandler();
    
    // Initialize stream selector
    updateLivestreamEmbed();

    // Start countdown timer
    startCountdown();

    // Initialize notification toggle
    updateNotificationToggle();
    
    // Initialize pin buttons
    updatePinButtons();
    renderPinnedPanels();

    // Update splash status
    const splashStatus = document.getElementById('splashStatus');
    if (splashStatus) splashStatus.textContent = 'Fetching news feeds...';

    // Function to hide splash
    const hideSplash = () => {
        const splash = document.getElementById('splashScreen');
        if (splash && !splash.classList.contains('hidden')) {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 500);
        }
    };

    // Initial data load - hide splash only after everything loads
    refreshAll().then(hideSplash).catch((err) => {
        console.error('Load error:', err);
        hideSplash(); // Still hide on error so app is usable
    });

    // Auto-refresh every 5 minutes
    setInterval(refreshAll, 5 * 60 * 1000);
}

// Initialize application
// NOTE: index.html dynamically injects the module script on GitHub Pages.
// If the module loads after DOMContentLoaded has already fired, a plain
// DOMContentLoaded listener will never run and the splash will stay forever.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
    boot();
}
