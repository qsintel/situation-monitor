# Situation Monitor

A browser-only global situation dashboard (static HTML/CSS/JS) intended to run locally during development and deploy cleanly to GitHub Pages.

**Live Demo:** https://qsintel.github.io/situation-monitor/

## Credits

This project is based on the original work by **Reggie (hipcityreg)**:

- Upstream/original: https://github.com/hipcityreg/situation-monitor
- This fork: https://github.com/qsintel/situation-monitor

## Features

### News & Intel
- **Multi-source news aggregation**: Breaking news, tech, finance, government, world news, disasters, AI, layoffs, cyber, and social trends
- **Intel Feed**: Intelligence-focused sources with priority tagging
- **Correlation Engine**: Pattern detection across headlines with momentum tracking and cross-source analysis
- **Narrative Tracker**: Detects emerging narratives and fringe-to-mainstream crossover
- **Time filtering**: Filter news by last hour, 6h, 12h, 24h, or all time (default: 12 hours)
- **Region filtering**: Focus on US, Europe, Asia, Middle East, Russia, or Ukraine
- **Share buttons**: Share headlines to X/Twitter, Facebook, LinkedIn, and Reddit with article link + QSINTEL attribution

### Markets & Data
- **Live market data**: Stocks, indices, crypto with price changes
- **Sector heatmap**: Visual market sector performance
- **Commodities**: Gold, oil, and other commodity prices
- **Polymarket predictions**: Live prediction market odds with direct links
- **Congressional trades**: Recent stock trades by members of Congress
- **Whale watch**: Large crypto transactions
- **Government contracts**: Recent federal contract awards
- **Money printer**: Fed balance sheet tracking

### Map & Visualization
- **Interactive global map**: News activity hotspots with clustering
- **Disaster markers**: Earthquakes (USGS), wildfires, hurricanes, floods, volcanoes (NASA EONET)
- **Flight tracking**: Real-time aircraft positions via OpenSky Network (regional views only)
- **Region views**: Global, US, Europe, Asia-Pacific, Middle East, Russia, Ukraine, Taiwan Strait

### Live Streams
- **Embedded news streams**: Multiple configurable YouTube live streams
- **Custom stream sources**: Add your own YouTube channels/videos
- **Stream cycling**: Auto-cycle through multiple streams

### UI/UX
- **Panel expansion**: Click panel titles to expand to full width
- **Pinnable panels**: Pin frequently-used panels to the Dashboard tab
- **Dark theme**: Easy on the eyes for extended monitoring
- **Breaking news ticker**: Scrolling ticker with latest headlines
- **Desktop notifications**: Optional alerts for breaking news

## What's different from the original fork

This repo has been heavily modified from the original fork starting point. Key changes include:

- **Static, browser-only architecture**: Runs as a plain static site (no backend required).
- **Modular ES modules**: Code organized under `js/` modules rather than a single script blob.
- **Persistent settings**: User settings and custom stream sources are stored via `localStorage`.
- **Configurable panels**: Panels can be toggled, reordered, pinned, and persisted.
- **Live stream handling upgrades**:
  - Supports multiple stream types (direct YouTube video IDs, channel-live embeds, and "attempt embed" for `/live` pages).
  - Defaults are geared toward more stable **channel-based live embeds**.
- **Tooltip system fix**: Tooltips moved away from CSS-only pseudo-elements (which were getting clipped) to a JS-driven body-level tooltip approach.
- **UI/UX refinements**: Wider settings modal sections, better hover behavior, panel expansion, share buttons, and additional layout tweaks.
- **Repository hygiene for GitHub Pages**:
  - Dev-only artifacts like `node_modules/` are ignored.
  - Optional test files can be removed.
  - Archived/unused code moved under `archive/`.

## Development

- Install deps (optional; only needed for local serving):
  - `npm install`
- Run locally:
  - `npm start`
  - Serves on `http://localhost:5173`

## GitHub Pages deployment

Because this is a static site, GitHub Pages can serve it directly:

- Ensure the repo contains only the deployable assets you want (typically `index.html`, `styles.css`, and `js/`).
- In GitHub: **Settings -> Pages -> Build and deployment** -> select your branch/folder.

## Notes on embeds

Some embeds (especially YouTube `/live` landing pages) may fail due to YouTube's embed restrictions or browser privacy features (Firefox Enhanced Tracking Protection can also impact playback).
