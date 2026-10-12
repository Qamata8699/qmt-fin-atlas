export type DealStatus = "completed" | "pending" | "declined";

export interface Deal {
  id: string;
  title: string;
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
    title: "MTN keeps circling Telkom like a hawk",
    acquirer: "MTN Group",
    target: "Telkom SA",
    value: "≈ R25bn (Telkom's market value)",
    valueUsdBn: 1.4,
    announced: "2022 talks · revived 2025",
    status: "pending",
    statusNote: "Rumoured — advisers in the room, no formal offer yet",
    sector: "Telecoms",
    story:
      "Back in 2022 MTN tried to buy Telkom, it fell apart over exclusivity drama and competition fears, and Telkom's share price fell off a cliff — down 25% in a day. Fast forward to September 2025: Bloomberg says MTN is sniffing around again, Telkom has hired advisers, and MTN's CEO is out here saying 'talks? what talks?' Classic. But here's the thing — Vodacom got its fibre deal approved, which basically tells everyone the regulators are finally in a mood to say yes. If this lands, you get SA's biggest telco with roughly 63 million subscribers.",
    lesson: "Watch the regulator, not the CEO's denial. Vodacom's approval changed everything.",
    acquirerTicker: "MTN.JO",
    targetTicker: "TKG.JO",
    flag: "ZA",
  },
  {
    id: "paramount-wbd",
    title: "The $111bn media bar fight Netflix lost",
    acquirer: "Paramount (Skydance)",
    target: "Warner Bros. Discovery",
    value: "$111bn",
    valueUsdBn: 111,
    announced: "2025–26 bidding war vs Netflix",
    status: "pending",
    statusNote: "Shareholders said yes Apr 2026 — regulators still chewing",
    sector: "Media",
    story:
      "Netflix literally had a signed deal for Warner Bros. Discovery. Done and dusted, right? Nope. Paramount crashed in with an all-cash $31-a-share offer, the board called it the 'superior proposal' in Feb 2026, and Netflix got bounced at the door. WBD shareholders approved in April. Now HBO, CNN, CBS and Paramount+ under one roof just has to survive the antitrust people, who are very much awake.",
    lesson: "A signed deal isn't a closed deal. There's always room for a richer ex to show up.",
    targetTicker: "WBD",
  },
  {
    id: "ea-take-private",
    title: "Saudi money just bought FIFA and The Sims for $55bn",
    acquirer: "PIF · Silver Lake · Affinity",
    target: "Electronic Arts",
    value: "$55bn ($210/share)",
    valueUsdBn: 55,
    announced: "Sep 2025",
    status: "pending",
    statusNote: "Signed — biggest leveraged buyout in history",
    sector: "Gaming",
    story:
      "Saudi Arabia's sovereign wealth fund teamed up with Silver Lake and Jared Kushner's outfit to take EA — FIFA, Madden, The Sims, all of it — private at $210 a share, cash. Fifty-five billion dollars. The biggest leveraged buyout ever done, with $20bn of it borrowed. All that's left is the regulators, including the US foreign-investment committee, giving the nod.",
    lesson: "Sovereign wealth funds aren't passive investors anymore — they're buying the whole shop.",
    targetTicker: "EA",
  },
  {
    id: "spacex-xai",
    title: "Elon is merging his rockets with his chatbot",
    acquirer: "SpaceX",
    target: "xAI",
    value: "reported $250bn",
    valueUsdBn: 250,
    announced: "2026",
    status: "pending",
    statusNote: "Megamerger of the century — structure being figured out",
    sector: "AI / Space",
    story:
      "Musk is folding xAI — the Grok people — into SpaceX in a deal reportedly worth $250bn. Rockets, Starlink satellites and a frontier AI lab in one private company. If it closes as reported, it's literally the biggest M&A transaction in history, and almost nobody outside Elon's cap table gets a say in it.",
    lesson: "The biggest deals now happen in private markets where normal investors can't touch them.",
  },
  {
    id: "schneider-ptc",
    title: "A French giant quietly dropped $24bn on factory software",
    acquirer: "Schneider Electric",
    target: "PTC Inc",
    value: "$23.7bn EV",
    valueUsdBn: 23.7,
    announced: "Oct 2026",
    status: "pending",
    statusNote: "Announced — all-cash, early October 2026",
    sector: "Industrial software",
    story:
      "While everyone was watching the AI circus, Schneider Electric walked up with an all-cash offer for PTC — the industrial-software company — at a $23.7bn enterprise value. Biggest verified US deal in the first week of October 2026. The bet: factories of the future run on software, and Schneider wants to own the stack.",
    lesson: "The boring-sounding deals are often the smartest ones.",
    targetTicker: "PTC",
  },
  {
    id: "vodacom-remgro",
    title: "Vodacom's fibre deal — the one that reopened everything",
    acquirer: "Vodacom",
    target: "Remgro fibre assets (Maziv)",
    value: "≈ R13bn+ (stake)",
    announced: "Years of talks · approved 2025",
    status: "pending",
    statusNote: "Approved after a marathon competition review — implementing now",
    sector: "Telecoms",
    story:
      "Vodacom spent YEARS in front of the Competition Commission trying to buy into Remgro's fibre empire — Dark Fibre Africa and Vumatel, via Maziv. It finally got the green light. Why does it matter beyond fibre? Because that approval is exactly what made MTN think 'maybe the Telkom deal isn't dead after all.' One regulator's yes can wake up a whole sector.",
    lesson: "One green light from the regulator can re-price every deal in the sector.",
    acquirerTicker: "VOD.JO",
    flag: "ZA",
  },

  // ─── COMPLETED ───
  {
    id: "meta-instagram",
    title: "Zuck bought 13 employees for $1bn — and won the internet",
    acquirer: "Facebook (Meta)",
    target: "Instagram",
    value: "$1bn",
    valueUsdBn: 1,
    announced: "Apr 2012",
    status: "completed",
    statusNote: "Closed 2012 — ~13 employees at the time",
    sector: "Social media",
    story:
      "In 2012 Zuckerberg paid a billion dollars for a photo app with thirteen employees and zero revenue, days before Facebook's own IPO. People thought he'd lost it. Instagram now makes tens of billions a year in ads and is basically the reason Meta survived the TikTok era. People still argue about the best tech acquisition ever — this one's usually the answer.",
    lesson: "Buy the network before the revenue shows up. Revenue follows attention.",
    acquirerTicker: "META",
  },
  {
    id: "meta-whatsapp",
    title: "$19bn for an app that made no money",
    acquirer: "Facebook (Meta)",
    target: "WhatsApp",
    value: "$19bn",
    valueUsdBn: 19,
    announced: "Feb 2014",
    status: "completed",
    statusNote: "Closed Oct 2014",
    sector: "Messaging",
    story:
      "Facebook dropped $19bn — about $42 per user — on a messaging app that barely made a cent. Google reportedly offered $10bn and Zuck just doubled down. Why? Because whoever owns messaging owns the phone home screen. WhatsApp now has around 3 billion users and is quietly becoming Meta's business-messaging and payments machine.",
    lesson: "Sometimes you're not buying a business — you're buying the moat.",
    acquirerTicker: "META",
  },
  {
    id: "msft-activision",
    title: "Microsoft fought the whole world for Call of Duty — and won",
    acquirer: "Microsoft",
    target: "Activision Blizzard",
    value: "$68.7bn",
    valueUsdBn: 68.7,
    announced: "Jan 2022",
    status: "completed",
    statusNote: "Closed Oct 2023 after a global regulatory brawl",
    sector: "Gaming",
    story:
      "Biggest gaming deal ever, and it nearly died about four times. The FTC sued, the UK straight-up blocked it, and Microsoft had to restructure the whole thing — handing off cloud-gaming rights — to get it through. Twenty-one months after announcing, it closed. Microsoft became the third-biggest gaming company on Earth overnight.",
    lesson: "Deals this size can survive regulators — if you're stubborn enough to restructure.",
    acquirerTicker: "MSFT",
  },
  {
    id: "broadcom-vmware",
    title: "Broadcom paid $69bn, then jacked up the prices",
    acquirer: "Broadcom",
    target: "VMware",
    value: "$69bn",
    valueUsdBn: 69,
    announced: "May 2022",
    status: "completed",
    statusNote: "Closed Nov 2023",
    sector: "Enterprise software",
    story:
      "Broadcom bought VMware for $69bn in cash and stock after eighteen months of reviews in the US, EU, UK and China. Then came the part customers remember: aggressive repricing and bundling of VMware licences. The deal made Broadcom a software monster — and made a lot of IT departments very angry.",
    lesson: "The acquisition is only half the story. Watch what the buyer does after.",
    acquirerTicker: "AVGO",
  },
  {
    id: "capone-discover",
    title: "Capital One bought itself a payments network",
    acquirer: "Capital One",
    target: "Discover Financial",
    value: "$35.3bn",
    valueUsdBn: 35.3,
    announced: "Feb 2024",
    status: "completed",
    statusNote: "Closed May 2025",
    sector: "Financial services",
    story:
      "Every card lender rents the rails from Visa or Mastercard. Capital One looked at that and said 'what if we just owned some rails?' — and bought Discover, lender AND network in one. Regulators signed off in 2025 and US consumer finance hasn't quite been the same since.",
    lesson: "Owning the infrastructure beats renting it.",
    acquirerTicker: "COF",
  },
  {
    id: "nippon-ussteel",
    title: "Japan bought US Steel — but America kept the keys",
    acquirer: "Nippon Steel",
    target: "U.S. Steel",
    value: "$14.9bn",
    valueUsdBn: 14.9,
    announced: "Dec 2023",
    status: "completed",
    statusNote: "Closed 2025 — with a US government 'golden share'",
    sector: "Steel",
    story:
      "This deal got blocked on national-security grounds, came back from the dead, and only closed because Nippon Steel agreed to hand the US government veto power over plant closures, name changes and executive moves. A Japanese company owns US Steel, but Washington can still say no to big decisions. Wild template for cross-border deals.",
    lesson: "Politics is now a line item in the price of a deal.",
  },
  {
    id: "devon-coterra",
    title: "Two shale giants became one $58bn beast",
    acquirer: "Devon Energy",
    target: "Coterra Energy",
    value: "$58bn",
    valueUsdBn: 58,
    announced: "Feb 2026",
    status: "completed",
    statusNote: "Completed May 2026",
    sector: "Energy",
    story:
      "Devon and Coterra tied up in a $58bn Permian Basin mega-merger — one of the headline deals of the 2026 wave — then immediately announced an $8bn buyback, because apparently they weren't done flexing. In shale these days, scale is bought, not drilled.",
    lesson: "When an industry stops growing, it starts merging.",
    acquirerTicker: "DVN",
  },

  // ─── DECLINED, BLOCKED & MISSED ───
  {
    id: "blackberry-collapse",
    title: "How BlackBerry fumbled the entire smartphone game",
    acquirer: "Everyone (Apple, Samsung)",
    target: "BlackBerry's empire",
    value: "$80bn+ market cap — gone",
    announced: "2007–2013",
    status: "declined",
    statusNote: "No single deal — just the costliest shrug in tech",
    sector: "Smartphones",
    story:
      "In 2007 BlackBerry WAS the phone. CrackBerry. CEOs, presidents, everyone. Then the iPhone launched and BlackBerry's bosses literally laughed — 'a touchscreen? no keyboard? cute toy.' By the time they panicked and launched the Z10 in 2013, the game was over. Market cap went from $80bn+ to pocket change, and today BlackBerry makes car software and cybersecurity tools. The company didn't get bought — it just got ignored to death.",
    lesson: "The deal that kills you is the one you never took seriously.",
  },
  {
    id: "nokia-fall",
    title: "When Nokia used to be THE phone… vs now",
    acquirer: "Microsoft",
    target: "Nokia's phone business",
    value: "$7.2bn (2014)",
    valueUsdBn: 7.2,
    announced: "Sep 2013",
    status: "completed",
    statusNote: "Sold to Microsoft — which then wrote it all off",
    sector: "Mobile",
    story:
      "Nokia once sold nearly half the phones on the planet. HALF. Then it bet on Windows Phone instead of Android — arguably the worst platform decision in tech history. Microsoft bought the whole handset business for $7.2bn in 2014, couldn't save it, and wrote off basically the entire thing a year later. Nokia still exists — making network equipment — but the Nokia that ruled your pocket is gone.",
    lesson: "Being the king means nothing if you pick the wrong horse for the next race.",
    acquirerTicker: "MSFT",
  },
  {
    id: "yahoo-google",
    title: "How Yahoo fumbled a trillion-dollar bag — twice",
    acquirer: "Yahoo",
    target: "Google",
    value: "$1m (1998) · $3bn (2002)",
    valueUsdBn: 3,
    announced: "1998 & 2002",
    status: "declined",
    statusNote: "Passed twice — the most expensive 'no thanks' ever",
    sector: "Search",
    story:
      "1998: two Stanford kids offer to sell Yahoo their search algorithm for ONE MILLION DOLLARS. Yahoo says no. 2002: Yahoo offers $3bn for Google, the founders counter at $5bn, and Yahoo walks away over $2bn. Google IPO'd in 2004 and is worth trillions today. Yahoo? Sold to Verizon in 2017 for $4.5bn — less than half of what it once offered for Google. You cannot make this up.",
    lesson: "The deal you don't do can haunt you harder than any deal you do.",
  },
  {
    id: "nvidia-arm",
    title: "Regulators body-slammed Nvidia's $40bn Arm deal",
    acquirer: "Nvidia",
    target: "Arm (from SoftBank)",
    value: "$40bn",
    valueUsdBn: 40,
    announced: "Sep 2020",
    status: "declined",
    statusNote: "Terminated Feb 2022 — blocked on three continents",
    sector: "Semiconductors",
    story:
      "Nvidia tried to buy Arm — the chip design inside ~95% of smartphones — for $40bn. Regulators in the US, UK and EU all basically said 'absolutely not, one company can't own that.' Qualcomm and Microsoft lobbied against it, the UK cried national security, and in Feb 2022 the deal died. Arm IPO'd in 2023. Plot twist: Nvidia added trillions in market cap anyway, without owning a single share of Arm.",
    lesson: "Sometimes losing the deal is the best thing that ever happens to you.",
    acquirerTicker: "NVDA",
  },
  {
    id: "msft-yahoo",
    title: "Yahoo said no to $44.6bn… then sold for $4.5bn",
    acquirer: "Microsoft",
    target: "Yahoo",
    value: "$44.6bn",
    valueUsdBn: 44.6,
    announced: "Feb 2008",
    status: "declined",
    statusNote: "Board rejected it — offer withdrawn",
    sector: "Internet",
    story:
      "Microsoft offered Yahoo $31 a share — a 62% premium — in 2008. Jerry Yang's board held out for more, Microsoft said 'cool, never mind' and walked. Then the financial crisis hit and Yahoo's stock got destroyed. Nine years later the core business sold for $4.5bn. They turned down forty-four and ended up with four. Ouch.",
    lesson: "Rejecting a fat premium is also a decision. Sometimes the worst one.",
  },
  {
    id: "zuck-twitter",
    title: "Zuck tried to buy Twitter for $500m. Musk paid $44bn.",
    acquirer: "Facebook (Zuckerberg)",
    target: "Twitter",
    value: "≈ $500m (2008 offer)",
    valueUsdBn: 0.5,
    announced: "2008 (approach)",
    status: "declined",
    statusNote: "Twitter said no — stayed independent till 2022",
    sector: "Social media",
    story:
      "Before Instagram and WhatsApp, a young Zuckerberg came knocking for Twitter in 2008, reportedly waving about $500m in Facebook stock. Twitter's founders told him to get lost. Twitter stayed independent for fourteen more years — until Elon Musk showed up in 2022 and paid $44bn for it, nearly ninety times the price Zuck once floated. Timing really is everything.",
    lesson: "Same asset, fourteen years later: 90x the price.",
  },
  {
    id: "coreweave-cors",
    title: "Shareholders told a $9bn offer to get lost",
    acquirer: "CoreWeave",
    target: "Core Scientific",
    value: "≈ $9bn (all-stock)",
    valueUsdBn: 9,
    announced: "Jul 2025",
    status: "declined",
    statusNote: "Voted down by shareholders — dead same day",
    sector: "AI infrastructure",
    story:
      "CoreWeave offered ~$9bn in stock for Core Scientific — a bitcoin miner that pivoted into AI data centres. The target's own shareholders, led by Two Seas Capital, looked at the AI boom and said 'our data centres are worth more than that' — and voted the deal DOWN. Agreement terminated the same day. In a hot market, even $9bn can be an insult.",
    lesson: "When the sector's on fire, shareholders hold the real power.",
    targetTicker: "CORZ",
  },
  {
    id: "united-american",
    title: "United shot its shot at American Airlines — got curved",
    acquirer: "United Airlines",
    target: "American Airlines",
    value: "undisclosed (approach)",
    announced: "Apr 2026",
    status: "declined",
    statusNote: "Approach declined — pursuit over before it started",
    sector: "Airlines",
    story:
      "United's CEO confirmed in April 2026 that he approached American about merging two of America's four biggest carriers. American's response was basically 'that's anticompetitive and also no.' United ended the pursuit right there. Never even made it to a boardroom. Some industries are just done consolidating — the regulators would never allow it anyway.",
    lesson: "Some doors are closed before you even knock.",
    acquirerTicker: "UAL",
    targetTicker: "AAL",
  },
];

export const STATUS_META: Record<DealStatus, { label: string; blurb: string }> = {
  pending: {
    label: "Pending & rumoured",
    blurb: "Still cooking — signed, in talks, or just whispers. Anything can happen.",
  },
  completed: {
    label: "Done deals",
    blurb: "Deals that actually closed — for better or worse.",
  },
  declined: {
    label: "Fumbles, blocks & near-misses",
    blurb: "The passes, rejections and regulator kills. Honestly, the best stories.",
  },
};
