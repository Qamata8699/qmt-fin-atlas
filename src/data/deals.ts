export type DealStatus = "completed" | "pending" | "declined";

export interface Deal {
  id: string;
  acquirer: string;
  target: string;
  value: string;
  valueUsdBn?: number;
  announced: string;
  status: DealStatus;
  statusNote: string;
  sector: string;
  story: string;
  lesson?: string;
  acquirerTicker?: string;
  targetTicker?: string;
  flag?: string; // e.g. "ZA" for a South African angle
}

export const DEALS: Deal[] = [
  // ─── PENDING & RUMOURED ───
  {
    id: "mtn-telkom",
    acquirer: "MTN Group",
    target: "Telkom SA",
    value: "≈ R25bn (telkom market value)",
    valueUsdBn: 1.4,
    announced: "2022 talks · revived 2025",
    status: "pending",
    statusNote: "Rumoured — advisers engaged, no formal offer",
    sector: "Telecoms",
    story:
      "MTN walked away from buying Telkom in 2022 over exclusivity disputes and antitrust fears — Telkom's share price fell 25% on the news. In September 2025 Bloomberg reported MTN was considering reviving talks, with Telkom appointing advisers. MTN's CEO publicly denied active negotiations, but Vodacom's approved fibre deal has signalled regulators may now be open to consolidation. A tie-up would create SA's biggest telco with ~63 million subscribers.",
    lesson: "Watch the regulator, not the headline — Vodacom's approval changed the odds.",
    acquirerTicker: "MTN.JO",
    targetTicker: "TKG.JO",
    flag: "ZA",
  },
  {
    id: "paramount-wbd",
    acquirer: "Paramount (Skydance)",
    target: "Warner Bros. Discovery",
    value: "$111bn",
    valueUsdBn: 111,
    announced: "2025–26 bidding war vs Netflix",
    status: "pending",
    statusNote: "Shareholders approved Apr 2026 — regulatory review ongoing",
    sector: "Media",
    story:
      "Paramount's all-cash $31/share offer was declared superior to Netflix's signed deal in February 2026, in one of the most contested media bidding wars ever. WBD shareholders approved in April 2026; the combined HBO / CNN / CBS / Paramount+ library now faces intense antitrust scrutiny before a targeted close.",
    lesson: "A signed deal can still lose to a topping bid — merger agreements have outs.",
    targetTicker: "WBD",
  },
  {
    id: "ea-take-private",
    acquirer: "PIF · Silver Lake · Affinity",
    target: "Electronic Arts",
    value: "$55bn ($210/share)",
    valueUsdBn: 55,
    announced: "Sep 2025",
    status: "pending",
    statusNote: "Signed — largest leveraged take-private ever",
    sector: "Gaming",
    story:
      "A consortium of Saudi Arabia's Public Investment Fund, Silver Lake and Jared Kushner's Affinity Partners agreed to take EA private at $210 per share in cash — the biggest leveraged buyout in history, with $20bn of debt financing. Closing is subject to regulatory approvals including CFIUS review.",
    lesson: "Sovereign wealth is now a first-call buyer of flagship US tech assets.",
    targetTicker: "EA",
  },
  {
    id: "spacex-xai",
    acquirer: "SpaceX",
    target: "xAI",
    value: "reported $250bn",
    valueUsdBn: 250,
    announced: "2026",
    status: "pending",
    statusNote: "Megamerger of the century — structure being finalised",
    sector: "AI / Space",
    story:
      "Elon Musk moved to fold xAI into SpaceX in a reported $250bn combination — embedding the Grok models into Starlink and Starship. If completed as reported, it would be the largest M&A transaction of all time, blending rockets, satellites and frontier AI into one private giant.",
    lesson: "The biggest deals increasingly happen away from public markets.",
  },
  {
    id: "schneider-ptc",
    acquirer: "Schneider Electric",
    target: "PTC Inc",
    value: "$23.7bn EV",
    valueUsdBn: 23.7,
    announced: "Oct 2026",
    status: "pending",
    statusNote: "Announced — all-cash, early October 2026",
    sector: "Industrial software",
    story:
      "Schneider Electric's all-cash acquisition of industrial-software maker PTC, announced at an implied $23.7bn enterprise value, was the largest verified US deal in the first week of October 2026 — a bet on software-defined manufacturing.",
    targetTicker: "PTC",
  },
  {
    id: "vodacom-remgro",
    acquirer: "Vodacom",
    target: "Remgro fibre assets (Maziv)",
    value: "≈ R13bn+ (stake)",
    announced: "Years of talks · approved 2025",
    status: "pending",
    statusNote: "Approved after lengthy competition review — implementation stage",
    sector: "Telecoms",
    story:
      "After years in front of the Competition Commission, Vodacom won approval to acquire a stake in Remgro's fibre business (Dark Fibre Africa / Vumatel via Maziv). The approval is widely read as the signal that reopened the door for MTN's pursuit of Telkom.",
    lesson: "One regulatory green light can re-price an entire sector's deal pipeline.",
    acquirerTicker: "VOD.JO",
    flag: "ZA",
  },

  // ─── COMPLETED ───
  {
    id: "meta-instagram",
    acquirer: "Facebook (Meta)",
    target: "Instagram",
    value: "$1bn",
    valueUsdBn: 1,
    announced: "Apr 2012",
    status: "completed",
    statusNote: "Closed 2012 — ~13 employees at acquisition",
    sector: "Social media",
    story:
      "Mark Zuckerberg bought a 13-person photo app for $1bn two years after launch, just before Facebook's IPO. Instagram is now estimated to generate tens of billions in annual ad revenue — routinely called the best tech acquisition ever made. Meta reportedly explored buying Twitter before and after, but Instagram was the deal that landed.",
    lesson: "Buy the network before the revenue model exists.",
    acquirerTicker: "META",
  },
  {
    id: "meta-whatsapp",
    acquirer: "Facebook (Meta)",
    target: "WhatsApp",
    value: "$19bn",
    valueUsdBn: 19,
    announced: "Feb 2014",
    status: "completed",
    statusNote: "Closed Oct 2014",
    sector: "Messaging",
    story:
      "Facebook paid $19bn — roughly $42 per user at the time — for a messaging app with almost no revenue, outbidding Google which had reportedly offered $10bn. WhatsApp now has ~3 billion users and underpins Meta's business-messaging and payments ambitions.",
    lesson: "Strategic defence can justify almost any price.",
    acquirerTicker: "META",
  },
  {
    id: "msft-activision",
    acquirer: "Microsoft",
    target: "Activision Blizzard",
    value: "$68.7bn",
    valueUsdBn: 68.7,
    announced: "Jan 2022",
    status: "completed",
    statusNote: "Closed Oct 2023 after global regulatory fight",
    sector: "Gaming",
    story:
      "The largest gaming deal ever survived an FTC lawsuit, a UK block, and a restructured cloud-gaming remedy before closing 21 months after announcement. It made Microsoft the world's third-largest gaming company by revenue overnight.",
    lesson: "Big deals can survive regulators — if you're willing to restructure.",
    acquirerTicker: "MSFT",
  },
  {
    id: "broadcom-vmware",
    acquirer: "Broadcom",
    target: "VMware",
    value: "$69bn",
    valueUsdBn: 69,
    announced: "May 2022",
    status: "completed",
    statusNote: "Closed Nov 2023",
    sector: "Enterprise software",
    story:
      "Broadcom's $69bn cash-and-stock purchase of VMware took 18 months of regulatory reviews across the US, EU, UK and China. Post-close, Broadcom aggressively repriced VMware's licensing — a reminder that the acquirer's integration plan matters as much as the deal.",
    acquirerTicker: "AVGO",
  },
  {
    id: "capone-discover",
    acquirer: "Capital One",
    target: "Discover Financial",
    value: "$35.3bn",
    valueUsdBn: 35.3,
    announced: "Feb 2024",
    status: "completed",
    statusNote: "Closed May 2025",
    sector: "Financial services",
    story:
      "Capital One absorbed Discover to own both a card lender and a payments network — a direct challenge to Visa and Mastercard's rails. It closed after Federal Reserve and OCC approval, reshaping US consumer-finance competition.",
    acquirerTicker: "COF",
  },
  {
    id: "nippon-ussteel",
    acquirer: "Nippon Steel",
    target: "U.S. Steel",
    value: "$14.9bn",
    valueUsdBn: 14.9,
    announced: "Dec 2023",
    status: "completed",
    statusNote: "Closed 2025 — with a US government 'golden share'",
    sector: "Steel",
    story:
      "Blocked on national-security grounds and then revived, Nippon Steel's takeover of the iconic American steelmaker only closed after granting the US government veto power over plant closures, name changes and executive moves — a new template for politically sensitive cross-border deals.",
    lesson: "Political capital is now a line item in deal pricing.",
  },
  {
    id: "devon-coterra",
    acquirer: "Devon Energy",
    target: "Coterra Energy",
    value: "$58bn",
    valueUsdBn: 58,
    announced: "Feb 2026",
    status: "completed",
    statusNote: "Completed May 2026",
    sector: "Energy",
    story:
      "A $58bn Permian Basin consolidation that headlined the 2026 megadeal wave — followed immediately by an $8bn buyback programme. Scale in shale is being bought, not drilled.",
    acquirerTicker: "DVN",
  },

  // ─── DECLINED, BLOCKED & MISSED ───
  {
    id: "yahoo-google",
    acquirer: "Yahoo",
    target: "Google",
    value: "$1m (1998) · $3bn (2002)",
    valueUsdBn: 3,
    announced: "1998 & 2002",
    status: "declined",
    statusNote: "Twice declined — the costliest pass in history",
    sector: "Search",
    story:
      "In 1998, Stanford students Larry Page and Sergey Brin offered to sell their PageRank algorithm to Yahoo for $1 million — Yahoo passed. In 2002, Yahoo CEO Terry Semel offered $3bn for Google; the founders wanted $5bn, and Yahoo walked. Google went public in 2004 and is worth trillions today; Yahoo itself was sold to Verizon in 2017 for $4.5bn — less than half its own Google offer.",
    lesson: "The deal you don't do can define you more than the ones you do.",
  },
  {
    id: "nvidia-arm",
    acquirer: "Nvidia",
    target: "Arm (from SoftBank)",
    value: "$40bn",
    valueUsdBn: 40,
    announced: "Sep 2020",
    status: "declined",
    statusNote: "Terminated Feb 2022 — blocked by US/UK/EU regulators",
    sector: "Semiconductors",
    story:
      "Nvidia agreed to buy Arm for $40bn, but regulators on three continents feared one company controlling the architecture behind ~95% of smartphones. Qualcomm and Microsoft lobbied against it; the UK raised national-security concerns. The deal died in February 2022. Arm IPO'd in 2023 — and Nvidia added trillions in market cap anyway, without owning Arm.",
    lesson: "Sometimes the blocked deal still makes you richer.",
    acquirerTicker: "NVDA",
  },
  {
    id: "msft-yahoo",
    acquirer: "Microsoft",
    target: "Yahoo",
    value: "$44.6bn",
    valueUsdBn: 44.6,
    announced: "Feb 2008",
    status: "declined",
    statusNote: "Rejected by Yahoo board — offer withdrawn",
    sector: "Internet",
    story:
      "Microsoft offered $31 per share — a 62% premium — for Yahoo in 2008. Jerry Yang's board held out for more, Microsoft walked, and Yahoo's stock collapsed in the financial crisis. Nine years later Yahoo's core business sold for $4.5bn, roughly a tenth of Microsoft's offer.",
    lesson: "Rejecting a premium bid is also a decision — with a price.",
  },
  {
    id: "zuck-twitter",
    acquirer: "Facebook (Zuckerberg)",
    target: "Twitter",
    value: "≈ $500m (2008 offer)",
    valueUsdBn: 0.5,
    announced: "2008 (approach)",
    status: "declined",
    statusNote: "Approach rebuffed — Twitter chose independence",
    sector: "Social media",
    story:
      "Before Instagram and WhatsApp, Zuckerberg tried to buy Twitter in 2008, reportedly offering around $500m in Facebook stock. Twitter's founders declined. Twitter stayed independent until Elon Musk's chaotic $44bn takeover in 2022 — for nearly 90x the price Facebook once floated.",
    lesson: "The same asset can cost 90x more if you wait a decade.",
  },
  {
    id: "coreweave-cors",
    acquirer: "CoreWeave",
    target: "Core Scientific",
    value: "≈ $9bn (all-stock)",
    valueUsdBn: 9,
    announced: "Jul 2025",
    status: "declined",
    statusNote: "Shareholders voted the deal down — terminated Oct 2025",
    sector: "AI infrastructure",
    story:
      "CoreWeave's ~$9bn all-stock bid for bitcoin-miner-turned-AI-datacentre operator Core Scientific was voted down by target shareholders led by Two Seas Capital, who argued the stock consideration undervalued the AI-infrastructure upside. The agreement was terminated the same day.",
    lesson: "In a hot sector, target shareholders hold real power.",
    targetTicker: "CORZ",
  },
  {
    id: "united-american",
    acquirer: "United Airlines",
    target: "American Airlines",
    value: "undisclosed (approach)",
    announced: "Apr 2026",
    status: "declined",
    statusNote: "Approach declined — pursuit ended",
    sector: "Airlines",
    story:
      "United's CEO confirmed in April 2026 that he had approached American about combining two of the four largest US carriers. American declined to engage, calling the combination anticompetitive, and United ended its pursuit — an approach that never even reached a boardroom negotiation.",
    lesson: "Some industries are consolidated as far as regulators will allow.",
    acquirerTicker: "UAL",
    targetTicker: "AAL",
  },
];

export const STATUS_META: Record<DealStatus, { label: string; blurb: string }> = {
  pending: {
    label: "Pending & rumoured",
    blurb: "Live situations — signed, in talks, or circulating. Anything can still happen.",
  },
  completed: {
    label: "Done deals",
    blurb: "Deals that actually closed — and what they changed.",
  },
  declined: {
    label: "Declined, blocked & missed",
    blurb: "The passes, rejections and regulatory kills — often the most instructive stories.",
  },
};
