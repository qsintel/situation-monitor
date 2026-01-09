// panels.js - Panel management, settings, drag/drop, resize

import { PANELS, NON_DRAGGABLE_PANELS, NEWS_STREAMS, CORS_PROXIES } from './constants.js';

// Drag state
let draggedPanel = null;

// Resize state
let resizingPanel = null;
let resizeStart = { x: 0, y: 0, width: 0, height: 0 };
let resizeDirection = null;

// Stream state
let currentStreamIndex = 0;
let selectedStreams = new Set(); // For multi-select tiling
let livestreamMode = 'single';
let cycleInterval = null;

// Cache resolved live video IDs to avoid hammering proxies/YouTube
const LIVE_VIDEO_CACHE_TTL_MS = 2 * 60 * 1000;
const liveVideoIdCache = new Map(); // channelId -> { videoId, ts }

// Panels are enabled by default unless explicitly disabled in storage
const DEFAULT_DISABLED_PANELS = [];

const STREAMS_STORAGE_KEY = 'situationMonitorStreams';

// Load panel visibility from localStorage
export function getPanelSettings() {
    try {
        const saved = localStorage.getItem('situationMonitorPanels');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
}

// Save panel visibility to localStorage
export function savePanelSettings(settings) {
    try {
        localStorage.setItem('situationMonitorPanels', JSON.stringify(settings));
    } catch (e) {}
}

// Check if panel is enabled
export function isPanelEnabled(panelId) {
    const settings = getPanelSettings();
    if (settings[panelId] !== undefined) {
        return settings[panelId];
    }
    // Default: disabled if in DEFAULT_DISABLED_PANELS
    return !DEFAULT_DISABLED_PANELS.includes(panelId);
}

function isValidStreamObject(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.name !== 'string' || !obj.name.trim()) return false;
    if (obj.type === 'youtube') return typeof obj.videoId === 'string' && obj.videoId.trim().length > 0;
    if (obj.type === 'youtube-channel') return typeof obj.channelUrl === 'string' && obj.channelUrl.trim().length > 0;
    if (obj.type === 'youtube-live-channel') return typeof obj.channelId === 'string' && obj.channelId.trim().length > 0;
    if (obj.type === 'youtube-page') return typeof obj.pageUrl === 'string' && obj.pageUrl.trim().length > 0;
    if (obj.type === 'external') return typeof obj.url === 'string' && obj.url.trim().length > 0;
    return false;
}

function loadCustomStreams() {
    try {
        const raw = localStorage.getItem(STREAMS_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;

        const sanitized = parsed
            .filter(isValidStreamObject)
            .map((s) => {
                // Back-compat: older saves treated YouTube URLs as external-only.
                // Prefer upgrading any channelId-based /live URL to the official embeddable live_stream form.
                const maybeUrl =
                    (s.type === 'youtube-channel' && typeof s.channelUrl === 'string') ? s.channelUrl :
                    (s.type === 'youtube-page' && typeof s.pageUrl === 'string') ? s.pageUrl :
                    (s.type === 'external' && typeof s.url === 'string') ? s.url :
                    null;

                if (maybeUrl && /youtube\.(com|be)\//i.test(maybeUrl)) {
                    // If it's a concrete /channel/UC... URL, force embeddable channel live.
                    const channelIdMatch = maybeUrl.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{10,})/i);
                    if (channelIdMatch) {
                        return { name: s.name, type: 'youtube-live-channel', channelId: channelIdMatch[1] };
                    }

                    // Otherwise, fall back to our standard inference (watch links -> video embeds, handle/c/live -> youtube-page).
                    const inferred = inferStreamFromUrl(s.name, maybeUrl);
                    if (inferred) return inferred;
                }

                return s;
            });

        // Persist migration if we changed anything.
        try {
            if (JSON.stringify(sanitized) !== JSON.stringify(parsed)) {
                localStorage.setItem(STREAMS_STORAGE_KEY, JSON.stringify(sanitized));
            }
        } catch (e) {}

        return sanitized.length ? sanitized : null;
    } catch (e) {
        return null;
    }
}

function saveCustomStreams(streams) {
    try {
        localStorage.setItem(STREAMS_STORAGE_KEY, JSON.stringify(streams));
    } catch (e) {}
}

export function resetStreamsToDefaults() {
    try {
        localStorage.removeItem(STREAMS_STORAGE_KEY);
    } catch (e) {}
    // Reset selection to avoid out-of-range indices
    selectedStreams = new Set();
    updateLivestreamEmbed();
    renderStreamSettingsUI();
}

function getStreams() {
    return loadCustomStreams() || NEWS_STREAMS;
}

function inferStreamFromUrl(name, rawUrl) {
    const url = (rawUrl || '').trim();
    const streamName = (name || '').trim() || 'Stream';
    if (!url) return null;

    // Prefer extracting a direct video ID first.
    const videoId = extractYouTubeId(url);
    if (videoId) {
        return { name: streamName, type: 'youtube', videoId };
    }

    // If this is a channel URL with a concrete channelId, try YouTube's official live embed.
    const channelIdMatch = url.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{10,})/i);
    if (channelIdMatch) {
        return { name: streamName, type: 'youtube-live-channel', channelId: channelIdMatch[1] };
    }

    // If this looks like a YouTube live landing page (handle/custom channel live), try embedding the page anyway.
    const isYouTubeLiveLanding = /youtube\.com\/(?:@[^\/]+|c\/[^\/]+)\/live/i.test(url) || /youtube\.com\/.*\/live/i.test(url);
    if (isYouTubeLiveLanding) {
        return { name: streamName, type: 'youtube-page', pageUrl: url };
    }

    // YouTube channel / handle / live page -> external open
    const isYouTubeChannel = /youtube\.com\/(channel\/|c\/|@)/i.test(url);
    if (isYouTubeChannel) {
        return { name: streamName, type: 'youtube-channel', channelUrl: url };
    }

    return { name: streamName, type: 'external', url };
}

// Toggle panel visibility
export function togglePanel(panelId, refreshCallback) {
    const settings = getPanelSettings();
    settings[panelId] = !isPanelEnabled(panelId);
    savePanelSettings(settings);
    applyPanelSettings();
    updateSettingsUI();
    if (refreshCallback) {
        refreshCallback();
    }
}

// Apply panel settings to DOM
export function applyPanelSettings() {
    document.querySelectorAll('[data-panel]').forEach(panel => {
        const panelId = panel.dataset.panel;
        if (isPanelEnabled(panelId)) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    });
}

// Toggle settings modal
export function toggleSettings(renderMonitorsList) {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('open');
    if (modal.classList.contains('open')) {
        updateSettingsUI();
        if (renderMonitorsList) {
            renderMonitorsList();
        }
        renderStreamSettingsUI();
    }
}

// Update settings UI
export function updateSettingsUI() {
    const container = document.getElementById('panelToggles');
    if (!container) return;

    container.innerHTML = Object.entries(PANELS).map(([id, config]) => {
        const enabled = isPanelEnabled(id);
        return `
            <div class="panel-toggle-item">
                <label onclick="togglePanel('${id}')">${config.name}</label>
                <div class="toggle-switch ${enabled ? 'on' : ''}" onclick="togglePanel('${id}')"></div>
            </div>
        `;
    }).join('');

    // Stream settings section is rendered separately (requires DOM listeners)
}

function getStreamSettingsRows() {
    const streams = getStreams();
    return streams.map(s => {
        if (s.type === 'youtube' && s.videoId) {
            return { name: s.name, url: `https://www.youtube.com/watch?v=${s.videoId}` };
        }
        if (s.type === 'youtube-channel' && s.channelUrl) {
            return { name: s.name, url: s.channelUrl };
        }
        if (s.type === 'youtube-live-channel' && s.channelId) {
            return { name: s.name, url: `https://www.youtube.com/channel/${s.channelId}/live` };
        }
        if (s.type === 'youtube-page' && s.pageUrl) {
            return { name: s.name, url: s.pageUrl };
        }
        if (s.type === 'external' && s.url) {
            return { name: s.name, url: s.url };
        }
        return { name: s.name || 'Stream', url: '' };
    });
}

export function renderStreamSettingsUI() {
    const host = document.getElementById('streamSettings');
    if (!host) return;

    const rows = getStreamSettingsRows();
    host.innerHTML = '';

    const list = document.createElement('div');
    list.className = 'stream-settings-list';

    rows.forEach((row, idx) => {
        const item = document.createElement('div');
        item.className = 'stream-settings-item';

        const nameInput = document.createElement('input');
        nameInput.className = 'settings-input stream-name';
        nameInput.type = 'text';
        nameInput.placeholder = 'Name';
        nameInput.value = row.name || '';

        const urlInput = document.createElement('input');
        urlInput.className = 'settings-input stream-url';
        urlInput.type = 'text';
        urlInput.placeholder = 'YouTube link/ID, channel URL, or external URL';
        urlInput.value = row.url || '';

        const controls = document.createElement('div');
        controls.className = 'stream-settings-controls';

        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.className = 'settings-btn stream-move';
        upBtn.textContent = '↑';
        upBtn.title = 'Move up';

        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.className = 'settings-btn stream-move';
        downBtn.textContent = '↓';
        downBtn.title = 'Move down';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'settings-btn stream-remove';
        removeBtn.textContent = 'Remove';

        controls.appendChild(upBtn);
        controls.appendChild(downBtn);
        controls.appendChild(removeBtn);

        item.appendChild(nameInput);
        item.appendChild(urlInput);
        item.appendChild(controls);
        list.appendChild(item);

        const persist = () => persistStreamSettingsFromUI();
        nameInput.addEventListener('change', persist);
        urlInput.addEventListener('change', persist);

        upBtn.addEventListener('click', () => moveStreamRow(idx, -1));
        downBtn.addEventListener('click', () => moveStreamRow(idx, 1));
        removeBtn.addEventListener('click', () => removeStreamRow(idx));
    });

    host.appendChild(list);

    const addBtn = document.getElementById('addStreamBtn');
    if (addBtn) {
        addBtn.onclick = () => {
            addStreamRow();
        };
    }

    const resetBtn = document.getElementById('resetStreamsBtn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            resetStreamsToDefaults();
        };
    }
}

function persistStreamSettingsFromUI() {
    const host = document.getElementById('streamSettings');
    if (!host) return;

    const items = host.querySelectorAll('.stream-settings-item');
    const streams = [];
    items.forEach(item => {
        const name = item.querySelector('.stream-name')?.value || '';
        const url = item.querySelector('.stream-url')?.value || '';
        const stream = inferStreamFromUrl(name, url);
        if (stream) streams.push(stream);
    });

    // Avoid saving an empty list; keep defaults if user deletes everything
    if (streams.length === 0) {
        try { localStorage.removeItem(STREAMS_STORAGE_KEY); } catch (e) {}
    } else {
        saveCustomStreams(streams);
    }

    // Clear selection if it is now out of range
    const current = getStreams();
    selectedStreams = new Set(Array.from(selectedStreams).filter(i => i >= 0 && i < current.length));
    if (selectedStreams.size === 0 && current.length > 0) {
        selectedStreams.add(0);
    }

    updateLivestreamEmbed();
}

function addStreamRow() {
    const current = getStreamSettingsRows();
    current.push({ name: '', url: '' });
    const streams = current.map(r => inferStreamFromUrl(r.name, r.url)).filter(Boolean);
    // If the new row is empty, keep existing saved list and just re-render UI
    if (streams.length) saveCustomStreams(streams);
    renderStreamSettingsUI();
}

function removeStreamRow(index) {
    const current = getStreamSettingsRows();
    current.splice(index, 1);
    const streams = current.map(r => inferStreamFromUrl(r.name, r.url)).filter(Boolean);
    if (streams.length) saveCustomStreams(streams);
    else {
        try { localStorage.removeItem(STREAMS_STORAGE_KEY); } catch (e) {}
    }
    selectedStreams = new Set();
    updateLivestreamEmbed();
    renderStreamSettingsUI();
}

function moveStreamRow(index, delta) {
    const current = getStreamSettingsRows();
    const target = index + delta;
    if (target < 0 || target >= current.length) return;
    const tmp = current[index];
    current[index] = current[target];
    current[target] = tmp;
    const streams = current.map(r => inferStreamFromUrl(r.name, r.url)).filter(Boolean);
    if (streams.length) saveCustomStreams(streams);
    selectedStreams = new Set();
    updateLivestreamEmbed();
    renderStreamSettingsUI();
}

// Extract YouTube video ID from various URL formats
export function extractYouTubeId(url) {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([^&\?\/]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Save livestream URL
export function saveLivestreamUrl() {
    const input = document.getElementById('livestreamUrl');
    const url = input.value.trim();
    localStorage.setItem('livestreamUrl', url);
    updateLivestreamEmbed();
}

// Render stream embed for current selection
function renderStreamEmbed(stream, index = 0) {
    const originParam = (typeof location !== 'undefined' && location.origin)
        ? `&origin=${encodeURIComponent(location.origin)}`
        : '';

    // Use youtube-nocookie.com - YouTube's privacy-enhanced mode that bypasses some tracking protection
    const ytHost = 'https://www.youtube-nocookie.com';

    // YouTube live stream by channelId
    if (stream.type === 'youtube-live-channel' && stream.channelId) {
        const livePageUrl = `https://www.youtube.com/channel/${stream.channelId}/live`;
        // Use privacy-enhanced embed with minimal parameters
        const embedUrl = `${ytHost}/embed/live_stream?channel=${stream.channelId}&autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
        
        return `
            <div class="stream-embed-wrapper" data-yt-channel-id="${stream.channelId}">
                <iframe data-yt-live-channel-id="${stream.channelId}" src="${embedUrl}" title="${stream.name || 'Live stream'}" loading="eager" referrerpolicy="no-referrer" frameborder="0" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <div class="stream-fallback">
                    <span>Stream not loading?</span>
                    <a href="${livePageUrl}" target="_blank" rel="noopener" class="stream-fallback-link">Watch on YouTube ↗</a>
                </div>
            </div>
        `;
    }

    // Try embedding a YouTube /live landing page anyway (may be blocked by YouTube)
    if (stream.type === 'youtube-page' && stream.pageUrl) {
        return `
            <div class="stream-embed-wrapper">
                <iframe src="${stream.pageUrl}" title="${stream.name || 'Live stream'}" loading="lazy" frameborder="0" referrerpolicy="no-referrer-when-downgrade" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <div class="stream-fallback">
                    <span>Stream not loading?</span>
                    <a href="${stream.pageUrl}" target="_blank" rel="noopener" class="stream-fallback-link">Watch on YouTube ↗</a>
                </div>
            </div>
        `;
    }

    // YouTube channel live page
    if (stream.type === 'youtube-channel' && stream.channelUrl) {
        return `
            <div class="stream-external">
                <div class="external-stream-icon">📺</div>
                <div class="external-stream-name">${stream.name}</div>
                <a href="${stream.channelUrl}" target="_blank" rel="noopener" class="external-stream-btn">Watch Live on YouTube ↗</a>
                <div class="external-stream-note">Click to open in new tab</div>
            </div>
        `;
    }
    
    // Legacy YouTube video ID
    if (stream.type === 'youtube' && stream.videoId) {
        const embedUrl = `${ytHost}/embed/${stream.videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
        return `<iframe src="${embedUrl}" title="${stream.name || 'YouTube stream'}" loading="eager" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    }
    
    // External URL
    if (stream.type === 'external' && stream.url) {
        return `
            <div class="stream-external">
                <div class="external-stream-icon">🌐</div>
                <div class="external-stream-name">${stream.name}</div>
                <a href="${stream.url}" target="_blank" rel="noopener" class="external-stream-btn">Open ${stream.name} ↗</a>
                <div class="external-stream-note">Opens in new tab</div>
            </div>
        `;
    }
    
    return '<div class="loading-msg">Stream unavailable</div>';
}

// Select a stream by index
export function selectStream(index) {
    const streams = getStreams();
    if (index < 0 || index >= streams.length) return;
    currentStreamIndex = index;
    localStorage.setItem('currentStreamIndex', index);
    
    // Update stream buttons
    document.querySelectorAll('.stream-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // Render the stream
    const panel = document.getElementById('tbpnPanel');
    if (panel) {
        panel.innerHTML = renderStreamEmbed(streams[index]);
    }
}

export function prevStream() {
    const streams = getStreams();
    if (!streams.length) return;
    selectStream((currentStreamIndex - 1 + streams.length) % streams.length);
}

export function nextStream() {
    const streams = getStreams();
    if (!streams.length) return;
    selectStream((currentStreamIndex + 1) % streams.length);
}

export function toggleTileMode() { /* placeholder */ }
export function startStreamCycle() { /* placeholder */ }
export function stopStreamCycle() { /* placeholder */ }

// Toggle stream selection for tiling (multi-select)
export function toggleStreamSelection(index) {
    if (selectedStreams.has(index)) {
        selectedStreams.delete(index);
    } else {
        // Limit to 4 streams max for tiling
        if (selectedStreams.size >= 4) {
            // Remove the oldest one
            const first = selectedStreams.values().next().value;
            selectedStreams.delete(first);
        }
        selectedStreams.add(index);
    }
    
    // Update UI
    updateStreamSelectorUI();
    renderStreamTiles();
}

// Update stream selector button states
function updateStreamSelectorUI() {
    document.querySelectorAll('.stream-btn').forEach((btn, i) => {
        btn.classList.toggle('active', selectedStreams.has(i));
    });
}

// Render tiled streams
function renderStreamTiles() {
    const container = document.getElementById('streamContainer');
    if (!container) return;

    const streams = getStreams();
    
    const streamIndices = Array.from(selectedStreams);
    
    if (streamIndices.length === 0) {
        container.innerHTML = '<div class="loading-msg">Click streams below to add them...</div>';
        return;
    }
    
    const tilesClass = `tiles-${Math.min(streamIndices.length, 4)}`;
    
    container.innerHTML = `<div class="stream-tiles ${tilesClass}">
        ${streamIndices.map(idx => {
            const stream = streams[idx];
            if (!stream) return '';
            return `<div class="stream-tile">${renderStreamEmbed(stream)}</div>`;
        }).join('')}
    </div>`;

    // After the DOM is updated, opportunistically resolve channel live streams to a concrete video ID.
    // This can recover channels where /embed/live_stream fails but /embed/<videoId> works.
    hydrateYouTubeLiveEmbeds(container);
}

async function fetchTextViaProxies(url, timeoutMs = 12000) {
    const proxies = Array.isArray(CORS_PROXIES) && CORS_PROXIES.length ? CORS_PROXIES : ['https://corsproxy.io/?'];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        for (const proxy of proxies) {
            const proxiedUrl = `${proxy}${encodeURIComponent(url)}`;
            try {
                const res = await fetch(proxiedUrl, { signal: controller.signal, cache: 'no-store' });
                if (!res.ok) continue;
                const text = await res.text();
                if (text && text.length > 100) return text;
            } catch (e) {
                // try next proxy
            }
        }
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

function extractFirstYouTubeVideoIdFromHtml(html) {
    if (!html) return null;
    const match = html.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

async function resolveLiveVideoIdForChannel(channelId) {
    const cached = liveVideoIdCache.get(channelId);
    const now = Date.now();
    if (cached && (now - cached.ts) < LIVE_VIDEO_CACHE_TTL_MS) return cached.videoId;

    const liveUrl = `https://www.youtube.com/channel/${channelId}/live`;
    const html = await fetchTextViaProxies(liveUrl);
    const videoId = extractFirstYouTubeVideoIdFromHtml(html);
    if (videoId) {
        liveVideoIdCache.set(channelId, { videoId, ts: now });
    }
    return videoId;
}

function hydrateYouTubeLiveEmbeds(rootEl) {
    if (!rootEl) return;
    const iframes = rootEl.querySelectorAll('iframe[data-yt-live-channel-id]');
    if (!iframes.length) return;

    iframes.forEach((iframe) => {
        const channelId = iframe.getAttribute('data-yt-live-channel-id');
        if (!channelId) return;
        if (iframe.getAttribute('data-yt-live-resolved') === '1') return;
        iframe.setAttribute('data-yt-live-resolved', '1');

        // Resolve in background; if we find a concrete videoId, swap to /embed/<videoId>.
        resolveLiveVideoIdForChannel(channelId)
            .then((videoId) => {
                if (!videoId) return;
                const originParam = (typeof location !== 'undefined' && location.origin)
                    ? `&origin=${encodeURIComponent(location.origin)}`
                    : '';
                const desired = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0${originParam}`;
                if (iframe.src === desired) return;
                iframe.src = desired;
            })
            .catch(() => {});
    });
}

// Render stream selector buttons (now for multi-select)
export function renderStreamSelector() {
    const container = document.getElementById('streamSelector');
    if (!container) return;

    const streams = getStreams();
    container.innerHTML = streams.map((stream, i) => 
        `<button class="stream-btn ${selectedStreams.has(i) ? 'active' : ''}" onclick="toggleStreamSelection(${i})">${stream.name}</button>`
    ).join('');
}

// Render stream embed for a single stream (used by tiles)

// Update the livestream embed (now uses tiled mode)
export function updateLivestreamEmbed() {
    // Render stream selector
    renderStreamSelector();

    const streams = getStreams();
    
    // If no streams selected, auto-select first 4 (France 24, DW, NBC, Reuters)
    if (selectedStreams.size === 0 && streams.length > 0) {
        const autoSelectCount = Math.min(4, streams.length);
        for (let i = 0; i < autoSelectCount; i++) {
            selectedStreams.add(i);
        }
        updateStreamSelectorUI();
    }
    
    renderStreamTiles();
}

// Get current livestream embed URL
export function getLivestreamEmbedUrl() {
    const url = localStorage.getItem('livestreamUrl') || 'https://www.youtube.com/watch?v=jWEZa9WEnIo';
    const videoId = extractYouTubeId(url);
    const originParam = (typeof location !== 'undefined' && location.origin)
        ? `&origin=${encodeURIComponent(location.origin)}`
        : '';
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&mute=1${originParam}` : '';
}

// Initialize drag and drop
export function initDragAndDrop() {
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;

    const panels = dashboard.querySelectorAll('.panel');

    panels.forEach(panel => {
        const panelId = panel.dataset.panel;
        const isDraggable = !NON_DRAGGABLE_PANELS.includes(panelId);

        panel.setAttribute('draggable', isDraggable ? 'true' : 'false');

        if (!isDraggable) {
            panel.style.cursor = 'default';
            const header = panel.querySelector('.panel-header');
            if (header) header.style.cursor = 'default';
            return;
        }

        panel.addEventListener('dragstart', (e) => {
            draggedPanel = panel;
            panel.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', panel.dataset.panel);
        });

        panel.addEventListener('dragend', () => {
            panel.classList.remove('dragging');
            document.querySelectorAll('.panel.drag-over').forEach(p => p.classList.remove('drag-over'));
            draggedPanel = null;
            savePanelOrder();
        });

        panel.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (draggedPanel && draggedPanel !== panel) {
                panel.classList.add('drag-over');
            }
        });

        panel.addEventListener('dragleave', () => {
            panel.classList.remove('drag-over');
        });

        panel.addEventListener('drop', (e) => {
            e.preventDefault();
            panel.classList.remove('drag-over');

            if (draggedPanel && draggedPanel !== panel) {
                const dashboard = document.querySelector('.dashboard');
                const panels = [...dashboard.querySelectorAll('.panel')];
                const draggedIdx = panels.indexOf(draggedPanel);
                const targetIdx = panels.indexOf(panel);

                if (draggedIdx < targetIdx) {
                    panel.parentNode.insertBefore(draggedPanel, panel.nextSibling);
                } else {
                    panel.parentNode.insertBefore(draggedPanel, panel);
                }
            }
        });
    });
}

// Save panel order to localStorage
export function savePanelOrder() {
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;

    const panels = dashboard.querySelectorAll('.panel');
    const order = [...panels].map(p => p.dataset.panel);
    localStorage.setItem('panelOrder', JSON.stringify(order));
}

// Restore panel order from localStorage
export function restorePanelOrder() {
    const savedOrder = localStorage.getItem('panelOrder');
    if (!savedOrder) return;

    try {
        const order = JSON.parse(savedOrder);
        const dashboard = document.querySelector('.dashboard');
        if (!dashboard) return;

        const panels = [...dashboard.querySelectorAll('.panel')];

        order.forEach(panelId => {
            if (NON_DRAGGABLE_PANELS.includes(panelId)) return;
            const panel = panels.find(p => p.dataset.panel === panelId);
            if (panel) {
                dashboard.appendChild(panel);
            }
        });
    } catch (e) {
        console.error('Error restoring panel order:', e);
    }
}

// Reset panel order
export function resetPanelOrder() {
    localStorage.removeItem('panelOrder');
    location.reload();
}

// Initialize panel resize
export function initPanelResize() {
    document.querySelectorAll('.panel').forEach(panel => {
        if (panel.querySelector('.panel-resize-handle')) return;

        // Corner handle
        const cornerHandle = document.createElement('div');
        cornerHandle.className = 'panel-resize-handle corner';
        cornerHandle.addEventListener('mousedown', (e) => startResize(e, panel, 'corner'));
        panel.appendChild(cornerHandle);

        // Bottom edge handle
        const bottomHandle = document.createElement('div');
        bottomHandle.className = 'panel-resize-handle bottom';
        bottomHandle.addEventListener('mousedown', (e) => startResize(e, panel, 'bottom'));
        panel.appendChild(bottomHandle);

        // Right edge handle
        const rightHandle = document.createElement('div');
        rightHandle.className = 'panel-resize-handle right';
        rightHandle.addEventListener('mousedown', (e) => startResize(e, panel, 'right'));
        panel.appendChild(rightHandle);
    });

    // Global mouse events for resize
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
}

function startResize(e, panel, direction) {
    e.preventDefault();
    e.stopPropagation();

    resizingPanel = panel;
    resizeDirection = direction;
    resizeStart = {
        x: e.clientX,
        y: e.clientY,
        width: panel.offsetWidth,
        height: panel.offsetHeight
    };

    panel.classList.add('resizing');
    document.body.style.cursor = direction === 'corner' ? 'nwse-resize' :
                                 direction === 'bottom' ? 'ns-resize' : 'ew-resize';
}

function handleResizeMove(e) {
    if (!resizingPanel) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    if (resizeDirection === 'corner' || resizeDirection === 'right') {
        const newWidth = Math.max(200, resizeStart.width + deltaX);
        resizingPanel.style.width = newWidth + 'px';
        resizingPanel.style.minWidth = newWidth + 'px';
        resizingPanel.style.maxWidth = newWidth + 'px';
    }

    if (resizeDirection === 'corner' || resizeDirection === 'bottom') {
        const newHeight = Math.max(150, resizeStart.height + deltaY);
        resizingPanel.style.minHeight = newHeight + 'px';
        resizingPanel.style.maxHeight = newHeight + 'px';
    }
}

function handleResizeEnd() {
    if (resizingPanel) {
        resizingPanel.classList.remove('resizing');
        savePanelSizes();
        resizingPanel = null;
        resizeDirection = null;
        document.body.style.cursor = '';
    }
}

// Save panel sizes to localStorage
export function savePanelSizes() {
    const sizes = {};
    document.querySelectorAll('.panel:not(.pinned-panel-clone)').forEach(panel => {
        const panelName = panel.getAttribute('data-panel');
        if (panelName && (panel.style.minHeight || panel.style.width)) {
            sizes[panelName] = {
                height: panel.style.minHeight,
                width: panel.style.width
            };
        }
    });
    localStorage.setItem('panelSizes', JSON.stringify(sizes));
}

// Restore panel sizes from localStorage
export function restorePanelSizes() {
    const saved = localStorage.getItem('panelSizes');
    if (!saved) return;

    try {
        const sizes = JSON.parse(saved);
        Object.entries(sizes).forEach(([panelName, dims]) => {
            const panel = document.querySelector(`.panel[data-panel="${panelName}"]:not(.pinned-panel-clone)`);
            if (panel) {
                if (dims.height) {
                    panel.style.minHeight = dims.height;
                    panel.style.maxHeight = dims.height;
                }
                if (dims.width) {
                    panel.style.width = dims.width;
                    panel.style.minWidth = dims.width;
                    panel.style.maxWidth = dims.width;
                }
            }
        });
    } catch (e) {
        console.error('Failed to restore panel sizes:', e);
    }
}

// Initialize all panel functionality
export function initPanels(renderMonitorsList) {
    applyPanelSettings();
    restorePanelOrder();
    updateLivestreamEmbed();
    initDragAndDrop();
}
