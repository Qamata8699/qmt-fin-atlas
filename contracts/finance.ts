export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export interface OwnershipNode {
  id: string;
  name: string;
  kind: "holder" | "fund" | "company";
  pctHeld?: number;
  position?: number;
  value?: number;
}

export interface Holder {
  name: string;
  pctHeld: number | null;
  position: number | null;
  value: number | null;
  reportDate: string | null;
}

export interface NewsItem {
  title: string;
  publisher: string;
  link: string;
  publishedAt: string;
  summary?: string;
}

export interface DcfResult {
  symbol: string;
  currency: string;
  price: number | null;
  baseFcf: number | null;
  growthRate: number;
  terminalGrowth: number;
  discountRate: number;
  projectionYears: number;
  intrinsicValuePerShare: number | null;
  upsidePct: number | null;
  projectedFcf: { year: number; fcf: number; pv: number }[];
  terminalValuePv: number | null;
  assumptionsNote: string;
}
