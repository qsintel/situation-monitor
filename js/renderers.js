// renderers.js - All panel render functions

import { timeAgo, getRelativeTime, escapeHtml } from './utils.js';
import { isPanelEnabled } from './panels.js';

// Render news items
export function renderNews(items, panelId, countId) {
    const panel = document.getElementById(panelId);
    const count = document.getElementById(countId);

    if (!panel) return; // Panel doesn't exist in current tab

    if (items.length === 0) {
        panel.innerHTML = '<div class="error-msg">Failed to load</div>';
        if (count) count.textContent = '0';
        return;
    }

    panel.innerHTML = items.map(item => `
        <div class="item ${item.isAlert ? 'alert' : ''}">
            <div class="item-source">${item.source}${item.isAlert ? '<span class="alert-tag">ALERT</span>' : ''}</div>
            <a class="item-title" href="${item.link}" target="_blank">${item.title}</a>
            <div class="item-time">${timeAgo(item.pubDate)}</div>
        </div>
    `).join('');

    if (count) count.textContent = items.length;
}

// Render markets
export function renderMarkets(markets) {
    const panel = document.getElementById('marketsPanel');
    const count = document.getElementById('marketsCount');

    if (!panel) return;

    if (markets.length === 0) {
        panel.innerHTML = '<div class="error-msg">Failed to load</div>';
        if (count) count.textContent = '0';
        return;
    }

    panel.innerHTML = markets.map(m => {
        const changeClass = m.change > 0 ? 'up' : m.change < 0 ? 'down' : '';
        const changeText = m.change !== null ? `${m.change > 0 ? '+' : ''}${m.change.toFixed(2)}%` : '-';
        const priceDisplay = typeof m.price === 'number' && m.price > 100
            ? m.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
            : m.price?.toFixed(2);

        return `
            <div class="market-item">
                <div>
                    <div class="market-name">${m.name}</div>
                    <div class="market-symbol">${m.symbol}</div>
                </div>
                <div class="market-data">
                    <div class="market-price">$${priceDisplay}</div>
                    <div class="market-change ${changeClass}">${changeText}</div>
                </div>
            </div>
        `;
    }).join('');

    if (count) count.textContent = markets.length;
}

// Render sector heatmap
export function renderHeatmap(sectors) {
    const panel = document.getElementById('heatmapPanel');

    if (!panel) return;

    if (sectors.length === 0) {
        panel.innerHTML = '<div class="error-msg">Failed to load</div>';
        return;
    }

    panel.innerHTML = '<div class="heatmap">' + sectors.map(s => {
        let colorClass = 'up-0';
        const c = s.change;
        if (c >= 2) colorClass = 'up-3';
        else if (c >= 1) colorClass = 'up-2';
        else if (c >= 0.5) colorClass = 'up-1';
        else if (c >= 0) colorClass = 'up-0';
        else if (c >= -0.5) colorClass = 'down-0';
        else if (c >= -1) colorClass = 'down-1';
        else if (c >= -2) colorClass = 'down-2';
        else colorClass = 'down-3';

        return `
            <div class="heatmap-cell ${colorClass}">
                <div class="sector-name">${s.name}</div>
                <div class="sector-change">${s.change >= 0 ? '+' : ''}${s.change.toFixed(2)}%</div>
            </div>
        `;
    }).join('') + '</div>';
}

// Render commodities
export function renderCommodities(commodities) {
    const panel = document.getElementById('commoditiesPanel');

    if (!panel) return;

    if (commodities.length === 0) {
        panel.innerHTML = '<div class="error-msg">Failed to load</div>';
        return;
    }

    panel.innerHTML = commodities.map(m => {
        const changeClass = m.change > 0 ? 'up' : m.change < 0 ? 'down' : '';
        const changeText = `${m.change > 0 ? '+' : ''}${m.change.toFixed(2)}%`;
        const priceDisplay = m.price?.toFixed(2);

        return `
            <div class="market-item">
                <div>
                    <div class="market-name">${m.name}</div>
                    <div class="market-symbol">${m.symbol}</div>
                </div>
                <div class="market-data">
                    <div class="market-price">${m.symbol === 'VIX' ? '' : '$'}${priceDisplay}</div>
                    <div class="market-change ${changeClass}">${changeText}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Polymarket predictions
export function renderPolymarket(markets) {
    const panel = document.getElementById('polymarketPanel');
    const count = document.getElementById('polymarketCount');

    if (!panel) return;

    if (markets.length === 0) {
        panel.innerHTML = '<div class="error-msg">Failed to load predictions</div>';
        if (count) count.textContent = '0';
        return;
    }

    const formatVolume = (v) => {
        if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
        if (v >= 1000) return '$' + (v / 1000).toFixed(0) + 'K';
        return '$' + v.toFixed(0);
    };

    panel.innerHTML = markets.map(m => `
        <div class="prediction-item">
            <div>
                <div class="prediction-question">${m.question}</div>
                <div class="prediction-volume">Vol: ${formatVolume(m.volume)}</div>
            </div>
            <div class="prediction-odds">
                <span class="prediction-yes">${m.yes}%</span>
            </div>
        </div>
    `).join('');

    if (count) count.textContent = markets.length;
}

// Render congressional trades
export function renderCongressTrades(trades) {
    const panel = document.getElementById('congressPanel');
    const count = document.getElementById('congressCount');

    if (!panel) return;

    if (trades.length === 0) {
        panel.innerHTML = '<div class="error-msg">Congressional trade data unavailable</div>';
        if (count) count.textContent = '-';
        return;
    }

    panel.innerHTML = trades.map(t => `
        <div class="congress-item">
            <div class="congress-info">
                <div>
                    <span class="congress-name">${escapeHtml(t.name || 'Unknown')}</span>
                    <span class="congress-party ${t.party || ''}">${t.party || '-'}</span>
                </div>
                <div class="congress-ticker">${escapeHtml(t.ticker || '-')}</div>
                <div class="congress-meta">${t.date ? timeAgo(t.date) : ''} ${t.action || ''}</div>
            </div>
            <div class="congress-type">
                <span class="congress-action ${(t.action || '').toLowerCase()}">${(t.action || '-').toUpperCase()}</span>
                <div class="congress-amount">${escapeHtml(t.amount || '-')}</div>
            </div>
        </div>
    `).join('');

    if (count) count.textContent = trades.length;
}

// Render whale watch
export function renderWhaleWatch(whales) {
    const panel = document.getElementById('whalePanel');
    const count = document.getElementById('whaleCount');

    if (!panel) return;

    if (!whales || whales.length === 0) {
        panel.innerHTML = '<div class="error-msg">No large crypto transactions in last hour</div>';
        if (count) count.textContent = '-';
        return;
    }

    const formatAmount = (amt) => amt >= 1000 ? (amt / 1000).toFixed(1) + 'K' : amt.toFixed(2);
    const formatUSD = (usd) => {
        if (usd >= 1000000000) return '$' + (usd / 1000000000).toFixed(1) + 'B';
        if (usd >= 1000000) return '$' + (usd / 1000000).toFixed(1) + 'M';
        return '$' + (usd / 1000).toFixed(0) + 'K';
    };
    
    // Get blockchain explorer URL based on coin type
    const getExplorerUrl = (coin, fullHash) => {
        if (!fullHash) return null;
        switch (coin.toUpperCase()) {
            case 'BTC': return `https://www.blockchain.com/btc/tx/${fullHash}`;
            case 'ETH': return `https://etherscan.io/tx/${fullHash}`;
            case 'USDT': return `https://etherscan.io/tx/${fullHash}`;
            case 'USDC': return `https://etherscan.io/tx/${fullHash}`;
            default: return `https://www.blockchain.com/search?search=${fullHash}`;
        }
    };

    panel.innerHTML = whales.map(w => {
        const explorerUrl = getExplorerUrl(w.coin, w.fullHash);
        const hashDisplay = explorerUrl 
            ? `<a href="${explorerUrl}" target="_blank" rel="noopener" class="whale-hash-link" title="View on blockchain explorer">${w.hash}</a>`
            : `<span>${w.hash}</span>`;
        
        return `
            <div class="whale-item">
                <div class="whale-header">
                    <span class="whale-coin">${w.coin}</span>
                    <span class="whale-amount">${formatAmount(w.amount)} ${w.coin}</span>
                </div>
                <div class="whale-flow">
                    <span class="whale-usd">${formatUSD(w.usd)}</span>
                    <span class="arrow">→</span>
                    ${hashDisplay}
                </div>
            </div>
        `;
    }).join('');

    if (count) count.textContent = whales.length;
}

// Render main character
export function renderMainCharacter(rankings) {
    const panel = document.getElementById('mainCharPanel');

    if (!panel) return;

    if (rankings.length === 0) {
        panel.innerHTML = '<div class="error-msg">No main character detected</div>';
        return;
    }

    const [topName, topCount] = rankings[0];

    panel.innerHTML = `
        <div class="main-char-display">
            <div class="main-char-label">Today's Main Character</div>
            <div class="main-char-name">${topName}</div>
            <div class="main-char-count">${topCount} mentions in headlines</div>

            <div class="main-char-list">
                ${rankings.slice(1, 8).map((r, i) => `
                    <div class="char-row">
                        <span class="rank">${i + 2}.</span>
                        <span class="name">${r[0]}</span>
                        <span class="mentions">${r[1]}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Render government contracts
export function renderGovContracts(contracts) {
    const panel = document.getElementById('contractsPanel');
    const count = document.getElementById('contractsCount');

    if (!panel) return;

    if (contracts.length === 0) {
        panel.innerHTML = '<div class="error-msg">Unable to load contracts</div>';
        if (count) count.textContent = '0';
        return;
    }

    const formatValue = (v) => {
        if (v >= 1000000000) return '$' + (v / 1000000000).toFixed(1) + 'B';
        if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
        if (v >= 1000) return '$' + (v / 1000).toFixed(0) + 'K';
        return '$' + v.toFixed(0);
    };

    panel.innerHTML = contracts.map(c => `
        <div class="contract-item">
            <div class="contract-agency">${c.agency}</div>
            <div class="contract-desc">${c.description.substring(0, 100)}${c.description.length > 100 ? '...' : ''}</div>
            <div class="contract-meta">
                <span class="contract-vendor">${c.vendor}</span>
                <span class="contract-value">${formatValue(c.amount)}</span>
            </div>
        </div>
    `).join('');

    if (count) count.textContent = contracts.length;
}

// Render AI news
export function renderAINews(items) {
    const panel = document.getElementById('aiPanel');
    const count = document.getElementById('aiCount');

    if (!panel) return;

    if (items.length === 0) {
        panel.innerHTML = '<div class="error-msg">Unable to load AI news</div>';
        if (count) count.textContent = '0';
        return;
    }

    panel.innerHTML = items.map(item => `
        <div class="ai-item">
            <div class="ai-source">${item.source}</div>
            <a class="ai-title item-title" href="${item.link}" target="_blank">${item.title}</a>
            <div class="ai-date">${timeAgo(item.date)}</div>
        </div>
    `).join('');

    if (count) count.textContent = items.length;
}

// Render money printer (Fed balance)
export function renderMoneyPrinter(data) {
    const panel = document.getElementById('printerPanel');

    if (!panel) return;

    const isExpanding = data.change > 0;
    const status = isExpanding ? 'PRINTER ON' : 'PRINTER OFF';

    panel.innerHTML = `
        <div class="printer-gauge">
            <div class="printer-label">Federal Reserve Balance Sheet</div>
            <div class="printer-value">
                ${data.value.toFixed(2)}<span class="printer-unit">T USD</span>
            </div>
            <div class="printer-change ${isExpanding ? 'up' : 'down'}">
                ${data.change >= 0 ? '+' : ''}${(data.change * 1000).toFixed(0)}B (${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%) WoW
            </div>
            <div class="printer-bar">
                <div class="printer-fill" style="width: ${Math.min(data.percentOfMax, 100)}%"></div>
            </div>
            <div class="printer-status">
                <span class="printer-indicator ${isExpanding ? 'on' : 'off'}"></span>
                ${status}
            </div>
        </div>
    `;
}

// Render Intel Feed panel
export function renderIntelFeed(items) {
    const panel = document.getElementById('intelPanel');
    const count = document.getElementById('intelCount');

    if (!panel) return;

    if (!items || items.length === 0) {
        panel.innerHTML = '<div class="loading-msg">No intel available</div>';
        if (count) count.textContent = '-';
        return;
    }

    if (count) count.textContent = items.length;

    panel.innerHTML = items.map(item => {
        let tagsHTML = '';

        if (item.sourceType === 'osint') {
            tagsHTML += '<span class="intel-tag osint">OSINT</span>';
        } else if (item.sourceType === 'govt') {
            tagsHTML += '<span class="intel-tag govt">GOVT</span>';
        }

        // Handle items that might have region (singular) or regions (plural)
        let regions = item.regions || [];
        if (item.region && regions.length === 0) {
            regions = [item.region];
        }
        const topics = item.topics || [];

        regions.slice(0, 2).forEach(r => {
            tagsHTML += `<span class="intel-tag region">${r}</span>`;
        });

        topics.slice(0, 2).forEach(t => {
            tagsHTML += `<span class="intel-tag topic">${t}</span>`;
        });

        const timeAgoStr = item.pubDate ? getRelativeTime(new Date(item.pubDate)) : '';

        return `
            <div class="intel-item ${item.isPriority ? 'priority' : ''}">
                <div class="intel-header">
                    <span class="intel-source">${item.source || 'Intel'}</span>
                    <div class="intel-tags">${tagsHTML}</div>
                </div>
                <a href="${item.link}" target="_blank" class="intel-title">${item.title}</a>
                <div class="intel-meta">
                    <span>${timeAgoStr}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Render Layoffs panel
export function renderLayoffs(layoffs) {
    const panel = document.getElementById('layoffsPanel');
    const count = document.getElementById('layoffsCount');

    if (!panel) return;

    if (!layoffs || layoffs.length === 0) {
        panel.innerHTML = '<div class="loading-msg">No recent layoffs data</div>';
        if (count) count.textContent = '-';
        return;
    }

    if (count) count.textContent = layoffs.length;

    panel.innerHTML = layoffs.map(l => `
        <div class="layoff-item">
            <div class="layoff-company">${l.company}</div>
            ${l.count ? `<div class="layoff-count">${parseInt(l.count).toLocaleString()} jobs</div>` : ''}
            <div class="layoff-meta">
                <span class="headline">${l.title}</span>
                <span class="time">${timeAgo(l.date)}</span>
            </div>
        </div>
    `).join('');
}

// Render Situation panel (Venezuela or Greenland)
export function renderSituation(panelId, statusId, news, config) {
    const panel = document.getElementById(panelId);
    const status = document.getElementById(statusId);

    if (!panel) return;

    let threatLevel = 'monitoring';
    let threatText = 'MONITORING';

    if (news.length > 0) {
        const recentNews = news.filter(n => {
            const date = new Date(n.pubDate);
            const hoursSince = (Date.now() - date.getTime()) / (1000 * 60 * 60);
            return hoursSince < 24;
        });

        const criticalKeywords = config.criticalKeywords || [];
        const hasCritical = news.some(n =>
            criticalKeywords.some(k => n.title.toLowerCase().includes(k))
        );

        if (hasCritical || recentNews.length >= 3) {
            threatLevel = 'critical';
            threatText = 'CRITICAL';
        } else if (recentNews.length >= 1) {
            threatLevel = 'elevated';
            threatText = 'ELEVATED';
        }
    }

    if (status) {
        status.innerHTML = `<span class="situation-status ${threatLevel}">${threatText}</span>`;
    }

    const newsHTML = news.length > 0 ? news.map(n => `
        <div class="situation-item">
            <a href="${n.link}" target="_blank" class="headline">${n.title}</a>
            <div class="meta">${n.source} · ${timeAgo(n.pubDate)}</div>
        </div>
    `).join('') : '<div class="loading-msg">No recent news</div>';

    panel.innerHTML = `
        <div class="situation-header">
            <div class="situation-title">${config.title}</div>
            <div class="situation-subtitle">${config.subtitle}</div>
        </div>
        ${newsHTML}
    `;
}

// Helper function to extract key terms from a headline for matching
function extractKeyTerms(title) {
    const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'as', 'by', 'with', 'from', 'into', 'about', 'after', 'before', 'over', 'under', 'between', 'through', 'during', 'up', 'down', 'out', 'off', 'says', 'said', 'new', 'news', 'report', 'reports', 'live', 'update', 'updates', 'breaking']);
    return (title || '')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !stopWords.has(w));
}

// Check if two headlines are about the same story
function isSimilarStory(title1, title2) {
    const terms1 = extractKeyTerms(title1);
    const terms2 = extractKeyTerms(title2);
    if (terms1.length === 0 || terms2.length === 0) return false;
    
    const commonTerms = terms1.filter(t => terms2.includes(t));
    // Consider similar if they share 2+ key terms or 40%+ overlap
    const overlapRatio = commonTerms.length / Math.min(terms1.length, terms2.length);
    return commonTerms.length >= 2 || overlapRatio >= 0.4;
}

// Ad/spam keywords to filter out of ticker
const TICKER_FILTER_KEYWORDS = [
    'nordvpn', 'expressvpn', 'surfshark', 'vpn deal', 'vpn sale',
    'sponsored', 'advertisement', 'promo code', 'discount code', 'affiliate',
    'buy now', 'limited time offer', 'click here', 'subscribe now',
    'free trial', 'black friday', 'cyber monday', 'sale ends',
    'get it now', 'order now', 'shop now', 'best deal', 'save up to'
];

function isAdContent(title) {
    const lowerTitle = title.toLowerCase();
    return TICKER_FILTER_KEYWORDS.some(kw => lowerTitle.includes(kw));
}

// News ticker for most reported/trending news across sources
export function renderNewsTicker(allNews) {
    const tickerTrack = document.getElementById('tickerTrack');
    if (!tickerTrack) return;

    if (!allNews || allNews.length === 0) {
        tickerTrack.innerHTML = '<span class="ticker-item">No news available</span>';
        return;
    }

    // Filter out ads/sponsored content first
    const filteredNews = allNews.filter(item => !isAdContent(item.title || ''));

    // Group similar stories and count how many sources report them
    const storyGroups = [];
    const processed = new Set();

    filteredNews.forEach((item, index) => {
        if (processed.has(index)) return;
        
        const group = {
            representative: item,
            sources: new Set([item.source]),
            count: 1
        };
        processed.add(index);

        // Find similar stories from other sources
        filteredNews.forEach((other, otherIndex) => {
            if (processed.has(otherIndex)) return;
            if (other.source === item.source) return; // Skip same source
            
            if (isSimilarStory(item.title, other.title)) {
                group.sources.add(other.source);
                group.count++;
                processed.add(otherIndex);
            }
        });

        storyGroups.push(group);
    });

    // Sort by number of sources reporting (most reported first)
    storyGroups.sort((a, b) => b.count - a.count);

    // Take top stories - prioritize multi-source stories, then recent
    const trendingStories = storyGroups
        .filter(g => g.count >= 2) // Stories reported by 2+ sources
        .slice(0, 10);

    // If not enough trending stories, add most recent single-source stories
    if (trendingStories.length < 5) {
        const singleSourceStories = storyGroups
            .filter(g => g.count === 1)
            .sort((a, b) => new Date(b.representative.pubDate) - new Date(a.representative.pubDate))
            .slice(0, 10 - trendingStories.length);
        trendingStories.push(...singleSourceStories);
    }

    if (trendingStories.length === 0) {
        tickerTrack.innerHTML = '<span class="ticker-item">No trending news available</span>';
        return;
    }

    tickerTrack.innerHTML = trendingStories.map(group => {
        const item = group.representative;
        const isTrending = group.count >= 2;
        const sourceCount = group.count > 1 ? ` (${group.count} sources)` : '';
        return `
            <a href="${item.link}" target="_blank" rel="noopener" class="ticker-item ${isTrending ? 'ticker-trending' : ''}">
                <span class="ticker-source">${item.source || 'News'}${sourceCount}</span>
                ${escapeHtml(item.title)}
            </a>
        `;
    }).join('<span class="ticker-separator">•</span>');
    
    // Duplicate content for seamless loop
    tickerTrack.innerHTML += tickerTrack.innerHTML;
}

// Render Cyber Threats panel
export function renderCyberThreats(items) {
    const panel = document.getElementById('cyberPanel');
    const count = document.getElementById('cyberCount');

    if (!panel || !count) return;

    if (items.length === 0) {
        panel.innerHTML = '<div class="error-msg">No cyber threats data</div>';
        count.textContent = '0';
        return;
    }

    panel.innerHTML = items.map(item => `
        <div class="item ${item.isCritical ? 'alert' : ''}">
            <div class="item-source">${item.source || 'Cyber'}${item.isCritical ? '<span class="alert-tag">CRITICAL</span>' : ''}</div>
            <a class="item-title" href="${item.link}" target="_blank">${escapeHtml(item.title)}</a>
            <div class="item-time">${timeAgo(item.pubDate)}</div>
        </div>
    `).join('');

    count.textContent = items.length;
}

// Render Natural Disasters panel
export function renderDisasters(items) {
    const panel = document.getElementById('disastersPanel');
    const count = document.getElementById('disastersCount');

    if (!panel || !count) return;

    if (items.length === 0) {
        panel.innerHTML = '<div class="error-msg">No disaster alerts</div>';
        count.textContent = '0';
        return;
    }

    panel.innerHTML = items.map(item => `
        <div class="item ${item.isUrgent ? 'alert' : ''}">
            <div class="item-source">${item.source || 'Alert'}${item.isUrgent ? '<span class="alert-tag">URGENT</span>' : ''}</div>
            <a class="item-title" href="${item.link}" target="_blank">${escapeHtml(item.title)}</a>
            <div class="item-time">${timeAgo(item.pubDate)}</div>
        </div>
    `).join('');

    count.textContent = items.length;
}

// Render Social Trends panel
export function renderSocialTrends(items) {
    const panel = document.getElementById('socialPanel');
    const count = document.getElementById('socialCount');

    if (!panel || !count) return;

    if (items.length === 0) {
        panel.innerHTML = '<div class="error-msg">No social trends</div>';
        count.textContent = '0';
        return;
    }

    panel.innerHTML = items.map(item => `
        <div class="item">
            <div class="item-source">${item.source || 'Social'}</div>
            <a class="item-title" href="${item.link}" target="_blank">${escapeHtml(item.title)}</a>
            <div class="item-time">${timeAgo(item.pubDate)}</div>
        </div>
    `).join('');

    count.textContent = items.length;
}
