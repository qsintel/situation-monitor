// constants.js - All data arrays and configuration objects

// Panel configuration with display names
export const PANELS = {
    map: { name: 'Global Map', priority: 1 },
    politics: { name: 'World / Geopolitical', priority: 1 },
    tech: { name: 'Technology / AI', priority: 1 },
    finance: { name: 'Financial', priority: 1 },
    gov: { name: 'Government / Policy', priority: 2 },
    heatmap: { name: 'Sector Heatmap', priority: 1 },
    markets: { name: 'Markets', priority: 1 },
    monitors: { name: 'My Monitors', priority: 1 },
    commodities: { name: 'Commodities / VIX', priority: 2 },
    polymarket: { name: 'Polymarket', priority: 2 },
    congress: { name: 'Congress Trades', priority: 3 },
    whales: { name: 'Whale Watch', priority: 3 },
    mainchar: { name: 'Main Character', priority: 2 },
    printer: { name: 'Money Printer', priority: 2 },
    contracts: { name: 'Gov Contracts', priority: 3 },
    ai: { name: 'AI Arms Race', priority: 3 },
    layoffs: { name: 'Layoffs Tracker', priority: 3 },
    venezuela: { name: 'Venezuela Situation', priority: 2 },
    greenland: { name: 'Greenland Situation', priority: 2 },
    tbpn: { name: 'TBPN Live', priority: 1 },
    intel: { name: 'Intel Feed', priority: 2 },
    correlation: { name: 'Correlation Engine', priority: 1 },
    narrative: { name: 'Narrative Tracker', priority: 1 },
    disasters: { name: 'Natural Disasters', priority: 2 },
    cyber: { name: 'Cyber Threats', priority: 2 },
    social: { name: 'Social Trends', priority: 3 }
};

export const NON_DRAGGABLE_PANELS = ['map', 'tbpn'];

// Live news streams - prefer stable channelId live embeds when possible
export const NEWS_STREAMS = [
    // Some outlets frequently return "Video unavailable" when embedded (geo/rights restrictions
    // or not actually live 24/7). Keep them available, but default to opening externally.
    { name: 'Sky News', type: 'youtube-channel', channelUrl: 'https://www.youtube.com/channel/UCoMdktPbSTixAyNGwb-UYkQ/live' },
    { name: 'Al Jazeera', type: 'youtube-live-channel', channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg' },
    { name: 'France 24', type: 'youtube-live-channel', channelId: 'UCQfwfsi5VrQ8yKZ-UWmAEFg' },
    { name: 'DW News', type: 'youtube-live-channel', channelId: 'UCknLrEdhRCp1aegoMqRaCZg' },
    { name: 'Euronews', type: 'youtube-channel', channelUrl: 'https://www.youtube.com/channel/UCSrZ3UV4jOidv8ppoVuvW9Q/live' },
    { name: 'NBC News NOW', type: 'youtube-live-channel', channelId: 'UCeY0bbntWzzVIaj2z3QigXg' },
    { name: 'ABC News', type: 'youtube-channel', channelUrl: 'https://www.youtube.com/channel/UCBi2mrWuNuyYy4gbM6fU18Q/live' },
    { name: 'CBS News', type: 'youtube-live-channel', channelId: 'UC8p1vwvWtl6T73JiExfWs1g' },
    { name: 'Reuters', type: 'youtube-live-channel', channelId: 'UChqUTb7kYRX8-EiaN3XFrSQ' },
    { name: 'AP News', type: 'youtube-channel', channelUrl: 'https://www.youtube.com/channel/UC52X5wxOL_s5yw0dQk7NtgA/live' },
    { name: 'BBC News', type: 'youtube-channel', channelUrl: 'https://www.youtube.com/channel/UC16niRr50-MSBwiO3YDb3RA/live' }
];

// Map zoom settings
export const MAP_ZOOM_MIN = 1;
export const MAP_ZOOM_MAX = 4;
export const MAP_ZOOM_STEP = 0.5;

// CORS proxies for fetching external data
export const CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url='
];

// Geopolitical alert keywords
export const ALERT_KEYWORDS = [
    'war', 'invasion', 'military', 'nuclear', 'sanctions', 'missile',
    'attack', 'troops', 'conflict', 'strike', 'bomb', 'casualties',
    'ceasefire', 'treaty', 'nato', 'coup', 'martial law', 'emergency',
    'assassination', 'terrorist', 'hostage', 'evacuation'
];

// RSS Feed sources
export const FEEDS = {
    politics: [
        // Global / Major Wire Services
        { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', region: 'global' },
        { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml', region: 'us' },
        { name: 'Guardian World', url: 'https://www.theguardian.com/world/rss', region: 'global' },
        { name: 'Reuters World', url: 'https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best', region: 'global' },
        { name: 'AP News', url: 'https://rsshub.app/apnews/topics/world-news', region: 'global' },
        { name: 'AFP', url: 'https://www.afp.com/en/rss-feeds', region: 'global' },
        
        // === EUROPE ===
        // Nordic Countries
        { name: 'NRK (Norway)', url: 'https://www.nrk.no/toppsaker.rss', region: 'europe', topics: ['norway'] },
        { name: 'SVT (Sweden)', url: 'https://www.svt.se/nyheter/rss.xml', region: 'europe', topics: ['sweden'] },
        { name: 'DR (Denmark)', url: 'https://www.dr.dk/nyheder/service/feeds/allenyheder', region: 'europe', topics: ['denmark'] },
        { name: 'YLE (Finland)', url: 'https://feeds.yle.fi/uutiset/v1/recent.rss?publisherIds=YLE_UUTISET', region: 'europe', topics: ['finland'] },
        { name: 'Icelandic Review', url: 'https://www.icelandreview.com/feed/', region: 'europe', topics: ['iceland'] },
        
        // Baltic States
        { name: 'ERR (Estonia)', url: 'https://news.err.ee/rss', region: 'europe', topics: ['estonia', 'tallinn'] },
        { name: 'LSM (Latvia)', url: 'https://eng.lsm.lv/rss/', region: 'europe', topics: ['latvia', 'riga'] },
        { name: 'LRT (Lithuania)', url: 'https://www.lrt.lt/rss', region: 'europe', topics: ['lithuania', 'vilnius'] },
        { name: 'Delfi Baltic', url: 'https://www.delfi.ee/rss', region: 'europe', topics: ['estonia', 'baltic'] },
        
        // Western Europe
        { name: 'DW News', url: 'https://rss.dw.com/rdf/rss-en-all', region: 'europe', topics: ['germany'] },
        { name: 'France 24', url: 'https://www.france24.com/en/rss', region: 'europe', topics: ['france'] },
        { name: 'The Local DE', url: 'https://www.thelocal.de/feed/', region: 'europe', topics: ['germany'] },
        { name: 'The Local FR', url: 'https://www.thelocal.fr/feed/', region: 'europe', topics: ['france'] },
        { name: 'The Local ES', url: 'https://www.thelocal.es/feed/', region: 'europe', topics: ['spain'] },
        { name: 'The Local IT', url: 'https://www.thelocal.it/feed/', region: 'europe', topics: ['italy'] },
        { name: 'The Local AT', url: 'https://www.thelocal.at/feed/', region: 'europe', topics: ['austria'] },
        { name: 'The Local CH', url: 'https://www.thelocal.ch/feed/', region: 'europe', topics: ['switzerland'] },
        { name: 'Dutch News', url: 'https://www.dutchnews.nl/feed/', region: 'europe', topics: ['netherlands'] },
        { name: 'Irish Times', url: 'https://www.irishtimes.com/cmlink/news-1.1319192', region: 'europe', topics: ['ireland'] },
        { name: 'RTE Ireland', url: 'https://www.rte.ie/news/rss/news-headlines.xml', region: 'europe', topics: ['ireland'] },
        
        // Central & Eastern Europe
        { name: 'Poland In', url: 'https://polandin.com/rss', region: 'europe', topics: ['poland'] },
        { name: 'TVP World', url: 'https://tvpworld.com/rss/news.xml', region: 'europe', topics: ['poland'] },
        { name: 'Hungary Today', url: 'https://hungarytoday.hu/feed/', region: 'europe', topics: ['hungary'] },
        { name: 'Prague Morning', url: 'https://praguemorning.cz/feed/', region: 'europe', topics: ['czechia'] },
        { name: 'Romania Insider', url: 'https://www.romania-insider.com/feed', region: 'europe', topics: ['romania'] },
        { name: 'Bulgaria News', url: 'https://bnr.bg/en/rss', region: 'europe', topics: ['bulgaria'] },
        
        // Balkans
        { name: 'N1 Balkans', url: 'https://n1info.com/feed/', region: 'europe', topics: ['balkans', 'serbia'] },
        { name: 'Balkan Insight', url: 'https://balkaninsight.com/feed/', region: 'europe', topics: ['balkans'] },
        
        // Ukraine & Eastern
        { name: 'Kyiv Independent', url: 'https://kyivindependent.com/feed/', region: 'europe', topics: ['ukraine'] },
        { name: 'Ukrainska Pravda', url: 'https://www.pravda.com.ua/rss/', region: 'europe', topics: ['ukraine'] },
        { name: 'Moldova.org', url: 'https://www.moldova.org/en/feed/', region: 'europe', topics: ['moldova'] },
        { name: 'Civil Georgia', url: 'https://civil.ge/feed', region: 'europe', topics: ['georgia'] },
        { name: 'JAM News', url: 'https://jam-news.net/feed/', region: 'europe', topics: ['caucasus', 'georgia', 'armenia', 'azerbaijan'] },
        
        // === RUSSIA & CENTRAL ASIA ===
        { name: 'Moscow Times', url: 'https://www.themoscowtimes.com/rss/news', region: 'russia', topics: ['russia'] },
        { name: 'Meduza', url: 'https://meduza.io/rss/en/all', region: 'russia', topics: ['russia'] },
        { name: 'TASS', url: 'https://tass.com/rss/v2.xml', region: 'russia', topics: ['russia'] },
        { name: 'RFE/RL', url: 'https://www.rferl.org/api/z-pqpiev-qpp', region: 'russia', topics: ['russia', 'eurasia'] },
        { name: 'Eurasianet', url: 'https://eurasianet.org/feed', region: 'russia', topics: ['central-asia'] },
        
        // === MIDDLE EAST ===
        { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', region: 'mideast', topics: ['middle-east'] },
        { name: 'Middle East Eye', url: 'https://www.middleeasteye.net/rss', region: 'mideast', topics: ['middle-east'] },
        { name: 'Times of Israel', url: 'https://www.timesofisrael.com/feed/', region: 'mideast', topics: ['israel'] },
        { name: 'Jerusalem Post', url: 'https://www.jpost.com/rss/rssfeedsfrontpage.aspx', region: 'mideast', topics: ['israel'] },
        { name: 'Iran Intl', url: 'https://www.iranintl.com/en/rss', region: 'mideast', topics: ['iran'] },
        { name: 'Al-Monitor', url: 'https://www.al-monitor.com/rss', region: 'mideast', topics: ['middle-east'] },
        { name: 'Arab News', url: 'https://www.arabnews.com/rss.xml', region: 'mideast', topics: ['saudi', 'gulf'] },
        { name: 'Gulf News', url: 'https://gulfnews.com/rss', region: 'mideast', topics: ['uae', 'gulf'] },
        { name: 'Daily Star Lebanon', url: 'https://www.dailystar.com.lb/RSS.aspx', region: 'mideast', topics: ['lebanon'] },
        
        // === ASIA-PACIFIC ===
        { name: 'SCMP', url: 'https://www.scmp.com/rss/91/feed', region: 'asia', topics: ['china', 'hong-kong'] },
        { name: 'Nikkei Asia', url: 'https://asia.nikkei.com/rss/feed/nar', region: 'asia', topics: ['japan', 'asia'] },
        { name: 'Japan Times', url: 'https://www.japantimes.co.jp/feed/', region: 'asia', topics: ['japan'] },
        { name: 'Korea Herald', url: 'https://www.koreaherald.com/rss', region: 'asia', topics: ['korea'] },
        { name: 'Korea Times', url: 'https://www.koreatimes.co.kr/www/rss/rss.xml', region: 'asia', topics: ['korea'] },
        { name: 'Taipei Times', url: 'https://www.taipeitimes.com/xml/index.rss', region: 'asia', topics: ['taiwan'] },
        { name: 'Focus Taiwan', url: 'https://focustaiwan.tw/rss', region: 'asia', topics: ['taiwan'] },
        { name: 'CNA Taiwan', url: 'https://www.cna.com.tw/rss/firstnews.xml', region: 'asia', topics: ['taiwan'] },
        { name: 'Straits Times', url: 'https://www.straitstimes.com/news/world/rss.xml', region: 'asia', topics: ['singapore', 'asia'] },
        { name: 'CNA Singapore', url: 'https://www.channelnewsasia.com/rss/latest.xml', region: 'asia', topics: ['singapore', 'asia'] },
        { name: 'VN Express', url: 'https://e.vnexpress.net/rss/news.rss', region: 'asia', topics: ['vietnam'] },
        { name: 'Bangkok Post', url: 'https://www.bangkokpost.com/rss/data/headlines.xml', region: 'asia', topics: ['thailand'] },
        { name: 'Rappler', url: 'https://www.rappler.com/feed/', region: 'asia', topics: ['philippines'] },
        { name: 'Jakarta Post', url: 'https://www.thejakartapost.com/rss', region: 'asia', topics: ['indonesia'] },
        { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/rss/topnews/rssfeed.xml', region: 'asia', topics: ['india'] },
        { name: 'NDTV India', url: 'https://feeds.feedburner.com/NdtvNews-TopStories', region: 'asia', topics: ['india'] },
        { name: 'Dawn Pakistan', url: 'https://www.dawn.com/feeds/home', region: 'asia', topics: ['pakistan'] },
        { name: 'Tolo News', url: 'https://tolonews.com/rss', region: 'asia', topics: ['afghanistan'] },
        
        // === AFRICA ===
        { name: 'All Africa', url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', region: 'africa', topics: ['africa'] },
        { name: 'News24 SA', url: 'https://feeds.news24.com/articles/news24/TopStories/rss', region: 'africa', topics: ['south-africa'] },
        { name: 'Daily Maverick', url: 'https://www.dailymaverick.co.za/feed/', region: 'africa', topics: ['south-africa'] },
        { name: 'Nation Kenya', url: 'https://nation.africa/rss', region: 'africa', topics: ['kenya'] },
        { name: 'Punch Nigeria', url: 'https://punchng.com/feed/', region: 'africa', topics: ['nigeria'] },
        { name: 'Egypt Independent', url: 'https://www.egyptindependent.com/feed/', region: 'africa', topics: ['egypt'] },
        
        // === AMERICAS ===
        { name: 'Globe & Mail', url: 'https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/canada/', region: 'us', topics: ['canada'] },
        { name: 'CBC Canada', url: 'https://www.cbc.ca/cmlink/rss-topstories', region: 'us', topics: ['canada'] },
        { name: 'El Universal MX', url: 'https://www.eluniversal.com.mx/rss.xml', region: 'us', topics: ['mexico'] },
        { name: 'Buenos Aires Herald', url: 'https://www.batimes.com.ar/feed/', region: 'us', topics: ['argentina'] },
        { name: 'Brazil Report', url: 'https://brazilian.report/feed/', region: 'us', topics: ['brazil'] },
        { name: 'Merco Press', url: 'https://en.mercopress.com/rss', region: 'us', topics: ['latin-america'] },
        
        // === OCEANIA ===
        { name: 'ABC Australia', url: 'https://www.abc.net.au/news/feed/51120/rss.xml', region: 'asia', topics: ['australia'] },
        { name: 'NZ Herald', url: 'https://www.nzherald.co.nz/arc/outboundfeeds/rss/', region: 'asia', topics: ['new-zealand'] },
        { name: 'RNZ New Zealand', url: 'https://www.rnz.co.nz/rss/national.xml', region: 'asia', topics: ['new-zealand'] }
    ],
    tech: [
        { name: 'Hacker News', url: 'https://hnrss.org/frontpage' },
        { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
        { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
        { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' },
        { name: 'ArXiv AI', url: 'https://rss.arxiv.org/rss/cs.AI' },
        { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml' },
        { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
        { name: 'Wired', url: 'https://www.wired.com/feed/rss' }
    ],
    finance: [
        { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
        { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories' },
        { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex' },
        { name: 'Reuters Business', url: 'https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best' },
        { name: 'FT', url: 'https://www.ft.com/rss/home' },
        { name: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss' },
        { name: 'WSJ Markets', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml' }
    ],
    gov: [
        { name: 'White House', url: 'https://www.whitehouse.gov/feed/' },
        { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
        { name: 'SEC Announcements', url: 'https://www.sec.gov/news/pressreleases.rss' },
        { name: 'Treasury', url: 'https://home.treasury.gov/system/files/136/treasury-rss.xml' },
        { name: 'State Dept', url: 'https://www.state.gov/rss-feed/press-releases/feed/' },
        { name: 'EU Newsroom', url: 'https://ec.europa.eu/newsroom/api/rss', region: 'europe', topics: ['eu'] },
        { name: 'NATO News', url: 'https://www.nato.int/cps/en/natohq/news.xml', region: 'europe', topics: ['nato'] }
    ]
};

// Intelligence-focused news sources
export const INTEL_SOURCES = [
    { name: 'CSIS', url: 'https://www.csis.org/analysis/feed', type: 'think-tank', topics: ['defense', 'geopolitics'] },
    { name: 'Brookings', url: 'https://www.brookings.edu/feed/', type: 'think-tank', topics: ['policy', 'geopolitics'] },
    { name: 'CFR', url: 'https://www.cfr.org/rss.xml', type: 'think-tank', topics: ['foreign-policy'] },
    { name: 'Defense One', url: 'https://www.defenseone.com/rss/all/', type: 'defense', topics: ['military', 'defense'] },
    { name: 'War on Rocks', url: 'https://warontherocks.com/feed/', type: 'defense', topics: ['military', 'strategy'] },
    { name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/', type: 'defense', topics: ['military', 'defense'] },
    { name: 'The Drive War Zone', url: 'https://www.thedrive.com/the-war-zone/feed', type: 'defense', topics: ['military'] },
    { name: 'The Diplomat', url: 'https://thediplomat.com/feed/', type: 'regional', topics: ['asia-pacific'], region: 'APAC' },
    { name: 'Al-Monitor', url: 'https://www.al-monitor.com/rss', type: 'regional', topics: ['middle-east'], region: 'MENA' },
    { name: 'Bellingcat', url: 'https://www.bellingcat.com/feed/', type: 'osint', topics: ['investigation', 'osint'] },
    { name: 'DoD News', url: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=945', type: 'govt', topics: ['military', 'official'] },
    { name: 'State Dept', url: 'https://www.state.gov/rss-feed/press-releases/feed/', type: 'govt', topics: ['diplomacy', 'official'] },
    { name: 'CISA Alerts', url: 'https://www.cisa.gov/uscert/ncas/alerts.xml', type: 'cyber', topics: ['cyber', 'security'] },
    { name: 'Krebs Security', url: 'https://krebsonsecurity.com/feed/', type: 'cyber', topics: ['cyber', 'security'] }
];

// Region detection keywords for tagging
export const REGION_KEYWORDS = {
    'EUROPE': ['nato', 'eu', 'european', 'ukraine', 'russia', 'germany', 'france', 'uk', 'britain', 'poland'],
    'MENA': ['iran', 'israel', 'saudi', 'syria', 'iraq', 'gaza', 'lebanon', 'yemen', 'houthi', 'middle east'],
    'APAC': ['china', 'taiwan', 'japan', 'korea', 'indo-pacific', 'south china sea', 'asean', 'philippines'],
    'AMERICAS': ['us', 'america', 'canada', 'mexico', 'brazil', 'venezuela', 'latin'],
    'AFRICA': ['africa', 'sahel', 'niger', 'sudan', 'ethiopia', 'somalia']
};

// Topic detection keywords
export const TOPIC_KEYWORDS = {
    'CYBER': ['cyber', 'hack', 'ransomware', 'malware', 'breach', 'apt', 'vulnerability'],
    'NUCLEAR': ['nuclear', 'icbm', 'warhead', 'nonproliferation', 'uranium', 'plutonium'],
    'CONFLICT': ['war', 'military', 'troops', 'invasion', 'strike', 'missile', 'combat', 'offensive'],
    'INTEL': ['intelligence', 'espionage', 'spy', 'cia', 'mossad', 'fsb', 'covert'],
    'DEFENSE': ['pentagon', 'dod', 'defense', 'military', 'army', 'navy', 'air force'],
    'DIPLO': ['diplomat', 'embassy', 'treaty', 'sanctions', 'talks', 'summit', 'bilateral']
};

// Sector ETFs for heatmap
export const SECTORS = [
    { symbol: 'XLK', name: 'Tech' },
    { symbol: 'XLF', name: 'Finance' },
    { symbol: 'XLE', name: 'Energy' },
    { symbol: 'XLV', name: 'Health' },
    { symbol: 'XLY', name: 'Consumer' },
    { symbol: 'XLI', name: 'Industrial' },
    { symbol: 'XLP', name: 'Staples' },
    { symbol: 'XLU', name: 'Utilities' },
    { symbol: 'XLB', name: 'Materials' },
    { symbol: 'XLRE', name: 'Real Est' },
    { symbol: 'XLC', name: 'Comms' },
    { symbol: 'SMH', name: 'Semis' }
];

// Commodities and VIX
export const COMMODITIES = [
    { symbol: '^VIX', name: 'VIX', display: 'VIX' },
    { symbol: 'GC=F', name: 'Gold', display: 'GOLD' },
    { symbol: 'CL=F', name: 'Crude Oil', display: 'OIL' },
    { symbol: 'NG=F', name: 'Natural Gas', display: 'NATGAS' },
    { symbol: 'SI=F', name: 'Silver', display: 'SILVER' },
    { symbol: 'HG=F', name: 'Copper', display: 'COPPER' }
];

// US Major Cities for domestic view
export const US_CITIES = [
    {
        id: 'dc', name: 'Washington D.C.', state: 'DC', lat: 38.9072, lon: -77.0369,
        type: 'capital', population: '700K',
        keywords: ['washington', 'capitol', 'congress', 'white house', 'pentagon', 'dc', 'biden', 'trump'],
        description: 'Federal government center. White House, Capitol Hill, Pentagon, and major federal agencies.',
        sectors: ['Government', 'Defense', 'Policy']
    },
    {
        id: 'nyc', name: 'New York City', state: 'NY', lat: 40.7128, lon: -74.0060,
        type: 'major', population: '8.3M',
        keywords: ['new york', 'nyc', 'manhattan', 'wall street', 'broadway', 'brooklyn'],
        description: 'Financial capital. Wall Street, major media headquarters, UN headquarters.',
        sectors: ['Finance', 'Media', 'Tech']
    },
    {
        id: 'la', name: 'Los Angeles', state: 'CA', lat: 34.0522, lon: -118.2437,
        type: 'major', population: '3.9M',
        keywords: ['los angeles', 'la', 'hollywood', 'california', 'socal'],
        description: 'Entertainment industry hub. Major port, aerospace, and tech presence.',
        sectors: ['Entertainment', 'Tech', 'Aerospace']
    },
    {
        id: 'chicago', name: 'Chicago', state: 'IL', lat: 41.8781, lon: -87.6298,
        type: 'major', population: '2.7M',
        keywords: ['chicago', 'illinois', 'midwest'],
        description: 'Midwest economic hub. Commodities trading, transportation logistics.',
        sectors: ['Finance', 'Logistics', 'Manufacturing']
    },
    {
        id: 'houston', name: 'Houston', state: 'TX', lat: 29.7604, lon: -95.3698,
        type: 'major', population: '2.3M',
        keywords: ['houston', 'texas', 'energy', 'oil', 'nasa'],
        description: 'Energy capital. Oil & gas headquarters, NASA Johnson Space Center.',
        sectors: ['Energy', 'Aerospace', 'Healthcare']
    },
    {
        id: 'sf', name: 'San Francisco', state: 'CA', lat: 37.7749, lon: -122.4194,
        type: 'major', population: '870K',
        keywords: ['san francisco', 'sf', 'bay area', 'silicon valley', 'tech'],
        description: 'Tech industry epicenter. Venture capital, startups, major tech HQs.',
        sectors: ['Tech', 'Finance', 'Biotech']
    },
    {
        id: 'seattle', name: 'Seattle', state: 'WA', lat: 47.6062, lon: -122.3321,
        type: 'major', population: '750K',
        keywords: ['seattle', 'washington', 'amazon', 'microsoft', 'boeing'],
        description: 'Pacific Northwest tech hub. Amazon, Microsoft, Boeing headquarters.',
        sectors: ['Tech', 'Aerospace', 'E-commerce']
    },
    {
        id: 'miami', name: 'Miami', state: 'FL', lat: 25.7617, lon: -80.1918,
        type: 'major', population: '450K',
        keywords: ['miami', 'florida', 'latin america', 'caribbean'],
        description: 'Gateway to Latin America. Finance, real estate, tourism hub.',
        sectors: ['Finance', 'Real Estate', 'Tourism']
    },
    {
        id: 'atlanta', name: 'Atlanta', state: 'GA', lat: 33.7490, lon: -84.3880,
        type: 'major', population: '500K',
        keywords: ['atlanta', 'georgia', 'cdc', 'delta'],
        description: 'Southeast economic center. CDC headquarters, major logistics hub.',
        sectors: ['Logistics', 'Healthcare', 'Media']
    },
    {
        id: 'boston', name: 'Boston', state: 'MA', lat: 42.3601, lon: -71.0589,
        type: 'major', population: '680K',
        keywords: ['boston', 'massachusetts', 'harvard', 'mit', 'biotech'],
        description: 'Education and biotech hub. Harvard, MIT, major hospitals.',
        sectors: ['Education', 'Biotech', 'Finance']
    },
    {
        id: 'denver', name: 'Denver', state: 'CO', lat: 39.7392, lon: -104.9903,
        type: 'regional', population: '720K',
        keywords: ['denver', 'colorado', 'aerospace'],
        description: 'Mountain West hub. Aerospace, tech growth, federal facilities.',
        sectors: ['Aerospace', 'Tech', 'Energy']
    },
    {
        id: 'phoenix', name: 'Phoenix', state: 'AZ', lat: 33.4484, lon: -112.0740,
        type: 'regional', population: '1.6M',
        keywords: ['phoenix', 'arizona', 'semiconductor', 'tsmc'],
        description: 'Fast-growing Sun Belt metro. Semiconductor manufacturing expansion.',
        sectors: ['Manufacturing', 'Tech', 'Real Estate']
    },
    {
        id: 'austin', name: 'Austin', state: 'TX', lat: 30.2672, lon: -97.7431,
        type: 'regional', population: '1M',
        keywords: ['austin', 'texas', 'tesla', 'tech'],
        description: 'Texas tech hub. Tesla, Samsung, major tech company expansions.',
        sectors: ['Tech', 'Manufacturing', 'Entertainment']
    },
    {
        id: 'detroit', name: 'Detroit', state: 'MI', lat: 42.3314, lon: -83.0458,
        type: 'regional', population: '640K',
        keywords: ['detroit', 'michigan', 'auto', 'ev', 'ford', 'gm'],
        description: 'Auto industry center. EV transition, manufacturing renaissance.',
        sectors: ['Auto', 'Manufacturing', 'Tech']
    },
    {
        id: 'vegas', name: 'Las Vegas', state: 'NV', lat: 36.1699, lon: -115.1398,
        type: 'regional', population: '650K',
        keywords: ['las vegas', 'vegas', 'nevada', 'gaming'],
        description: 'Entertainment and convention hub. Growing tech presence.',
        sectors: ['Tourism', 'Entertainment', 'Tech']
    },
    {
        id: 'norfolk', name: 'Norfolk', state: 'VA', lat: 36.8508, lon: -76.2859,
        type: 'military', population: '245K',
        keywords: ['norfolk', 'navy', 'naval', 'fleet'],
        description: 'Largest naval base in world. Atlantic Fleet headquarters.',
        sectors: ['Military', 'Defense', 'Shipbuilding']
    },
    {
        id: 'sandiego', name: 'San Diego', state: 'CA', lat: 32.7157, lon: -117.1611,
        type: 'military', population: '1.4M',
        keywords: ['san diego', 'navy', 'pacific fleet', 'border'],
        description: 'Major military hub. Pacific Fleet, border region.',
        sectors: ['Military', 'Biotech', 'Tourism']
    }
];

// US Breaking News Hotspots
export const US_HOTSPOTS = [
    {
        id: 'mn-daycare-fraud',
        name: 'Minnesota Daycare Fraud',
        location: 'Minneapolis, MN',
        lat: 44.9778,
        lon: -93.2650,
        level: 'high',
        category: 'Federal Investigation',
        description: 'Massive $250M+ fraud scheme involving Feeding Our Future nonprofit. Largest pandemic-era fraud case. Multiple convictions and ongoing trials.',
        keywords: ['minnesota', 'daycare', 'fraud', 'feeding our future', 'minneapolis', 'pandemic fraud', 'child nutrition', 'somali'],
        startDate: '2022',
        status: 'Active Investigation',
        icon: '⚠'
    },
    {
        id: 'la-wildfires',
        name: 'California Wildfires',
        location: 'Los Angeles, CA',
        lat: 34.0522,
        lon: -118.2437,
        level: 'high',
        category: 'Natural Disaster',
        description: 'Ongoing wildfire emergency in Los Angeles area. Multiple fires, evacuations, and widespread destruction.',
        keywords: ['california', 'wildfire', 'los angeles', 'fire', 'evacuation', 'palisades', 'eaton', 'altadena'],
        startDate: '2025',
        status: 'Active Emergency',
        icon: '🔥'
    },
    {
        id: 'border-crisis',
        name: 'Border Enforcement',
        location: 'El Paso, TX',
        lat: 31.7619,
        lon: -106.4850,
        level: 'elevated',
        category: 'Immigration',
        description: 'Ongoing migration and border enforcement actions. Policy changes, deportations, and humanitarian concerns.',
        keywords: ['border', 'immigration', 'migrant', 'el paso', 'texas', 'cbp', 'deportation', 'ice'],
        startDate: '2024',
        status: 'Ongoing',
        icon: '🚨'
    },
    {
        id: 'ai-regulation',
        name: 'AI & Tech Policy',
        location: 'San Francisco, CA',
        lat: 37.7749,
        lon: -122.4194,
        level: 'medium',
        category: 'Technology',
        description: 'Major tech companies facing regulatory scrutiny. AI safety debates, antitrust actions, and policy formation.',
        keywords: ['openai', 'anthropic', 'google ai', 'ai regulation', 'artificial intelligence', 'tech regulation', 'deepseek'],
        startDate: '2024',
        status: 'Developing',
        icon: '🤖'
    }
];

// Middle East hotspots
export const MIDEAST_HOTSPOTS = [
    {
        id: 'gaza-conflict',
        name: 'Gaza Conflict',
        location: 'Gaza Strip',
        lat: 31.3547,
        lon: 34.3088,
        level: 'high',
        category: 'Armed Conflict',
        description: 'Ongoing Israel-Hamas conflict. Humanitarian crisis, ceasefire negotiations, hostage situation, and military operations.',
        keywords: ['gaza', 'hamas', 'israel', 'hostage', 'ceasefire', 'rafah', 'humanitarian', 'netanyahu'],
        startDate: 'Oct 2023',
        status: 'Active Conflict',
        icon: '💥'
    },
    {
        id: 'iran-tensions',
        name: 'Iran Nuclear & Regional',
        location: 'Tehran, Iran',
        lat: 35.6892,
        lon: 51.3890,
        level: 'high',
        category: 'Geopolitical',
        description: 'Nuclear program concerns, regional proxy conflicts, sanctions, and diplomatic tensions with Western powers.',
        keywords: ['iran', 'tehran', 'nuclear', 'irgc', 'sanctions', 'khamenei', 'enrichment', 'proxy'],
        startDate: 'Ongoing',
        status: 'Elevated Tensions',
        icon: '☢'
    },
    {
        id: 'yemen-houthis',
        name: 'Yemen & Houthi Attacks',
        location: 'Sanaa, Yemen',
        lat: 15.3694,
        lon: 44.1910,
        level: 'high',
        category: 'Armed Conflict',
        description: 'Houthi attacks on Red Sea shipping, ongoing civil war, and humanitarian catastrophe. US/UK military strikes.',
        keywords: ['yemen', 'houthi', 'red sea', 'shipping', 'sanaa', 'aden', 'saudi', 'bab el-mandeb'],
        startDate: '2014',
        status: 'Active Conflict',
        icon: '⚔'
    },
    {
        id: 'syria-situation',
        name: 'Syria Post-Assad',
        location: 'Damascus, Syria',
        lat: 33.5138,
        lon: 36.2765,
        level: 'elevated',
        category: 'Political Transition',
        description: 'Post-Assad transition, HTS governance, reconstruction challenges, and regional power dynamics.',
        keywords: ['syria', 'damascus', 'hts', 'assad', 'aleppo', 'idlib', 'reconstruction', 'turkey'],
        startDate: 'Dec 2024',
        status: 'Political Transition',
        icon: '🏛'
    },
    {
        id: 'lebanon-hezbollah',
        name: 'Lebanon Crisis',
        location: 'Beirut, Lebanon',
        lat: 33.8938,
        lon: 35.5018,
        level: 'elevated',
        category: 'Political/Security',
        description: 'Hezbollah tensions, economic collapse, political vacuum, and reconstruction after Israeli operations.',
        keywords: ['lebanon', 'beirut', 'hezbollah', 'nasrallah', 'economic crisis', 'reconstruction'],
        startDate: 'Ongoing',
        status: 'Crisis',
        icon: '⚠'
    },
    {
        id: 'iraq-instability',
        name: 'Iraq Security',
        location: 'Baghdad, Iraq',
        lat: 33.3152,
        lon: 44.3661,
        level: 'medium',
        category: 'Security',
        description: 'Militia activities, US military presence, Iranian influence, and political instability.',
        keywords: ['iraq', 'baghdad', 'militia', 'iran influence', 'us troops', 'pmu'],
        startDate: 'Ongoing',
        status: 'Unstable',
        icon: '🔶'
    },
    {
        id: 'saudi-transformation',
        name: 'Saudi Vision 2030',
        location: 'Riyadh, Saudi Arabia',
        lat: 24.7136,
        lon: 46.6753,
        level: 'low',
        category: 'Economic/Diplomatic',
        description: 'Economic transformation, NEOM projects, normalization talks, and regional leadership ambitions.',
        keywords: ['saudi', 'mbs', 'vision 2030', 'neom', 'normalization', 'opec', 'aramco'],
        startDate: '2016',
        status: 'Developing',
        icon: '📈'
    }
];

// Ukraine-Russia conflict zone hotspots
export const UKRAINE_HOTSPOTS = [
    {
        id: 'kyiv-capital',
        name: 'Kyiv Defense',
        location: 'Kyiv, Ukraine',
        lat: 50.4501,
        lon: 30.5234,
        level: 'high',
        category: 'Capital Defense',
        description: 'Ukrainian capital under intermittent missile and drone attacks. Air defense operations and infrastructure targeting.',
        keywords: ['kyiv', 'kiev', 'ukraine capital', 'air raid', 'missile strike'],
        startDate: 'Feb 2022',
        status: 'Active Defense',
        icon: '🛡'
    },
    {
        id: 'donbas-front',
        name: 'Donbas Front Line',
        location: 'Donetsk Oblast',
        lat: 48.0159,
        lon: 37.8029,
        level: 'high',
        category: 'Active Combat',
        description: 'Primary axis of Russian offensive operations. Intense fighting around Bakhmut, Avdiivka, and surrounding areas.',
        keywords: ['donbas', 'donetsk', 'bakhmut', 'avdiivka', 'luhansk', 'front line'],
        startDate: '2014',
        status: 'Active Combat Zone',
        icon: '⚔'
    },
    {
        id: 'kherson-front',
        name: 'Kherson-Zaporizhzhia',
        location: 'Southern Ukraine',
        lat: 46.6354,
        lon: 32.6169,
        level: 'high',
        category: 'Southern Front',
        description: 'Southern front including Kherson region and Zaporizhzhia nuclear plant concerns. Cross-river operations.',
        keywords: ['kherson', 'zaporizhzhia', 'dnipro river', 'nuclear plant', 'southern front'],
        startDate: 'Feb 2022',
        status: 'Active Front',
        icon: '☢'
    },
    {
        id: 'crimea-logistics',
        name: 'Crimea Operations',
        location: 'Crimean Peninsula',
        lat: 44.9521,
        lon: 34.1024,
        level: 'elevated',
        category: 'Strategic Target',
        description: 'Ukrainian strikes on Russian military logistics, Kerch Bridge, and naval assets in occupied Crimea.',
        keywords: ['crimea', 'kerch bridge', 'sevastopol', 'black sea fleet'],
        startDate: '2022',
        status: 'Strike Operations',
        icon: '🎯'
    },
    {
        id: 'kursk-incursion',
        name: 'Kursk Incursion',
        location: 'Kursk Oblast, Russia',
        lat: 51.7373,
        lon: 36.1874,
        level: 'high',
        category: 'Cross-Border Op',
        description: 'Ukrainian forces operating inside Russian territory in Kursk region. Significant territorial control.',
        keywords: ['kursk', 'russia incursion', 'cross-border', 'russian territory'],
        startDate: 'Aug 2024',
        status: 'Active Operation',
        icon: '🔥'
    },
    {
        id: 'moscow-drone',
        name: 'Moscow Drone War',
        location: 'Moscow, Russia',
        lat: 55.7558,
        lon: 37.6173,
        level: 'medium',
        category: 'Drone Attacks',
        description: 'Ukrainian drone attacks reaching Russian capital and surrounding regions. Psychological and strategic impact.',
        keywords: ['moscow', 'drone attack', 'kremlin', 'russian capital'],
        startDate: '2023',
        status: 'Ongoing Strikes',
        icon: '🚁'
    },
    {
        id: 'belarus-staging',
        name: 'Belarus Border',
        location: 'Minsk, Belarus',
        lat: 53.9045,
        lon: 27.5615,
        level: 'elevated',
        category: 'Staging Area',
        description: 'Potential staging area for Russian operations. Lukashenko regime support. Training of Russian forces.',
        keywords: ['belarus', 'minsk', 'lukashenko', 'staging', 'northern threat'],
        startDate: 'Feb 2022',
        status: 'Monitoring',
        icon: '⚠'
    },
    {
        id: 'black-sea',
        name: 'Black Sea Control',
        location: 'Black Sea',
        lat: 43.4,
        lon: 34.0,
        level: 'elevated',
        category: 'Naval Theater',
        description: 'Naval warfare, grain corridor disputes, and Russian fleet degradation from Ukrainian strikes.',
        keywords: ['black sea', 'naval', 'grain', 'odesa', 'fleet'],
        startDate: 'Feb 2022',
        status: 'Naval Operations',
        icon: '⚓'
    }
];

// China-Taiwan strait hotspots
export const TAIWAN_HOTSPOTS = [
    {
        id: 'taiwan-strait',
        name: 'Taiwan Strait',
        location: 'Taiwan Strait',
        lat: 24.5,
        lon: 119.5,
        level: 'high',
        category: 'Flashpoint',
        description: 'Primary potential conflict zone. PLA military exercises, naval patrols, and median line crossings.',
        keywords: ['taiwan strait', 'median line', 'pla navy', 'blockade'],
        startDate: 'Ongoing',
        status: 'High Tension',
        icon: '⚡'
    },
    {
        id: 'taipei-capital',
        name: 'Taipei',
        location: 'Taipei, Taiwan',
        lat: 25.0330,
        lon: 121.5654,
        level: 'elevated',
        category: 'Capital Defense',
        description: 'Taiwan capital and government center. Air defense systems, political developments, and US relations.',
        keywords: ['taipei', 'taiwan government', 'tsai', 'lai', 'presidential'],
        startDate: 'Ongoing',
        status: 'Monitoring',
        icon: '🏛'
    },
    {
        id: 'south-china-sea',
        name: 'South China Sea',
        location: 'Spratly Islands',
        lat: 10.0,
        lon: 114.0,
        level: 'high',
        category: 'Territorial Dispute',
        description: 'Contested waters with military outposts. China, Philippines, Vietnam, Malaysia territorial claims.',
        keywords: ['south china sea', 'spratly', 'paracel', 'nine dash', 'reef', 'philippines'],
        startDate: 'Ongoing',
        status: 'Contested',
        icon: '🏝'
    },
    {
        id: 'fujian-buildup',
        name: 'Fujian Military Zone',
        location: 'Fujian Province, China',
        lat: 26.0,
        lon: 119.3,
        level: 'elevated',
        category: 'Military Buildup',
        description: 'PLA Eastern Theater Command. Amphibious assault forces, missile bases, and air assets.',
        keywords: ['fujian', 'eastern theater', 'pla', 'amphibious', 'xiamen'],
        startDate: 'Ongoing',
        status: 'Buildup',
        icon: '🎯'
    },
    {
        id: 'kinmen-matsu',
        name: 'Kinmen & Matsu',
        location: 'Kinmen Islands',
        lat: 24.4493,
        lon: 118.3767,
        level: 'elevated',
        category: 'Frontline Islands',
        description: 'Taiwan-controlled islands near China coast. Gray zone tactics, drone incursions, cable cuts.',
        keywords: ['kinmen', 'matsu', 'quemoy', 'offshore islands', 'cable cut'],
        startDate: 'Ongoing',
        status: 'Gray Zone',
        icon: '⚠'
    },
    {
        id: 'first-island-chain',
        name: 'First Island Chain',
        location: 'Okinawa, Japan',
        lat: 26.5,
        lon: 128.0,
        level: 'medium',
        category: 'Strategic Defense',
        description: 'US-Japan defense perimeter. Okinawa bases, missile deployments, AUKUS coordination.',
        keywords: ['okinawa', 'first island chain', 'kadena', 'us japan', 'aukus'],
        startDate: 'Ongoing',
        status: 'Allied Posture',
        icon: '🛡'
    },
    {
        id: 'beijing-command',
        name: 'Beijing',
        location: 'Beijing, China',
        lat: 39.9042,
        lon: 116.4074,
        level: 'medium',
        category: 'Command Center',
        description: 'CCP leadership and Central Military Commission. Policy decisions, Xi Jinping directives.',
        keywords: ['beijing', 'xi jinping', 'ccp', 'central military', 'politburo'],
        startDate: 'Ongoing',
        status: 'Command',
        icon: '🔴'
    },
    {
        id: 'philippines-disputes',
        name: 'Philippines Tensions',
        location: 'Scarborough Shoal',
        lat: 15.15,
        lon: 117.75,
        level: 'high',
        category: 'Maritime Dispute',
        description: 'China-Philippines confrontations. Coast guard clashes, water cannon incidents, BRP Sierra Madre.',
        keywords: ['scarborough', 'philippines', 'ayungin', 'sierra madre', 'coast guard', 'marcos'],
        startDate: '2023',
        status: 'Active Tensions',
        icon: '🚢'
    }
];

// Intelligence hotspots with coordinates
export const INTEL_HOTSPOTS = [
    {
        id: 'dc', name: 'DC', subtext: 'Pentagon Pizza Index', lat: 38.9, lon: -77.0,
        keywords: ['pentagon', 'white house', 'washington', 'us military', 'cia', 'nsa', 'biden', 'trump'],
        description: 'US national security hub. Pentagon, CIA, NSA, State Dept. Monitor for late-night activity spikes.',
        agencies: ['Pentagon', 'CIA', 'NSA', 'State Dept'],
        status: 'Active monitoring'
    },
    {
        id: 'moscow', name: 'Moscow', subtext: 'Kremlin Activity', lat: 55.75, lon: 37.6,
        keywords: ['russia', 'putin', 'kremlin', 'moscow', 'russian'],
        description: 'Russian political and military command center. FSB, GRU, Presidential Administration.',
        agencies: ['FSB', 'GRU', 'SVR', 'Kremlin'],
        status: 'High activity'
    },
    {
        id: 'beijing', name: 'Beijing', subtext: 'PLA/MSS Activity', lat: 39.9, lon: 116.4,
        keywords: ['china', 'beijing', 'chinese', 'xi jinping', 'taiwan strait', 'pla'],
        description: 'Chinese Communist Party headquarters. PLA command, MSS intelligence operations.',
        agencies: ['PLA', 'MSS', 'CCP Politburo'],
        status: 'Elevated posture'
    },
    {
        id: 'kyiv', name: 'Kyiv', subtext: 'Conflict Zone', lat: 50.45, lon: 30.5,
        keywords: ['ukraine', 'kyiv', 'zelensky', 'ukrainian', 'donbas', 'crimea'],
        description: 'Ukrainian capital under wartime conditions. Government, military coordination center.',
        agencies: ['SBU', 'GUR', 'Armed Forces'],
        status: 'Active conflict'
    },
    {
        id: 'taipei', name: 'Taipei', subtext: 'Strait Watch', lat: 25.03, lon: 121.5,
        keywords: ['taiwan', 'taipei', 'taiwanese', 'strait'],
        description: 'Taiwan government and military HQ. ADIZ violations and PLA exercises tracked.',
        agencies: ['NSB', 'MND', 'AIT'],
        status: 'Heightened alert'
    },
    {
        id: 'tehran', name: 'Tehran', subtext: 'IRGC Activity', lat: 35.7, lon: 51.4,
        keywords: ['iran', 'tehran', 'iranian', 'irgc', 'hezbollah', 'nuclear'],
        description: 'Iranian regime center. IRGC Quds Force, nuclear program oversight, proxy coordination.',
        agencies: ['IRGC', 'MOIS', 'AEOI'],
        status: 'Proxy operations active'
    },
    {
        id: 'jerusalem', name: 'Tel Aviv', subtext: 'Mossad/IDF', lat: 32.07, lon: 34.78,
        keywords: ['israel', 'israeli', 'gaza', 'hamas', 'idf', 'netanyahu', 'mossad'],
        description: 'Israeli security apparatus. IDF operations, Mossad intel, Shin Bet domestic security.',
        agencies: ['Mossad', 'IDF', 'Shin Bet', 'Aman'],
        status: 'Active operations'
    },
    {
        id: 'pyongyang', name: 'Pyongyang', subtext: 'DPRK Watch', lat: 39.03, lon: 125.75,
        keywords: ['north korea', 'kim jong', 'pyongyang', 'dprk', 'korean missile'],
        description: 'North Korean leadership compound. Nuclear/missile program, regime stability indicators.',
        agencies: ['RGB', 'KPA', 'SSD'],
        status: 'Missile tests ongoing'
    },
    {
        id: 'london', name: 'London', subtext: 'GCHQ/MI6', lat: 51.5, lon: -0.12,
        keywords: ['uk', 'britain', 'british', 'mi6', 'gchq', 'london'],
        description: 'UK intelligence community hub. Five Eyes partner, SIGINT, foreign intelligence.',
        agencies: ['MI6', 'GCHQ', 'MI5'],
        status: 'Normal operations'
    },
    {
        id: 'brussels', name: 'Brussels', subtext: 'NATO HQ', lat: 50.85, lon: 4.35,
        keywords: ['nato', 'eu', 'european union', 'brussels'],
        description: 'NATO headquarters and EU institutions. Alliance coordination, Article 5 readiness.',
        agencies: ['NATO', 'EU Commission', 'EEAS'],
        status: 'Enhanced readiness'
    },
    {
        id: 'caracas', name: 'Caracas', subtext: 'Venezuela Crisis', lat: 10.5, lon: -66.9,
        keywords: ['venezuela', 'maduro', 'caracas', 'guaido', 'venezuelan', 'pdvsa'],
        description: 'Venezuelan political crisis center. Maduro regime, opposition movements, oil politics.',
        agencies: ['SEBIN', 'DGCIM', 'GNB'],
        status: 'Political instability'
    },
    {
        id: 'greenland', name: 'Nuuk', subtext: 'Arctic Dispute', lat: 64.18, lon: -51.7,
        keywords: ['greenland', 'denmark', 'arctic', 'nuuk', 'thule', 'rare earth'],
        description: 'Arctic strategic territory. US military presence, rare earth minerals, sovereignty questions.',
        agencies: ['Danish Defence', 'US Space Force', 'Arctic Council'],
        status: 'Diplomatic tensions'
    }
];

// Europe hotspots
export const EUROPE_HOTSPOTS = [
    { name: 'Brussels', lat: 50.85, lon: 4.35, keywords: ['eu', 'nato', 'brussels', 'european'] },
    { name: 'London', lat: 51.5, lon: -0.12, keywords: ['uk', 'britain', 'london', 'british'] },
    { name: 'Paris', lat: 48.85, lon: 2.35, keywords: ['france', 'paris', 'french', 'macron'] },
    { name: 'Berlin', lat: 52.52, lon: 13.4, keywords: ['germany', 'berlin', 'german', 'scholz'] }
];

// Asia hotspots
export const ASIA_HOTSPOTS = [
    { name: 'Beijing', lat: 39.9, lon: 116.4, keywords: ['china', 'beijing', 'chinese', 'xi'] },
    { name: 'Tokyo', lat: 35.68, lon: 139.76, keywords: ['japan', 'tokyo', 'japanese'] },
    { name: 'Seoul', lat: 37.55, lon: 126.99, keywords: ['korea', 'seoul', 'korean', 'pyongyang'] },
    { name: 'New Delhi', lat: 28.6, lon: 77.2, keywords: ['india', 'delhi', 'modi', 'indian'] }
];

// Russia hotspots
export const RUSSIA_HOTSPOTS = [
    { name: 'Moscow', lat: 55.75, lon: 37.6, keywords: ['russia', 'moscow', 'kremlin', 'putin'] },
    { name: 'St Petersburg', lat: 59.93, lon: 30.34, keywords: ['petersburg', 'russian'] }
];

// Location coordinates for mapping headlines to locations
export const LOCATION_COORDS = {
    // === UNITED STATES ===
    'washington': { lat: 38.9, lon: -77.0 },
    'washington dc': { lat: 38.9, lon: -77.0 },
    'new york': { lat: 40.71, lon: -74.0 },
    'new york city': { lat: 40.71, lon: -74.0 },
    'nyc': { lat: 40.71, lon: -74.0 },
    'los angeles': { lat: 34.05, lon: -118.24 },
    'chicago': { lat: 41.88, lon: -87.63 },
    'houston': { lat: 29.76, lon: -95.37 },
    'phoenix': { lat: 33.45, lon: -112.07 },
    'philadelphia': { lat: 39.95, lon: -75.17 },
    'san antonio': { lat: 29.42, lon: -98.49 },
    'san diego': { lat: 32.72, lon: -117.16 },
    'dallas': { lat: 32.78, lon: -96.80 },
    'san francisco': { lat: 37.77, lon: -122.42 },
    'austin': { lat: 30.27, lon: -97.74 },
    'seattle': { lat: 47.61, lon: -122.33 },
    'denver': { lat: 39.74, lon: -104.99 },
    'boston': { lat: 42.36, lon: -71.06 },
    'atlanta': { lat: 33.75, lon: -84.39 },
    'miami': { lat: 25.76, lon: -80.19 },
    'las vegas': { lat: 36.17, lon: -115.14 },
    'detroit': { lat: 42.33, lon: -83.05 },
    'portland': { lat: 45.52, lon: -122.68 },
    'silicon valley': { lat: 37.39, lon: -122.08 },
    'pentagon': { lat: 38.87, lon: -77.06 },
    'white house': { lat: 38.90, lon: -77.04 },
    'capitol hill': { lat: 38.89, lon: -77.01 },
    'wall street': { lat: 40.71, lon: -74.01 },
    
    // === EUROPE ===
    'london': { lat: 51.5, lon: -0.12 },
    'paris': { lat: 48.85, lon: 2.35 },
    'berlin': { lat: 52.52, lon: 13.4 },
    'madrid': { lat: 40.42, lon: -3.70 },
    'rome': { lat: 41.90, lon: 12.50 },
    'amsterdam': { lat: 52.37, lon: 4.90 },
    'brussels': { lat: 50.85, lon: 4.35 },
    'vienna': { lat: 48.21, lon: 16.37 },
    'warsaw': { lat: 52.23, lon: 21.01 },
    'budapest': { lat: 47.50, lon: 19.04 },
    'prague': { lat: 50.08, lon: 14.44 },
    'munich': { lat: 48.14, lon: 11.58 },
    'zurich': { lat: 47.37, lon: 8.54 },
    'geneva': { lat: 46.20, lon: 6.15 },
    'stockholm': { lat: 59.33, lon: 18.07 },
    'oslo': { lat: 59.91, lon: 10.75 },
    'copenhagen': { lat: 55.68, lon: 12.57 },
    'helsinki': { lat: 60.17, lon: 24.94 },
    'dublin': { lat: 53.35, lon: -6.26 },
    'lisbon': { lat: 38.72, lon: -9.14 },
    'athens': { lat: 37.98, lon: 23.73 },
    'bucharest': { lat: 44.43, lon: 26.10 },
    'belgrade': { lat: 44.82, lon: 20.46 },
    'sofia': { lat: 42.70, lon: 23.32 },
    'zagreb': { lat: 45.81, lon: 15.98 },
    'sarajevo': { lat: 43.86, lon: 18.41 },
    'riga': { lat: 56.95, lon: 24.11 },
    'tallinn': { lat: 59.44, lon: 24.75 },
    'vilnius': { lat: 54.69, lon: 25.28 },
    'minsk': { lat: 53.90, lon: 27.57 },
    'chisinau': { lat: 47.01, lon: 28.86 },
    
    // Nordic cities
    'reykjavik': { lat: 64.15, lon: -21.95 },
    'gothenburg': { lat: 57.71, lon: 11.97 },
    'malmö': { lat: 55.60, lon: 13.00 },
    'bergen': { lat: 60.39, lon: 5.32 },
    'trondheim': { lat: 63.43, lon: 10.40 },
    'aarhus': { lat: 56.16, lon: 10.20 },
    'turku': { lat: 60.45, lon: 22.27 },
    'tampere': { lat: 61.50, lon: 23.79 },
    'tartu': { lat: 58.38, lon: 26.72 },
    
    // Baltic & Eastern European cities
    'kaunas': { lat: 54.90, lon: 23.90 },
    'klaipeda': { lat: 55.71, lon: 21.14 },
    'liepaja': { lat: 56.51, lon: 21.01 },
    'daugavpils': { lat: 55.87, lon: 26.54 },
    'parnu': { lat: 58.39, lon: 24.50 },
    'narva': { lat: 59.38, lon: 28.19 },
    'krakow': { lat: 50.06, lon: 19.94 },
    'gdansk': { lat: 54.35, lon: 18.65 },
    'poznan': { lat: 52.41, lon: 16.93 },
    'wroclaw': { lat: 51.11, lon: 17.04 },
    'brno': { lat: 49.19, lon: 16.61 },
    'bratislava': { lat: 48.15, lon: 17.11 },
    'cluj': { lat: 46.77, lon: 23.60 },
    'timisoara': { lat: 45.76, lon: 21.23 },
    'plovdiv': { lat: 42.15, lon: 24.75 },
    'varna': { lat: 43.21, lon: 27.91 },
    'ljubljana': { lat: 46.05, lon: 14.51 },
    'skopje': { lat: 42.00, lon: 21.43 },
    'pristina': { lat: 42.66, lon: 21.17 },
    'tirana': { lat: 41.33, lon: 19.82 },
    'podgorica': { lat: 42.44, lon: 19.26 },
    'tbilisi': { lat: 41.72, lon: 44.79 },
    'yerevan': { lat: 40.18, lon: 44.51 },
    'baku': { lat: 40.41, lon: 49.87 },
    
    // Country names - Europe
    'estonia': { lat: 58.60, lon: 25.01 },
    'estonian': { lat: 58.60, lon: 25.01 },
    'latvia': { lat: 56.88, lon: 24.60 },
    'latvian': { lat: 56.88, lon: 24.60 },
    'lithuania': { lat: 55.17, lon: 23.88 },
    'lithuanian': { lat: 55.17, lon: 23.88 },
    'finland': { lat: 64.0, lon: 26.0 },
    'finnish': { lat: 64.0, lon: 26.0 },
    'sweden': { lat: 62.0, lon: 15.0 },
    'swedish': { lat: 62.0, lon: 15.0 },
    'norway': { lat: 62.0, lon: 10.0 },
    'norwegian': { lat: 62.0, lon: 10.0 },
    'denmark': { lat: 56.0, lon: 10.0 },
    'danish': { lat: 56.0, lon: 10.0 },
    'iceland': { lat: 64.96, lon: -19.02 },
    'icelandic': { lat: 64.96, lon: -19.02 },
    'netherlands': { lat: 52.13, lon: 5.29 },
    'dutch': { lat: 52.13, lon: 5.29 },
    'belgium': { lat: 50.50, lon: 4.47 },
    'belgian': { lat: 50.50, lon: 4.47 },
    'austria': { lat: 47.52, lon: 14.55 },
    'austrian': { lat: 47.52, lon: 14.55 },
    'switzerland': { lat: 46.82, lon: 8.23 },
    'swiss': { lat: 46.82, lon: 8.23 },
    'ireland': { lat: 53.41, lon: -8.24 },
    'irish': { lat: 53.41, lon: -8.24 },
    'portugal': { lat: 39.40, lon: -8.22 },
    'portuguese': { lat: 39.40, lon: -8.22 },
    'greece': { lat: 39.07, lon: 21.82 },
    'greek': { lat: 39.07, lon: 21.82 },
    'hungary': { lat: 47.16, lon: 19.50 },
    'hungarian': { lat: 47.16, lon: 19.50 },
    'czechia': { lat: 49.82, lon: 15.47 },
    'czech': { lat: 49.82, lon: 15.47 },
    'slovakia': { lat: 48.67, lon: 19.70 },
    'slovak': { lat: 48.67, lon: 19.70 },
    'romania': { lat: 45.94, lon: 24.97 },
    'romanian': { lat: 45.94, lon: 24.97 },
    'bulgaria': { lat: 42.73, lon: 25.49 },
    'bulgarian': { lat: 42.73, lon: 25.49 },
    'croatia': { lat: 45.10, lon: 15.20 },
    'croatian': { lat: 45.10, lon: 15.20 },
    'slovenia': { lat: 46.15, lon: 14.99 },
    'slovenian': { lat: 46.15, lon: 14.99 },
    'serbia': { lat: 44.02, lon: 21.01 },
    'serbian': { lat: 44.02, lon: 21.01 },
    'bosnia': { lat: 43.92, lon: 17.68 },
    'bosnian': { lat: 43.92, lon: 17.68 },
    'montenegro': { lat: 42.71, lon: 19.37 },
    'albania': { lat: 41.15, lon: 20.17 },
    'albanian': { lat: 41.15, lon: 20.17 },
    'kosovo': { lat: 42.60, lon: 20.90 },
    'macedonia': { lat: 41.51, lon: 21.75 },
    'north macedonia': { lat: 41.51, lon: 21.75 },
    'moldova': { lat: 47.41, lon: 28.37 },
    'moldovan': { lat: 47.41, lon: 28.37 },
    'belarus': { lat: 53.71, lon: 27.95 },
    'belarusian': { lat: 53.71, lon: 27.95 },
    'georgia': { lat: 42.32, lon: 43.36 },
    'georgian': { lat: 42.32, lon: 43.36 },
    'armenia': { lat: 40.07, lon: 45.04 },
    'armenian': { lat: 40.07, lon: 45.04 },
    'azerbaijan': { lat: 40.14, lon: 47.58 },
    'azerbaijani': { lat: 40.14, lon: 47.58 },
    
    // Ukraine
    'kyiv': { lat: 50.45, lon: 30.52 },
    'kiev': { lat: 50.45, lon: 30.52 },
    'kharkiv': { lat: 49.99, lon: 36.23 },
    'odesa': { lat: 46.48, lon: 30.73 },
    'lviv': { lat: 49.84, lon: 24.03 },
    'donetsk': { lat: 48.02, lon: 37.80 },
    'crimea': { lat: 44.95, lon: 34.10 },
    'sebastopol': { lat: 44.62, lon: 33.53 },
    'mariupol': { lat: 47.10, lon: 37.55 },
    'bakhmut': { lat: 48.60, lon: 38.00 },
    'zaporizhzhia': { lat: 47.84, lon: 35.14 },
    'kherson': { lat: 46.64, lon: 32.62 },
    
    // === RUSSIA ===
    'moscow': { lat: 55.75, lon: 37.6 },
    'st petersburg': { lat: 59.93, lon: 30.32 },
    'saint petersburg': { lat: 59.93, lon: 30.32 },
    'novosibirsk': { lat: 55.01, lon: 82.93 },
    'yekaterinburg': { lat: 56.84, lon: 60.60 },
    'vladivostok': { lat: 43.12, lon: 131.89 },
    'sochi': { lat: 43.60, lon: 39.73 },
    'crimean bridge': { lat: 45.31, lon: 36.51 },
    'kaliningrad': { lat: 54.71, lon: 20.51 },
    'murmansk': { lat: 68.97, lon: 33.09 },
    
    // === MIDDLE EAST ===
    'tehran': { lat: 35.69, lon: 51.39 },
    'jerusalem': { lat: 31.77, lon: 35.23 },
    'tel aviv': { lat: 32.08, lon: 34.78 },
    'gaza': { lat: 31.5, lon: 34.47 },
    'gaza city': { lat: 31.5, lon: 34.47 },
    'west bank': { lat: 31.95, lon: 35.20 },
    'ramallah': { lat: 31.90, lon: 35.21 },
    'haifa': { lat: 32.79, lon: 34.99 },
    'beirut': { lat: 33.89, lon: 35.50 },
    'damascus': { lat: 33.51, lon: 36.29 },
    'aleppo': { lat: 36.20, lon: 37.15 },
    'amman': { lat: 31.95, lon: 35.93 },
    'baghdad': { lat: 33.31, lon: 44.37 },
    'mosul': { lat: 36.34, lon: 43.12 },
    'basra': { lat: 30.51, lon: 47.82 },
    'riyadh': { lat: 24.71, lon: 46.68 },
    'jeddah': { lat: 21.49, lon: 39.19 },
    'mecca': { lat: 21.43, lon: 39.83 },
    'medina': { lat: 24.47, lon: 39.61 },
    'doha': { lat: 25.29, lon: 51.53 },
    'dubai': { lat: 25.20, lon: 55.27 },
    'abu dhabi': { lat: 24.45, lon: 54.37 },
    'muscat': { lat: 23.59, lon: 58.54 },
    'sanaa': { lat: 15.35, lon: 44.21 },
    'aden': { lat: 12.80, lon: 45.03 },
    'kuwait city': { lat: 29.38, lon: 47.99 },
    'bahrain': { lat: 26.23, lon: 50.59 },
    'isfahan': { lat: 32.65, lon: 51.68 },
    'tabriz': { lat: 38.08, lon: 46.29 },
    'natanz': { lat: 33.51, lon: 51.92 },
    'golan heights': { lat: 33.00, lon: 35.75 },
    'rafah': { lat: 31.28, lon: 34.25 },
    'khan younis': { lat: 31.34, lon: 34.31 },
    
    // === ASIA ===
    'beijing': { lat: 39.9, lon: 116.4 },
    'shanghai': { lat: 31.23, lon: 121.47 },
    'hong kong': { lat: 22.32, lon: 114.17 },
    'guangzhou': { lat: 23.13, lon: 113.26 },
    'shenzhen': { lat: 22.54, lon: 114.06 },
    'chengdu': { lat: 30.57, lon: 104.07 },
    'xian': { lat: 34.27, lon: 108.95 },
    'wuhan': { lat: 30.59, lon: 114.31 },
    'chongqing': { lat: 29.56, lon: 106.55 },
    'tianjin': { lat: 39.13, lon: 117.20 },
    'xinjiang': { lat: 41.12, lon: 85.26 },
    'tibet': { lat: 29.65, lon: 91.10 },
    'lhasa': { lat: 29.65, lon: 91.10 },
    'tokyo': { lat: 35.68, lon: 139.76 },
    'osaka': { lat: 34.69, lon: 135.50 },
    'yokohama': { lat: 35.44, lon: 139.64 },
    'nagoya': { lat: 35.18, lon: 136.91 },
    'seoul': { lat: 37.57, lon: 126.98 },
    'busan': { lat: 35.18, lon: 129.08 },
    'pyongyang': { lat: 39.04, lon: 125.76 },
    'taipei': { lat: 25.03, lon: 121.57 },
    'kaohsiung': { lat: 22.62, lon: 120.31 },
    'taiwan strait': { lat: 24.50, lon: 119.50 },
    'manila': { lat: 14.60, lon: 120.98 },
    'jakarta': { lat: -6.21, lon: 106.85 },
    'singapore': { lat: 1.35, lon: 103.82 },
    'kuala lumpur': { lat: 3.14, lon: 101.69 },
    'bangkok': { lat: 13.76, lon: 100.50 },
    'hanoi': { lat: 21.03, lon: 105.85 },
    'ho chi minh city': { lat: 10.82, lon: 106.63 },
    'saigon': { lat: 10.82, lon: 106.63 },
    'phnom penh': { lat: 11.56, lon: 104.92 },
    'yangon': { lat: 16.87, lon: 96.20 },
    'dhaka': { lat: 23.81, lon: 90.41 },
    'kolkata': { lat: 22.57, lon: 88.36 },
    'delhi': { lat: 28.61, lon: 77.21 },
    'new delhi': { lat: 28.61, lon: 77.21 },
    'mumbai': { lat: 19.08, lon: 72.88 },
    'chennai': { lat: 13.08, lon: 80.27 },
    'bangalore': { lat: 12.97, lon: 77.59 },
    'hyderabad': { lat: 17.39, lon: 78.49 },
    'islamabad': { lat: 33.69, lon: 73.07 },
    'karachi': { lat: 24.86, lon: 67.01 },
    'lahore': { lat: 31.56, lon: 74.35 },
    'kabul': { lat: 34.53, lon: 69.17 },
    'kandahar': { lat: 31.63, lon: 65.74 },
    'kathmandu': { lat: 27.72, lon: 85.32 },
    'colombo': { lat: 6.93, lon: 79.84 },
    'ulaanbaatar': { lat: 47.92, lon: 106.91 },
    
    // === AFRICA ===
    'cairo': { lat: 30.04, lon: 31.24 },
    'alexandria': { lat: 31.20, lon: 29.92 },
    'tripoli': { lat: 32.90, lon: 13.19 },
    'tunis': { lat: 36.81, lon: 10.18 },
    'algiers': { lat: 36.75, lon: 3.04 },
    'casablanca': { lat: 33.57, lon: -7.59 },
    'rabat': { lat: 34.02, lon: -6.83 },
    'khartoum': { lat: 15.50, lon: 32.56 },
    'addis ababa': { lat: 9.03, lon: 38.74 },
    'nairobi': { lat: -1.29, lon: 36.82 },
    'lagos': { lat: 6.52, lon: 3.38 },
    'abuja': { lat: 9.08, lon: 7.53 },
    'accra': { lat: 5.56, lon: -0.20 },
    'johannesburg': { lat: -26.20, lon: 28.05 },
    'cape town': { lat: -33.93, lon: 18.42 },
    'pretoria': { lat: -25.75, lon: 28.23 },
    'kinshasa': { lat: -4.44, lon: 15.27 },
    'luanda': { lat: -8.84, lon: 13.23 },
    'dakar': { lat: 14.72, lon: -17.47 },
    'mogadishu': { lat: 2.04, lon: 45.34 },
    
    // === AMERICAS ===
    'mexico city': { lat: 19.43, lon: -99.13 },
    'guadalajara': { lat: 20.67, lon: -103.35 },
    'monterrey': { lat: 25.69, lon: -100.32 },
    'havana': { lat: 23.11, lon: -82.37 },
    'panama city': { lat: 9.00, lon: -79.50 },
    'bogota': { lat: 4.71, lon: -74.07 },
    'medellin': { lat: 6.25, lon: -75.56 },
    'caracas': { lat: 10.48, lon: -66.90 },
    'quito': { lat: -0.18, lon: -78.47 },
    'lima': { lat: -12.05, lon: -77.04 },
    'santiago': { lat: -33.45, lon: -70.67 },
    'buenos aires': { lat: -34.60, lon: -58.38 },
    'brasilia': { lat: -15.79, lon: -47.88 },
    'sao paulo': { lat: -23.55, lon: -46.63 },
    'rio de janeiro': { lat: -22.91, lon: -43.17 },
    'toronto': { lat: 43.65, lon: -79.38 },
    'vancouver': { lat: 49.28, lon: -123.12 },
    'montreal': { lat: 45.50, lon: -73.57 },
    'ottawa': { lat: 45.42, lon: -75.70 },
    
    // === OCEANIA ===
    'sydney': { lat: -33.87, lon: 151.21 },
    'melbourne': { lat: -37.81, lon: 144.96 },
    'brisbane': { lat: -27.47, lon: 153.03 },
    'perth': { lat: -31.95, lon: 115.86 },
    'auckland': { lat: -36.85, lon: 174.76 },
    'wellington': { lat: -41.29, lon: 174.78 },
    
    // === STRATEGIC LOCATIONS ===
    'south china sea': { lat: 12.0, lon: 113.0 },
    'spratly islands': { lat: 8.65, lon: 111.92 },
    'paracel islands': { lat: 16.50, lon: 112.00 },
    'strait of malacca': { lat: 2.5, lon: 101.5 },
    'strait of hormuz': { lat: 26.5, lon: 56.3 },
    'red sea': { lat: 20.0, lon: 38.0 },
    'suez canal': { lat: 30.0, lon: 32.5 },
    'panama canal': { lat: 9.1, lon: -79.7 },
    'bab el mandeb': { lat: 12.58, lon: 43.32 },
    'black sea': { lat: 43.0, lon: 35.0 },
    'baltic sea': { lat: 58.0, lon: 20.0 },
    'arctic': { lat: 75.0, lon: 0.0 },
    'greenland': { lat: 72.0, lon: -40.0 },
    'north pole': { lat: 90.0, lon: 0.0 },
    'antarctica': { lat: -75.0, lon: 0.0 },
    
    // === COUNTRY NAMES (for broader matching) ===
    'united states': { lat: 39.0, lon: -98.0 },
    'america': { lat: 39.0, lon: -98.0 },
    'u.s.': { lat: 39.0, lon: -98.0 },
    'usa': { lat: 39.0, lon: -98.0 },
    'china': { lat: 35.0, lon: 105.0 },
    'chinese': { lat: 35.0, lon: 105.0 },
    'russia': { lat: 60.0, lon: 100.0 },
    'russian': { lat: 60.0, lon: 100.0 },
    'ukraine': { lat: 49.0, lon: 32.0 },
    'ukrainian': { lat: 49.0, lon: 32.0 },
    'israel': { lat: 31.5, lon: 34.8 },
    'israeli': { lat: 31.5, lon: 34.8 },
    'iran': { lat: 32.0, lon: 53.0 },
    'iranian': { lat: 32.0, lon: 53.0 },
    'india': { lat: 20.5, lon: 79.0 },
    'indian': { lat: 20.5, lon: 79.0 },
    'japan': { lat: 36.0, lon: 138.0 },
    'japanese': { lat: 36.0, lon: 138.0 },
    'korea': { lat: 36.0, lon: 128.0 },
    'korean': { lat: 36.0, lon: 128.0 },
    'north korea': { lat: 40.0, lon: 127.0 },
    'south korea': { lat: 36.0, lon: 128.0 },
    'taiwan': { lat: 23.7, lon: 121.0 },
    'taiwanese': { lat: 23.7, lon: 121.0 },
    'germany': { lat: 51.0, lon: 10.0 },
    'german': { lat: 51.0, lon: 10.0 },
    'france': { lat: 46.0, lon: 2.0 },
    'french': { lat: 46.0, lon: 2.0 },
    'uk': { lat: 54.0, lon: -2.0 },
    'britain': { lat: 54.0, lon: -2.0 },
    'british': { lat: 54.0, lon: -2.0 },
    'england': { lat: 52.0, lon: -1.0 },
    'italy': { lat: 42.5, lon: 12.5 },
    'italian': { lat: 42.5, lon: 12.5 },
    'spain': { lat: 40.0, lon: -4.0 },
    'spanish': { lat: 40.0, lon: -4.0 },
    'poland': { lat: 52.0, lon: 20.0 },
    'polish': { lat: 52.0, lon: 20.0 },
    'turkey': { lat: 39.0, lon: 35.0 },
    'turkish': { lat: 39.0, lon: 35.0 },
    'syria': { lat: 35.0, lon: 38.0 },
    'syrian': { lat: 35.0, lon: 38.0 },
    'iraq': { lat: 33.0, lon: 44.0 },
    'iraqi': { lat: 33.0, lon: 44.0 },
    'saudi arabia': { lat: 24.0, lon: 45.0 },
    'saudi': { lat: 24.0, lon: 45.0 },
    'egypt': { lat: 27.0, lon: 30.0 },
    'egyptian': { lat: 27.0, lon: 30.0 },
    'pakistan': { lat: 30.0, lon: 70.0 },
    'pakistani': { lat: 30.0, lon: 70.0 },
    'afghanistan': { lat: 33.0, lon: 65.0 },
    'afghan': { lat: 33.0, lon: 65.0 },
    'mexico': { lat: 23.0, lon: -102.0 },
    'mexican': { lat: 23.0, lon: -102.0 },
    'brazil': { lat: -14.0, lon: -51.0 },
    'brazilian': { lat: -14.0, lon: -51.0 },
    'canada': { lat: 56.0, lon: -106.0 },
    'canadian': { lat: 56.0, lon: -106.0 },
    'australia': { lat: -25.0, lon: 133.0 },
    'australian': { lat: -25.0, lon: 133.0 },
    'venezuela': { lat: 7.0, lon: -66.0 },
    'venezuelan': { lat: 7.0, lon: -66.0 },
    'nigeria': { lat: 10.0, lon: 8.0 },
    'nigerian': { lat: 10.0, lon: 8.0 },
    'south africa': { lat: -30.0, lon: 25.0 },
    'european union': { lat: 50.85, lon: 4.35 },
    'eu': { lat: 50.85, lon: 4.35 },
    'nato': { lat: 50.85, lon: 4.35 },
    'un': { lat: 40.75, lon: -73.97 },
    'united nations': { lat: 40.75, lon: -73.97 },
    
    // === COMMON NEWS TERMS ===
    'congress': { lat: 38.89, lon: -77.01 },
    'white house': { lat: 38.90, lon: -77.04 },
    'kremlin': { lat: 55.75, lon: 37.62 },
    'hamas': { lat: 31.5, lon: 34.47 },
    'hezbollah': { lat: 33.89, lon: 35.50 },
    'houthi': { lat: 15.35, lon: 44.21 },
    'idf': { lat: 31.77, lon: 35.23 },
    'trump': { lat: 38.9, lon: -77.0 },
    'biden': { lat: 38.9, lon: -77.0 },
    'putin': { lat: 55.75, lon: 37.6 },
    'zelensky': { lat: 50.45, lon: 30.52 },
    'netanyahu': { lat: 31.77, lon: 35.23 },
    'xi jinping': { lat: 39.9, lon: 116.4 }
};

// Shipping chokepoints for supply chain monitoring
export const SHIPPING_CHOKEPOINTS = [
    {
        id: 'suez',
        name: 'Suez Canal',
        lat: 30.0,
        lon: 32.5,
        keywords: ['suez', 'red sea', 'houthi', 'canal'],
        desc: 'Critical waterway connecting Mediterranean to Red Sea. ~12% of global trade. Currently threatened by Houthi attacks.',
        traffic: '~50 ships/day',
        region: 'Egypt'
    },
    {
        id: 'panama',
        name: 'Panama Canal',
        lat: 9.1,
        lon: -79.7,
        keywords: ['panama canal', 'panama'],
        desc: 'Links Atlantic and Pacific oceans. ~5% of global trade. Facing drought-related capacity restrictions.',
        traffic: '~40 ships/day',
        region: 'Panama'
    },
    {
        id: 'hormuz',
        name: 'Strait of Hormuz',
        lat: 26.5,
        lon: 56.3,
        keywords: ['hormuz', 'strait of hormuz', 'persian gulf'],
        desc: 'Only sea route from Persian Gulf to open ocean. ~21% of global oil passes through daily.',
        traffic: '~20 tankers/day',
        region: 'Iran/Oman'
    },
    {
        id: 'malacca',
        name: 'Malacca Strait',
        lat: 2.5,
        lon: 101.5,
        keywords: ['malacca', 'singapore strait'],
        desc: 'Main shipping route between Indian and Pacific oceans. ~25% of global trade including ~25% of oil.',
        traffic: '~80 ships/day',
        region: 'Malaysia/Singapore'
    },
    {
        id: 'bosphorus',
        name: 'Bosphorus Strait',
        lat: 41.1,
        lon: 29.0,
        keywords: ['bosphorus', 'black sea', 'turkish strait'],
        desc: 'Only route between Black Sea and Mediterranean. Critical for Russian/Ukrainian grain exports.',
        traffic: '~45 ships/day',
        region: 'Turkey'
    }
];

// Cyber threat regions
export const CYBER_REGIONS = [
    {
        id: 'cyber_russia',
        name: 'RU',
        fullName: 'Russia',
        lat: 55.75,
        lon: 45.0,
        group: 'APT28/29',
        aka: 'Fancy Bear / Cozy Bear',
        sponsor: 'GRU / FSB',
        desc: 'State-sponsored groups linked to Russian intelligence. Known for election interference, government espionage, and critical infrastructure attacks.',
        targets: ['Government', 'Defense', 'Energy', 'Elections', 'Media']
    },
    {
        id: 'cyber_china',
        name: 'CN',
        fullName: 'China',
        lat: 35.0,
        lon: 105.0,
        group: 'APT41',
        aka: 'Double Dragon / Winnti',
        sponsor: 'MSS',
        desc: 'Hybrid espionage and financially motivated group. Conducts state-sponsored intelligence and supply chain attacks.',
        targets: ['Tech', 'Telecom', 'Healthcare', 'Gaming', 'Supply Chain']
    },
    {
        id: 'cyber_nk',
        name: 'NK',
        fullName: 'North Korea',
        lat: 39.0,
        lon: 127.0,
        group: 'Lazarus',
        aka: 'Hidden Cobra / APT38',
        sponsor: 'RGB',
        desc: 'Financially motivated attacks to fund regime. Known for cryptocurrency theft, SWIFT banking attacks, and ransomware.',
        targets: ['Crypto', 'Banks', 'Defense', 'Media', 'Critical Infra']
    },
    {
        id: 'cyber_iran',
        name: 'IR',
        fullName: 'Iran',
        lat: 32.0,
        lon: 53.0,
        group: 'APT33/35',
        aka: 'Charming Kitten / Elfin',
        sponsor: 'IRGC',
        desc: 'Focus on regional adversaries and dissidents. Known for destructive wiper malware and spear-phishing campaigns.',
        targets: ['Energy', 'Aviation', 'Government', 'Dissidents', 'Israel']
    }
];

// Active conflict zones with approximate boundaries
export const CONFLICT_ZONES = [
    {
        id: 'ukraine',
        name: 'Ukraine Conflict',
        intensity: 'high',
        coords: [
            [37.5, 47.0], [38.5, 47.5], [39.0, 48.5], [38.0, 49.5],
            [37.0, 49.0], [36.0, 48.5], [35.5, 47.5], [36.5, 47.0]
        ],
        labelPos: { lat: 48.0, lon: 37.5 },
        startDate: 'Feb 24, 2022',
        parties: ['Russia', 'Ukraine', 'NATO (support)'],
        casualties: '500,000+ (est.)',
        displaced: '6.5M+ refugees',
        description: 'Full-scale Russian invasion of Ukraine. Active frontlines in Donetsk, Luhansk, Zaporizhzhia, and Kherson oblasts. Heavy artillery, drone warfare, and trench combat.',
        keyEvents: ['Battle of Bakhmut', 'Kursk incursion', 'Black Sea drone strikes', 'Infrastructure attacks'],
        keywords: ['ukraine', 'russia', 'zelensky', 'putin', 'donbas', 'crimea', 'bakhmut', 'kursk']
    },
    {
        id: 'gaza',
        name: 'Gaza Conflict',
        intensity: 'high',
        coords: [
            [34.2, 31.6], [34.6, 31.6], [34.6, 31.2], [34.2, 31.2]
        ],
        labelPos: { lat: 31.4, lon: 34.4 },
        startDate: 'Oct 7, 2023',
        parties: ['Israel (IDF)', 'Hamas', 'Palestinian Islamic Jihad'],
        casualties: '45,000+ (Gaza), 1,200+ (Israel)',
        displaced: '2M+ internally displaced',
        description: 'Israeli military operation in Gaza following Oct 7 Hamas attacks. Urban warfare, humanitarian crisis, regional escalation with Hezbollah and Houthis.',
        keyEvents: ['Oct 7 attacks', 'Ground invasion', 'Rafah operation', 'Hostage negotiations'],
        keywords: ['gaza', 'israel', 'hamas', 'idf', 'netanyahu', 'hostage', 'rafah', 'hezbollah']
    },
    {
        id: 'sudan',
        name: 'Sudan Civil War',
        intensity: 'medium',
        coords: [
            [32.0, 16.0], [34.0, 16.5], [35.0, 15.0], [33.5, 13.5],
            [31.5, 14.0], [31.0, 15.5]
        ],
        labelPos: { lat: 15.0, lon: 32.5 },
        startDate: 'Apr 15, 2023',
        parties: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)'],
        casualties: '15,000+ killed',
        displaced: '10M+ displaced',
        description: 'Power struggle between SAF and RSF paramilitary. Fighting centered around Khartoum, Darfur. Major humanitarian catastrophe with famine conditions.',
        keyEvents: ['Khartoum battle', 'Darfur massacres', 'El Fasher siege', 'Famine declared'],
        keywords: ['sudan', 'khartoum', 'rsf', 'darfur', 'burhan', 'hemedti']
    },
    {
        id: 'myanmar',
        name: 'Myanmar Civil War',
        intensity: 'medium',
        coords: [
            [96.0, 22.0], [98.0, 23.0], [98.5, 21.0], [97.0, 19.5], [95.5, 20.5]
        ],
        labelPos: { lat: 21.0, lon: 96.5 },
        startDate: 'Feb 1, 2021',
        parties: ['Military Junta (SAC)', 'Ethnic Armed Organizations', 'People\'s Defense Forces'],
        casualties: '50,000+ (est.)',
        displaced: '3M+ internally displaced',
        description: 'Armed resistance following 2021 military coup. Multiple ethnic armies and pro-democracy forces fighting junta. Recent rebel advances in border regions.',
        keyEvents: ['Operation 1027', 'Lashio capture', 'Myawaddy offensive', 'Junta conscription'],
        keywords: ['myanmar', 'burma', 'junta', 'arakan', 'karen', 'kachin']
    },
    {
        id: 'taiwan_strait',
        name: 'Taiwan Strait',
        intensity: 'watch',
        coords: [
            [119.0, 26.0], [121.5, 26.0], [121.5, 22.5], [119.0, 22.5]
        ],
        labelPos: { lat: 24.5, lon: 120.0 },
        startDate: 'Ongoing tensions',
        parties: ['China (PLA)', 'Taiwan (ROC)', 'United States (deterrence)'],
        casualties: 'N/A - no active combat',
        displaced: 'N/A',
        description: 'Heightened tensions over Taiwan sovereignty. Regular PLA exercises, airspace incursions, naval activity. Risk of flashpoint escalation.',
        keyEvents: ['PLA exercises', 'ADIZ incursions', 'US arms sales', 'Diplomatic tensions'],
        keywords: ['taiwan', 'china', 'strait', 'pla', 'tsai', 'invasion']
    }
];

// Military bases around the world
export const MILITARY_BASES = [
    { id: 'ramstein', name: 'Ramstein AB', lat: 49.44, lon: 7.6, type: 'us-nato' },
    { id: 'diego_garcia', name: 'Diego Garcia', lat: -7.32, lon: 72.42, type: 'us-nato' },
    { id: 'guam', name: 'Andersen AFB', lat: 13.58, lon: 144.92, type: 'us-nato' },
    { id: 'okinawa', name: 'Kadena AB', lat: 26.35, lon: 127.77, type: 'us-nato' },
    { id: 'yokosuka', name: 'Yokosuka', lat: 35.28, lon: 139.67, type: 'us-nato' },
    { id: 'bahrain', name: 'NSA Bahrain', lat: 26.23, lon: 50.65, type: 'us-nato' },
    { id: 'qatar', name: 'Al Udeid', lat: 25.12, lon: 51.31, type: 'us-nato' },
    { id: 'djibouti', name: 'Camp Lemonnier', lat: 11.55, lon: 43.15, type: 'us-nato' },
    { id: 'incirlik', name: 'Incirlik AB', lat: 37.0, lon: 35.43, type: 'us-nato' },
    { id: 'rota', name: 'NS Rota', lat: 36.62, lon: -6.35, type: 'us-nato' },
    { id: 'djibouti_cn', name: 'PLA Djibouti', lat: 11.59, lon: 43.05, type: 'china' },
    { id: 'woody_island', name: 'Woody Island', lat: 16.83, lon: 112.33, type: 'china' },
    { id: 'fiery_cross', name: 'Fiery Cross', lat: 9.55, lon: 112.89, type: 'china' },
    { id: 'mischief_reef', name: 'Mischief Reef', lat: 9.90, lon: 115.53, type: 'china' },
    { id: 'ream', name: 'Ream (Cambodia)', lat: 10.52, lon: 103.63, type: 'china' },
    { id: 'kaliningrad', name: 'Kaliningrad', lat: 54.71, lon: 20.51, type: 'russia' },
    { id: 'sevastopol', name: 'Sevastopol', lat: 44.62, lon: 33.53, type: 'russia' },
    { id: 'tartus', name: 'Tartus (Syria)', lat: 34.89, lon: 35.87, type: 'russia' },
    { id: 'hmeimim', name: 'Hmeimim AB', lat: 35.41, lon: 35.95, type: 'russia' },
    { id: 'cam_ranh', name: 'Cam Ranh', lat: 11.99, lon: 109.22, type: 'russia' }
];

// Nuclear facilities
export const NUCLEAR_FACILITIES = [
    { id: 'zaporizhzhia', name: 'Zaporizhzhia NPP', lat: 47.51, lon: 34.58, type: 'plant', status: 'contested' },
    { id: 'fukushima', name: 'Fukushima', lat: 37.42, lon: 141.03, type: 'plant', status: 'decommissioning' },
    { id: 'flamanville', name: 'Flamanville', lat: 49.54, lon: -1.88, type: 'plant', status: 'active' },
    { id: 'bruce', name: 'Bruce Power', lat: 44.33, lon: -81.60, type: 'plant', status: 'active' },
    { id: 'natanz', name: 'Natanz', lat: 33.72, lon: 51.73, type: 'enrichment', status: 'active' },
    { id: 'fordow', name: 'Fordow', lat: 34.88, lon: 51.0, type: 'enrichment', status: 'active' },
    { id: 'yongbyon', name: 'Yongbyon', lat: 39.80, lon: 125.75, type: 'weapons', status: 'active' },
    { id: 'dimona', name: 'Dimona', lat: 31.0, lon: 35.15, type: 'weapons', status: 'active' },
    { id: 'los_alamos', name: 'Los Alamos', lat: 35.88, lon: -106.30, type: 'weapons', status: 'active' },
    { id: 'sellafield', name: 'Sellafield', lat: 54.42, lon: -3.50, type: 'reprocessing', status: 'active' },
    { id: 'la_hague', name: 'La Hague', lat: 49.68, lon: -1.88, type: 'reprocessing', status: 'active' }
];

// Major undersea cable routes
export const UNDERSEA_CABLES = [
    {
        id: 'transatlantic_1',
        name: 'Transatlantic (TAT-14)',
        major: true,
        points: [[-74.0, 40.7], [-30.0, 45.0], [-9.0, 52.0]]
    },
    {
        id: 'transpacific_1',
        name: 'Transpacific (Unity)',
        major: true,
        points: [[-122.4, 37.8], [-155.0, 25.0], [139.7, 35.7]]
    },
    {
        id: 'sea_me_we_5',
        name: 'SEA-ME-WE 5',
        major: true,
        points: [[103.8, 1.3], [80.0, 10.0], [55.0, 25.0], [35.0, 30.0], [12.0, 37.0], [-5.0, 36.0]]
    },
    {
        id: 'aae1',
        name: 'Asia-Africa-Europe 1',
        major: true,
        points: [[121.0, 25.0], [103.8, 1.3], [73.0, 15.0], [44.0, 12.0], [35.0, 30.0], [28.0, 41.0]]
    },
    {
        id: 'curie',
        name: 'Curie (Google)',
        major: false,
        points: [[-122.4, 37.8], [-80.0, 0.0], [-70.0, -33.0]]
    },
    {
        id: 'marea',
        name: 'MAREA (Microsoft)',
        major: true,
        points: [[-73.8, 39.4], [-9.0, 37.0]]
    }
];

// Countries under sanctions
export const SANCTIONED_COUNTRIES = {
    408: 'severe',  // North Korea
    728: 'severe',  // South Sudan
    729: 'severe',  // Sudan
    760: 'severe',  // Syria
    364: 'high',    // Iran
    643: 'high',    // Russia
    112: 'high',    // Belarus
    862: 'moderate', // Venezuela
    104: 'moderate', // Myanmar
    178: 'moderate', // Congo
    152: 'low',     // Cuba
    716: 'low',     // Zimbabwe
};

// Regions for news density calculation
export const NEWS_REGIONS = [
    { id: 'us', name: 'United States', lat: 39.0, lon: -98.0, radius: 60, keywords: ['us', 'america', 'washington', 'trump', 'biden', 'congress'] },
    { id: 'europe', name: 'Europe', lat: 50.0, lon: 10.0, radius: 55, keywords: ['europe', 'eu', 'european', 'nato', 'brussels'] },
    { id: 'russia', name: 'Russia', lat: 60.0, lon: 90.0, radius: 50, keywords: ['russia', 'russian', 'putin', 'moscow', 'kremlin'] },
    { id: 'china', name: 'China', lat: 35.0, lon: 105.0, radius: 55, keywords: ['china', 'chinese', 'beijing', 'xi'] },
    { id: 'middle_east', name: 'Middle East', lat: 30.0, lon: 45.0, radius: 50, keywords: ['israel', 'iran', 'saudi', 'gaza', 'syria', 'iraq', 'yemen'] },
    { id: 'east_asia', name: 'East Asia', lat: 35.0, lon: 130.0, radius: 45, keywords: ['japan', 'korea', 'taiwan', 'kim jong'] },
    { id: 'south_asia', name: 'South Asia', lat: 22.0, lon: 78.0, radius: 45, keywords: ['india', 'pakistan', 'modi'] },
    { id: 'africa', name: 'Africa', lat: 5.0, lon: 20.0, radius: 55, keywords: ['africa', 'african', 'sudan', 'nigeria', 'ethiopia'] },
    { id: 'latam', name: 'Latin America', lat: -15.0, lon: -60.0, radius: 50, keywords: ['brazil', 'mexico', 'venezuela', 'argentina'] }
];

// Flight data cache duration
export const FLIGHT_CACHE_DURATION = 30000; // 30 seconds

// Satellite tile configuration
export const SATELLITE_CONFIG = {
    nasa: {
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/{date}/250m/{z}/{y}/{x}.jpg',
        attribution: 'NASA GIBS',
        maxZoom: 8
    },
    esri: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'ESRI',
        maxZoom: 18
    }
};

// Custom monitor colors
export const MONITOR_COLORS = [
    '#00ff88', '#ff6600', '#00aaff', '#ff00ff', '#ffcc00',
    '#ff3366', '#33ccff', '#99ff33', '#ff6699', '#00ffcc'
];

// Topic extraction patterns for correlation detection
export const CORRELATION_TOPICS = [
    { id: 'tariffs', patterns: [/tariff/i, /trade war/i, /import tax/i, /customs duty/i], category: 'Economy' },
    { id: 'fed-rates', patterns: [/federal reserve/i, /interest rate/i, /rate cut/i, /rate hike/i, /powell/i, /fomc/i], category: 'Economy' },
    { id: 'inflation', patterns: [/inflation/i, /cpi/i, /consumer price/i, /cost of living/i], category: 'Economy' },
    { id: 'ai-regulation', patterns: [/ai regulation/i, /artificial intelligence.*law/i, /ai safety/i, /ai governance/i], category: 'Tech' },
    { id: 'china-tensions', patterns: [/china.*taiwan/i, /south china sea/i, /us.*china/i, /beijing.*washington/i], category: 'Geopolitics' },
    { id: 'russia-ukraine', patterns: [/ukraine/i, /zelensky/i, /putin.*war/i, /crimea/i, /donbas/i], category: 'Conflict' },
    { id: 'israel-gaza', patterns: [/gaza/i, /hamas/i, /netanyahu/i, /israel.*attack/i, /hostage/i], category: 'Conflict' },
    { id: 'iran', patterns: [/iran.*nuclear/i, /tehran/i, /ayatollah/i, /iranian.*strike/i], category: 'Geopolitics' },
    { id: 'crypto', patterns: [/bitcoin/i, /crypto.*regulation/i, /ethereum/i, /sec.*crypto/i], category: 'Finance' },
    { id: 'housing', patterns: [/housing market/i, /mortgage rate/i, /home price/i, /real estate.*crash/i], category: 'Economy' },
    { id: 'layoffs', patterns: [/layoff/i, /job cut/i, /workforce reduction/i, /downsizing/i], category: 'Business' },
    { id: 'bank-crisis', patterns: [/bank.*fail/i, /banking crisis/i, /fdic/i, /bank run/i], category: 'Finance' },
    { id: 'election', patterns: [/election/i, /polling/i, /campaign/i, /ballot/i, /voter/i], category: 'Politics' },
    { id: 'immigration', patterns: [/immigration/i, /border.*crisis/i, /migrant/i, /deportation/i, /asylum/i], category: 'Politics' },
    { id: 'climate', patterns: [/climate change/i, /wildfire/i, /hurricane/i, /extreme weather/i, /flood/i], category: 'Environment' },
    { id: 'pandemic', patterns: [/pandemic/i, /outbreak/i, /virus.*spread/i, /who.*emergency/i, /bird flu/i], category: 'Health' },
    { id: 'nuclear', patterns: [/nuclear.*threat/i, /nuclear weapon/i, /atomic/i, /icbm/i], category: 'Security' },
    { id: 'supply-chain', patterns: [/supply chain/i, /shipping.*delay/i, /port.*congestion/i, /logistics.*crisis/i], category: 'Economy' },
    { id: 'big-tech', patterns: [/antitrust.*tech/i, /google.*monopoly/i, /meta.*lawsuit/i, /apple.*doj/i], category: 'Tech' },
    { id: 'deepfake', patterns: [/deepfake/i, /ai.*misinformation/i, /synthetic media/i], category: 'Tech' }
];

// Fringe narrative patterns to track
export const NARRATIVE_PATTERNS = [
    { id: 'deep-state', keywords: ['deep state', 'shadow government', 'permanent state'], category: 'Political', severity: 'watch' },
    { id: 'cbdc-control', keywords: ['cbdc control', 'digital currency surveillance', 'social credit'], category: 'Finance', severity: 'watch' },
    { id: 'wef-agenda', keywords: ['great reset', 'wef agenda', 'world economic forum plot'], category: 'Political', severity: 'watch' },
    { id: 'bio-weapon', keywords: ['lab leak', 'bioweapon', 'gain of function'], category: 'Health', severity: 'emerging' },
    { id: 'election-fraud', keywords: ['election fraud', 'rigged election', 'stolen election', 'mail ballot fraud'], category: 'Political', severity: 'watch' },
    { id: 'ai-doom', keywords: ['ai doom', 'ai extinction', 'superintelligence risk', 'agi danger'], category: 'Tech', severity: 'emerging' },
    { id: 'ai-consciousness', keywords: ['ai sentient', 'ai conscious', 'ai feelings', 'ai alive'], category: 'Tech', severity: 'emerging' },
    { id: 'robot-replacement', keywords: ['robots replacing', 'automation unemployment', 'job automation'], category: 'Economy', severity: 'spreading' },
    { id: 'china-invasion', keywords: ['china taiwan invasion', 'china war', 'south china sea conflict'], category: 'Geopolitical', severity: 'watch' },
    { id: 'nato-expansion', keywords: ['nato provocation', 'nato aggression', 'nato encirclement'], category: 'Geopolitical', severity: 'watch' },
    { id: 'dollar-collapse', keywords: ['dollar collapse', 'dedollarization', 'brics currency', 'petrodollar death'], category: 'Finance', severity: 'spreading' },
    { id: 'vaccine-injury', keywords: ['vaccine injury', 'vaccine side effect', 'vaccine death', 'turbo cancer'], category: 'Health', severity: 'watch' },
    { id: 'next-pandemic', keywords: ['next pandemic', 'disease x', 'bird flu pandemic'], category: 'Health', severity: 'emerging' },
    { id: 'depopulation', keywords: ['depopulation agenda', 'fertility crisis', 'population control'], category: 'Society', severity: 'disinfo' },
    { id: 'food-crisis', keywords: ['food shortage', 'engineered famine', 'food supply attack'], category: 'Economy', severity: 'emerging' },
    { id: 'energy-war', keywords: ['energy crisis manufactured', 'green agenda', 'energy shortage'], category: 'Economy', severity: 'spreading' }
];

// Source classification
export const SOURCE_TYPES = {
    fringe: ['zerohedge', 'infowars', 'naturalnews', 'gateway', 'breitbart', 'epoch', 'revolver', 'dailycaller'],
    alternative: ['substack', 'rumble', 'bitchute', 'telegram', 'gab', 'gettr', 'truth social'],
    mainstream: ['reuters', 'ap news', 'bbc', 'cnn', 'nytimes', 'wsj', 'wapo', 'guardian', 'abc', 'nbc', 'cbs', 'fox']
};

// AI RSS feeds for arms race tracking
export const AI_FEEDS = [
    { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml' },
    { name: 'Anthropic', url: 'https://www.anthropic.com/rss.xml' },
    { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/' },
    { name: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
    { name: 'Meta AI', url: 'https://ai.meta.com/blog/rss/' },
    { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml' }
];

// Cybersecurity feeds
export const CYBER_FEEDS = [
    { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/' },
    { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
    { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
    { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
    { name: 'Threatpost', url: 'https://threatpost.com/feed/' }
];

// Disaster tracking feeds
export const DISASTER_FEEDS = [
    { name: 'USGS Earthquakes', url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.atom' },
    { name: 'GDACS', url: 'https://www.gdacs.org/xml/rss.xml' },
    { name: 'ReliefWeb', url: 'https://reliefweb.int/updates/rss.xml' }
];

// Social media trends feeds
export const SOCIAL_FEEDS = [
    { name: 'Reddit WorldNews', url: 'https://www.reddit.com/r/worldnews/.rss' },
    { name: 'Reddit Technology', url: 'https://www.reddit.com/r/technology/.rss' },
    { name: 'Reddit News', url: 'https://www.reddit.com/r/news/.rss' }
];
