# Shri Aaum — Kundli (Vedic Birth Chart)

Free Vedic Kundli generator powered by Swiss Ephemeris (WebAssembly).  
All calculations run in the browser — no server needed.

## Features
- Swiss Ephemeris accuracy via WebAssembly (Lahiri Ayanamsha)
- Planetary positions (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
- Whole Sign house system
- Vimshottari Dasha with Antardasha drill-down
- Ashtakvarga scoring (classical Parashari)
- Dosha detection (Mangal, Kaal Sarp, Shrapit, Guru Chandal, Pitru)
- Navamsha (D9) + Divisional charts (D3, D10, D12)
- Place search via OpenStreetMap Nominatim

## Tech Stack
- React 18 + Vite
- `swisseph-wasm` — Swiss Ephemeris compiled to WebAssembly
- Zero backend — 100% client-side

## Deploy on Vercel

1. Create a new GitHub repo and upload all these files
2. Go to [vercel.com](https://vercel.com) → Import Project → Select the repo
3. Vercel auto-detects Vite — click Deploy
4. Done. Your Kundli app is live.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173
