// data.js - All data fetching functions

import { CORS_PROXIES, ALERT_KEYWORDS, SECTORS, COMMODITIES, INTEL_SOURCES, AI_FEEDS, CYBER_FEEDS, DISASTER_FEEDS, SOCIAL_FEEDS } from './constants.js';

// Simple in-memory cache for faster repeated loads
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute cache

// Rate limiting - track last request time
let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 100; // 100ms between requests

function getCached(key) {
    const item = cache.get(key);
    if (item && Date.now() - item.time < CACHE_TTL) {
        return item.data;
    }
    return null;
}

function setCache(key, data) {
    cache.set(key, { data, time: Date.now() });
}

// Sleep helper for rate limiting
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Rate-limited fetch wrapper
async function rateLimitedFetch(url, options = {}) {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < MIN_REQUEST_DELAY) {
        await sleep(MIN_REQUEST_DELAY - elapsed);
    }
    lastRequestTime = Date.now();
    return fetch(url, options);
}

// Helper for fetch with timeout - reduced default for snappier feel
export async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 4000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

// Fetch with proxy fallback
export async function fetchWithProxy(url) {
    // Check cache first
    const cached = getCached(url);
    if (cached) return cached;
    
    for (let i = 0; i < CORS_PROXIES.length; i++) {
        try {
            const proxy = CORS_PROXIES[i];
            const response = await fetchWithTimeout(proxy + encodeURIComponent(url), {
                headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
                timeout: 4000
            });
            if (response.ok) {
                const text = await response.text();
                // Check if response is valid (not an error page)
                if (text && !text.includes('<!DOCTYPE html>') && !text.includes('error code:')) {
                    setCache(url, text);  // Cache successful response
                    return text;
                }
            }
        } catch (e) {
            console.log(`Proxy ${i} failed, trying next...`);
        }
    }
    throw new Error('All proxies failed');
}

// Fetch RSS feed using rss2json API as primary method
export async function fetchFeedViaJson(source) {
    // Check cache first
    const cacheKey = 'json:' + source.url;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    
    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
        const response = await fetchWithTimeout(apiUrl, { timeout: 5000 });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.status !== 'ok' || !data.items) return [];

        const items = data.items.slice(0, 5).map(item => ({
            source: source.name,
            title: (item.title || 'No title').trim(),
            link: item.link || '',
            pubDate: item.pubDate || '',
            isAlert: hasAlertKeyword(item.title || ''),
            region: source.region || null,
            topics: source.topics || []
        }));
        
        setCache(cacheKey, items);
        return items;
    } catch (e) {
        console.log(`rss2json failed for ${source.name}: ${e.message}`);
        return null; // Signal to try XML fallback
    }
}

// Check for alert keywords
export function hasAlertKeyword(title) {
    const lower = title.toLowerCase();
    return ALERT_KEYWORDS.some(kw => lower.includes(kw));
}

// Parse RSS feed - tries rss2json API first, then falls back to XML proxy
export async function fetchFeed(source) {
    // Try rss2json API first (more reliable)
    const jsonResult = await fetchFeedViaJson(source);
    if (jsonResult !== null && jsonResult.length > 0) {
        return jsonResult;
    }

    // Fallback to XML proxy
    try {
        const text = await fetchWithProxy(source.url);
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');

        const parseError = xml.querySelector('parsererror');
        if (parseError) {
            console.error(`Parse error for ${source.name}`);
            return [];
        }

        let items = xml.querySelectorAll('item');
        if (items.length === 0) {
            items = xml.querySelectorAll('entry');
        }

        return Array.from(items).slice(0, 5).map(item => {
            let link = '';
            const linkEl = item.querySelector('link');
            if (linkEl) {
                link = linkEl.getAttribute('href') || linkEl.textContent || '';
            }
            link = link.trim();

            const title = (item.querySelector('title')?.textContent || 'No title').trim();
            const pubDate = item.querySelector('pubDate')?.textContent ||
                           item.querySelector('published')?.textContent ||
                           item.querySelector('updated')?.textContent || '';

            return {
                source: source.name,
                title,
                link,
                pubDate,
                isAlert: hasAlertKeyword(title),
                region: source.region || null,
                topics: source.topics || []
            };
        });
    } catch (error) {
        console.error(`Error fetching ${source.name}:`, error);
        return [];
    }
}

// Fetch all feeds for a category - parallel for speed
export async function fetchCategory(feeds) {
    console.log(`Fetching ${feeds.length} feeds...`);
    
    // Fetch all in parallel for speed
    const results = await Promise.all(feeds.map(fetchFeed));
    const allItems = results.flat();
    
    console.log(`Got ${allItems.length} items from ${feeds.length} feeds`);

    allItems.sort((a, b) => {
        // Alerts first, then by date
        if (a.isAlert && !b.isAlert) return -1;
        if (!a.isAlert && b.isAlert) return 1;
        const dateA = new Date(a.pubDate);
        const dateB = new Date(b.pubDate);
        return dateB - dateA;
    });

    // Return more items now that we have many feeds
    return allItems.slice(0, 50);
}

// Fetch stock quote from Yahoo Finance
export async function fetchQuote(symbol) {
    try {
        const text = await fetchWithProxy(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
        const data = JSON.parse(text);
        if (data.chart?.result?.[0]) {
            const meta = data.chart.result[0].meta;
            const change = ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100;
            return { price: meta.regularMarketPrice, change };
        }
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
    }
    return null;
}

// Fetch market data (stocks + crypto)
export async function fetchMarkets() {
    const markets = [];

    const symbols = [
        { symbol: '^GSPC', name: 'S&P 500', display: 'SPX' },
        { symbol: '^DJI', name: 'Dow Jones', display: 'DJI' },
        { symbol: '^IXIC', name: 'NASDAQ', display: 'NDX' },
        { symbol: 'AAPL', name: 'Apple', display: 'AAPL' },
        { symbol: 'MSFT', name: 'Microsoft', display: 'MSFT' },
        { symbol: 'NVDA', name: 'NVIDIA', display: 'NVDA' },
        { symbol: 'GOOGL', name: 'Alphabet', display: 'GOOGL' },
        { symbol: 'AMZN', name: 'Amazon', display: 'AMZN' },
        { symbol: 'META', name: 'Meta', display: 'META' },
        { symbol: 'BRK-B', name: 'Berkshire', display: 'BRK.B' },
        { symbol: 'TSM', name: 'TSMC', display: 'TSM' },
        { symbol: 'LLY', name: 'Eli Lilly', display: 'LLY' },
        { symbol: 'TSLA', name: 'Tesla', display: 'TSLA' },
        { symbol: 'AVGO', name: 'Broadcom', display: 'AVGO' },
        { symbol: 'WMT', name: 'Walmart', display: 'WMT' },
        { symbol: 'JPM', name: 'JPMorgan', display: 'JPM' },
        { symbol: 'V', name: 'Visa', display: 'V' },
        { symbol: 'UNH', name: 'UnitedHealth', display: 'UNH' },
        { symbol: 'NVO', name: 'Novo Nordisk', display: 'NVO' },
        { symbol: 'XOM', name: 'Exxon', display: 'XOM' },
        { symbol: 'MA', name: 'Mastercard', display: 'MA' },
        { symbol: 'ORCL', name: 'Oracle', display: 'ORCL' },
        { symbol: 'PG', name: 'P&G', display: 'PG' },
        { symbol: 'COST', name: 'Costco', display: 'COST' },
        { symbol: 'JNJ', name: 'J&J', display: 'JNJ' },
        { symbol: 'HD', name: 'Home Depot', display: 'HD' },
        { symbol: 'NFLX', name: 'Netflix', display: 'NFLX' },
        { symbol: 'BAC', name: 'BofA', display: 'BAC' }
    ];

    const fetchStock = async (s) => {
        const quote = await fetchQuote(s.symbol);
        if (quote) {
            return { name: s.name, symbol: s.display, price: quote.price, change: quote.change };
        }
        return null;
    };

    const stockResults = await Promise.all(symbols.map(fetchStock));
    stockResults.forEach(r => { if (r) markets.push(r); });

    // Crypto
    try {
        const cryptoResponse = await fetchWithTimeout('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true', { timeout: 5000 });
        const crypto = await cryptoResponse.json();

        if (crypto.bitcoin) markets.push({ name: 'Bitcoin', symbol: 'BTC', price: crypto.bitcoin.usd, change: crypto.bitcoin.usd_24h_change });
        if (crypto.ethereum) markets.push({ name: 'Ethereum', symbol: 'ETH', price: crypto.ethereum.usd, change: crypto.ethereum.usd_24h_change });
        if (crypto.solana) markets.push({ name: 'Solana', symbol: 'SOL', price: crypto.solana.usd, change: crypto.solana.usd_24h_change });
    } catch (error) {
        console.error('Error fetching crypto:', error);
    }

    return markets;
}

// Fetch sector heatmap data
export async function fetchSectors() {
    const results = await Promise.all(SECTORS.map(async (s) => {
        const quote = await fetchQuote(s.symbol);
        if (quote) {
            return { name: s.name, symbol: s.symbol, change: quote.change };
        }
        return { name: s.name, symbol: s.symbol, change: 0 };
    }));
    return results;
}

// Fetch commodities and VIX
export async function fetchCommodities() {
    const results = await Promise.all(COMMODITIES.map(async (c) => {
        const quote = await fetchQuote(c.symbol);
        if (quote) {
            return { name: c.name, symbol: c.display, price: quote.price, change: quote.change };
        }
        return null; // Filtered out later
    }));
    return results.filter(r => r !== null);
}

// Fetch flight data from OpenSky Network
export async function fetchFlightData(bounds = null) {
    try {
        let url = 'https://opensky-network.org/api/states/all';
        if (bounds) {
            url += `?lamin=${bounds.south}&lomin=${bounds.west}&lamax=${bounds.north}&lomax=${bounds.east}`;
        }

        const response = await fetchWithTimeout(url, { timeout: 8000 });
        if (!response.ok) throw new Error('Flight API error');

        const data = await response.json();
        if (!data.states) return [];

        return data.states.slice(0, 100).map(state => ({
            icao24: state[0],
            callsign: (state[1] || '').trim(),
            country: state[2],
            lat: state[6],
            lon: state[5],
            altitude: state[7],
            heading: state[10],
            velocity: state[9],
            onGround: state[8]
        })).filter(f => f.lat && f.lon && !f.onGround);
    } catch (error) {
        console.error('Error fetching flight data:', error);
        return [];
    }
}

// Fetch congressional trades
export async function fetchCongressTrades() {
    // Uses proxy to fetch from House Stock Watcher or similar
    try {
        const response = await fetchWithProxy('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json');
        const data = JSON.parse(response);

        // Get last 20 trades
        return data.slice(-20).reverse().map(t => ({
            name: t.representative,
            party: t.party === 'Democrat' ? 'D' : 'R',
            ticker: t.ticker,
            action: t.type.includes('Sale') ? 'SELL' : 'BUY',
            amount: t.amount,
            date: t.transaction_date
        }));
    } catch (error) {
        console.error('Error fetching congress trades:', error);
        return [];
    }
}

// Fetch whale transactions (crypto) from Whale Alert public feed
export async function fetchWhaleTransactions() {
    try {
        // Use blockchain.info for recent large BTC transactions
        const response = await fetchWithTimeout(
            'https://blockchain.info/unconfirmed-transactions?format=json',
            { timeout: 8000 }
        );
        
        if (!response.ok) throw new Error('Blockchain API error');
        
        const data = await response.json();
        
        // Filter for large transactions (> 10 BTC)
        const largeTxs = data.txs
            .filter(tx => {
                const totalOut = tx.out.reduce((sum, o) => sum + o.value, 0);
                return totalOut > 1000000000; // > 10 BTC in satoshis
            })
            .slice(0, 10)
            .map(tx => {
                const totalBTC = tx.out.reduce((sum, o) => sum + o.value, 0) / 100000000;
                return {
                    coin: 'BTC',
                    amount: totalBTC,
                    usd: totalBTC * 45000, // Approximate USD
                    hash: tx.hash.substring(0, 12) + '...',
                    fullHash: tx.hash, // Full hash for blockchain explorer link
                    time: new Date(tx.time * 1000)
                };
            });
        
        return largeTxs;
    } catch (error) {
        console.error('Error fetching whale transactions:', error);
        return [];
    }
}

// Fetch government contracts from USASpending.gov
export async function fetchGovContracts() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const response = await fetchWithTimeout(
            `https://api.usaspending.gov/api/v2/search/spending_by_award/?limit=15`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filters: {
                        time_period: [{ start_date: lastWeek, end_date: today }],
                        award_type_codes: ['A', 'B', 'C', 'D']
                    },
                    fields: ['Award ID', 'Recipient Name', 'Award Amount', 'Awarding Agency', 'Description'],
                    sort: 'Award Amount',
                    order: 'desc',
                    limit: 15
                }),
                timeout: 10000
            }
        );
        
        if (!response.ok) throw new Error('USASpending API error');
        
        const data = await response.json();
        
        return (data.results || []).map(c => ({
            agency: c['Awarding Agency'] || 'Federal Agency',
            vendor: c['Recipient Name'] || 'Unknown',
            amount: c['Award Amount'] || 0,
            description: c['Description'] || 'Government contract'
        }));
    } catch (error) {
        console.error('Error fetching gov contracts:', error);
        return [];
    }
}

// Fetch AI news from major AI companies
export async function fetchAINews() {
    const results = await Promise.all(AI_FEEDS.map(async (source) => {
        // Try rss2json API first
        try {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const response = await fetchWithTimeout(apiUrl, { timeout: 5000 });
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok' && data.items) {
                    return data.items.slice(0, 3).map(item => ({
                        source: source.name,
                        title: (item.title || 'No title').trim(),
                        link: item.link || '',
                        date: item.pubDate || ''
                    }));
                }
            }
        } catch (e) {
            // Fall through to XML proxy
        }

        // Fallback to XML proxy
        try {
            const text = await fetchWithProxy(source.url);
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');

            let items = xml.querySelectorAll('item');
            if (items.length === 0) items = xml.querySelectorAll('entry');

            return Array.from(items).slice(0, 3).map(item => {
                let link = '';
                const linkEl = item.querySelector('link');
                if (linkEl) link = linkEl.getAttribute('href') || linkEl.textContent || '';

                return {
                    source: source.name,
                    title: item.querySelector('title')?.textContent?.trim() || 'No title',
                    link: link.trim(),
                    date: item.querySelector('pubDate')?.textContent ||
                          item.querySelector('published')?.textContent || ''
                };
            });
        } catch (e) {
            console.log(`Failed to fetch ${source.name}`);
            return [];
        }
    }));

    return results.flat().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15);
}

// Fetch cyber threat intelligence
export async function fetchCyberThreats() {
    const results = await Promise.all(CYBER_FEEDS.map(async (source) => {
        try {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const response = await fetchWithTimeout(apiUrl, { timeout: 5000 });
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok' && data.items) {
                    return data.items.slice(0, 3).map(item => ({
                        source: source.name,
                        title: (item.title || 'No title').trim(),
                        link: item.link || '',
                        pubDate: item.pubDate || '',
                        isCritical: /critical|zero-day|ransomware|breach|attack|exploit/i.test(item.title)
                    }));
                }
            }
        } catch (e) {
            console.log(`Failed to fetch ${source.name}`);
        }
        return [];
    }));

    return results.flat().sort((a, b) => {
        // Critical alerts first
        if (a.isCritical && !b.isCritical) return -1;
        if (!a.isCritical && b.isCritical) return 1;
        return new Date(b.pubDate) - new Date(a.pubDate);
    }).slice(0, 20);
}

// Fetch natural disaster alerts
export async function fetchDisasters() {
    const results = await Promise.all(DISASTER_FEEDS.map(async (source) => {
        try {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const response = await fetchWithTimeout(apiUrl, { timeout: 5000 });
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok' && data.items) {
                    return data.items.slice(0, 5).map(item => ({
                        source: source.name,
                        title: (item.title || 'No title').trim(),
                        link: item.link || '',
                        pubDate: item.pubDate || '',
                        isUrgent: /magnitude [5-9]|major|severe|warning|emergency|tsunami|hurricane|typhoon/i.test(item.title)
                    }));
                }
            }
        } catch (e) {
            console.log(`Failed to fetch ${source.name}`);
        }
        return [];
    }));

    return results.flat().sort((a, b) => {
        // Urgent alerts first
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return new Date(b.pubDate) - new Date(a.pubDate);
    }).slice(0, 15);
}

// Fetch social media trends
export async function fetchSocialTrends() {
    const results = await Promise.all(SOCIAL_FEEDS.map(async (source) => {
        try {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const response = await fetchWithTimeout(apiUrl, { timeout: 5000 });
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok' && data.items) {
                    return data.items.slice(0, 5).map(item => ({
                        source: source.name,
                        title: (item.title || 'No title').trim(),
                        link: item.link || '',
                        pubDate: item.pubDate || ''
                    }));
                }
            }
        } catch (e) {
            console.log(`Failed to fetch ${source.name}`);
        }
        return [];
    }));

    return results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 20);
}

// Fetch Fed balance sheet from FRED
export async function fetchFedBalance() {
    try {
        const text = await fetchWithProxy('https://api.stlouisfed.org/fred/series/observations?series_id=WALCL&sort_order=desc&limit=10&file_type=json&api_key=DEMO');
        const data = JSON.parse(text);

        if (data.observations && data.observations.length >= 2) {
            const latest = parseFloat(data.observations[0].value);
            const previous = parseFloat(data.observations[1].value);
            const change = latest - previous;
            const changePercent = (change / previous) * 100;

            return {
                value: latest / 1000000,
                change: change / 1000000,
                changePercent,
                date: data.observations[0].date,
                percentOfMax: (latest / 9000000) * 100
            };
        }
    } catch (error) {
        console.error('Error fetching Fed balance:', error);
    }

    return {
        value: 6.8,
        change: 0,
        changePercent: 0,
        date: new Date().toISOString().split('T')[0],
        percentOfMax: 75
    };
}

// Fetch Polymarket data from Gamma API
export async function fetchPolymarket() {
    try {
        // Use Polymarket's public Gamma API for popular markets
        const response = await fetchWithTimeout(
            'https://gamma-api.polymarket.com/markets?closed=false&order=volume24hr&ascending=false&limit=15',
            { timeout: 8000 }
        );
        
        if (!response.ok) throw new Error('Polymarket API error');
        
        const markets = await response.json();
        
        return markets.filter(m => m.outcomePrices).map(market => {
            const prices = JSON.parse(market.outcomePrices);
            const yesPrice = parseFloat(prices[0]) * 100;
            
            return {
                question: market.question || 'Unknown',
                yes: Math.round(yesPrice),
                no: Math.round(100 - yesPrice),
                volume: market.volume24hr || market.volume || 0,
                id: market.id
            };
        }).slice(0, 12);
    } catch (error) {
        console.error('Error fetching Polymarket:', error);
        // Return sample data as fallback
        return [
            { question: 'Market data temporarily unavailable', yes: 50, no: 50, volume: 0 }
        ];
    }
}

// Fetch earthquake data from USGS
export async function fetchEarthquakes() {
    try {
        const response = await fetchWithTimeout('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson', { timeout: 8000 });
        const data = await response.json();

        return data.features.map(f => ({
            id: f.id,
            magnitude: f.properties.mag,
            place: f.properties.place,
            time: new Date(f.properties.time),
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
            depth: f.geometry.coordinates[2]
        }));
    } catch (error) {
        console.error('Error fetching earthquakes:', error);
        return [];
    }
}

// Fetch layoffs data from news sources
export async function fetchLayoffs() {
    try {
        // Search tech layoff news from multiple sources
        const sources = [
            { name: 'Tech Layoffs', url: 'https://hnrss.org/newest?q=layoff+OR+layoffs' },
            { name: 'Job Cuts', url: 'https://news.google.com/rss/search?q=tech+layoffs&hl=en-US&gl=US&ceid=US:en' }
        ];
        
        const results = await Promise.all(sources.map(async (source) => {
            try {
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
                const response = await fetchWithTimeout(apiUrl, { timeout: 5000 });
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'ok' && data.items) {
                        return data.items.slice(0, 5).map(item => {
                            // Extract company name from title
                            const title = item.title || '';
                            const companyMatch = title.match(/^([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)?)/);
                            const countMatch = title.match(/(\d+(?:,\d+)?)\s*(?:employees?|workers?|jobs?|staff)/i);
                            
                            return {
                                company: companyMatch ? companyMatch[1] : 'Tech Company',
                                title: title,
                                count: countMatch ? countMatch[1].replace(',', '') : null,
                                date: item.pubDate || '',
                                link: item.link || ''
                            };
                        });
                    }
                }
            } catch (e) {
                console.log(`Failed to fetch layoff news from ${source.name}`);
            }
            return [];
        }));
        
        const allLayoffs = results.flat();
        return allLayoffs.slice(0, 10);
    } catch (error) {
        console.error('Error fetching layoffs:', error);
        return [];
    }
}

// Fetch situation-specific news using Google News RSS
export async function fetchSituationNews(keywords, limit = 8) {
    try {
        const searchQuery = encodeURIComponent(keywords);
        const url = `https://news.google.com/rss/search?q=${searchQuery}&hl=en-US&gl=US&ceid=US:en`;
        
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
        const response = await fetchWithTimeout(apiUrl, { timeout: 8000 });
        
        if (!response.ok) throw new Error('Google News API error');
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.items) {
            return data.items.slice(0, limit).map(item => ({
                source: extractSourceFromTitle(item.title) || 'News',
                title: cleanGoogleNewsTitle(item.title),
                link: item.link || '',
                pubDate: item.pubDate || '',
                isAlert: hasAlertKeyword(item.title || '')
            }));
        }
        
        return [];
    } catch (error) {
        console.error('Error fetching situation news:', error);
        return [];
    }
}

// Helper to extract source from Google News title format "Title - Source"
function extractSourceFromTitle(title) {
    const match = title?.match(/ - ([^-]+)$/);
    return match ? match[1].trim() : null;
}

// Helper to clean Google News title by removing source suffix
function cleanGoogleNewsTitle(title) {
    return title?.replace(/ - [^-]+$/, '').trim() || title;
}

// Fetch Intel feed (combines multiple intel sources)
export async function fetchIntelFeed() {
    const results = await Promise.all(INTEL_SOURCES.map(fetchFeed));
    const items = results.flat();

    items.sort((a, b) => {
        if (a.isAlert && !b.isAlert) return -1;
        if (!a.isAlert && b.isAlert) return 1;
        return new Date(b.pubDate) - new Date(a.pubDate);
    });

    return items.slice(0, 100); // Increased for better regional coverage
}
