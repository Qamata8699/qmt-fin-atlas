# QMT FIN ATLAS

Company intelligence terminal across **NYSE, LSE & JSE**. Search any listed company and get:

- **Profitability** — gross / operating / net margins, ROE, ROA, EBITDA
- **Cash position** — total cash, debt, free cash flow, operating cash flow, liquidity ratios
- **Revenue** — TTM revenue, YoY growth, multi-year revenue & net-income charts
- **DCF benchmark** — transparent 5-year DCF (stated assumptions) vs. market price
- **M&A news** — merger / acquisition headlines, plus SEC merger filings (S-4, DEFM14A, 8-K)
- **Beneficial ownership map** — interactive graph of top institutional holders (Vanguard, BlackRock, Berkshire, …) built from 13F-style data or SEC SC 13D/13G filings

## Data sources (free, no API keys)

| Source | Role |
|---|---|
| Yahoo Finance (cookie+crumb) | Primary: quotes, fundamentals, holders, news across all three exchanges |
| SEC EDGAR | Automatic fallback for US listings: XBRL fundamentals, SC 13D/13G beneficial owners, merger filings |

> Free feeds can be delayed, rate-limited or incomplete — especially for some LSE/JSE tickers. The benchmark DCF is illustrative and **not investment advice**.

## Stack

React 19 + TypeScript + Vite + Tailwind frontend; Hono + tRPC backend; Recharts; React Flow.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Production

```bash
npm run build
npm start
# or
docker build -t qmt-fin-atlas . && docker run -p 3000:3000 qmt-fin-atlas
```
