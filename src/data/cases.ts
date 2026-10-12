export type CaseCategory =
  | "framework"
  | "profitability"
  | "market-sizing"
  | "mna"
  | "interview-game";

export interface CaseNode {
  label: string;
  children?: CaseNode[];
}

export interface CaseItem {
  id: string;
  title: string;
  category: CaseCategory;
  firm?: string; // which interview this typically shows up in
  prompt: string; // how the interviewer drops it
  body: string[]; // casual-but-sharp explanation paragraphs
  tree?: CaseNode; // optional issue tree
  treeBad?: { label: string; why: string }[]; // what NOT to do
  moves?: string[]; // killer moves / what gets you the offer
  numbers?: { q: string; a: string }[]; // quick mental maths drills
}

export const CATEGORY_META: Record<
  CaseCategory,
  { label: string; blurb: string }
> = {
  framework: {
    label: "Frameworks",
    blurb:
      "The grammar of casing. MECE, issue trees, hypothesis-driven thinking — learn these cold before anything else.",
  },
  profitability: {
    label: "Profitability",
    blurb:
      "\"Profits are down — what do we do?\" The most common case on earth. Revenue vs costs, then drill.",
  },
  "market-sizing": {
    label: "Market sizing",
    blurb:
      "Guesstimates. How many tennis balls fit in a plane, but make it revenue. Structure > precision.",
  },
  mna: {
    label: "M&A / valuation",
    blurb:
      "The Rothschild-flavoured stuff. Should they buy, what's it worth, does the deal actually make sense.",
  },
  "interview-game": {
    label: "Interview game",
    blurb:
      "How to actually run the 30 minutes: opening, structuring out loud, driving the case, landing the recommendation.",
  },
};

export const CASES: CaseItem[] = [
  // ── Frameworks ──────────────────────────────────────────────
  {
    id: "mece",
    title: "MECE — the one rule that runs every case",
    category: "framework",
    firm: "Bain · BCG · McKinsey · Oliver Wyman",
    prompt:
      "Not a case — the operating system underneath all of them. MECE = Mutually Exclusive, Collectively Exhaustive.",
    body: [
      "MECE sounds like consulting jargon because it is — but the idea is dead simple. When you break a problem down, your buckets can't overlap (mutually exclusive) and together they can't leave anything out (collectively exhaustive). No double-counting, no blind spots.",
      "Why do interviewers obsess over it? Because overlapping buckets mean you'll count the same driver twice and chase ghosts. Missing buckets mean you'll 'solve' 60% of the problem and confidently present a wrong answer. MECE is how they check your thinking is clean before they care about your conclusions.",
      "The classic fail: someone gets 'movie theatre profits down' and brainstorms 'ticket prices, marketing, customer experience'. Feels smart, but ticket prices affect customer experience, marketing affects tickets — everything overlaps, and costs are nowhere. That's neither exclusive nor exhaustive. The fix is boring and beautiful: profits = revenue − costs. Revenue splits into tickets and everything that isn't a ticket. Clean, complete, no overlap.",
      "Pro tip: you don't need a fancy framework to be MECE. Maths is automatically MECE — revenue × margin, price × volume, fixed + variable costs. When in doubt, decompose the formula instead of brainstorming themes.",
    ],
    treeBad: [
      { label: "Ticket prices", why: "Overlaps with marketing AND customer experience — a price cut is a marketing move and changes the experience." },
      { label: "Marketing", why: "Overlaps with ticket prices (promos = discounts) and isn't the whole story." },
      { label: "Customer experience", why: "Where do costs live? Nowhere. Not exhaustive." },
    ],
    tree: {
      label: "Profits down",
      children: [
        {
          label: "Revenue",
          children: [
            { label: "Tickets" },
            { label: "Everything that isn't a ticket (concessions, rentals, ads)" },
          ],
        },
        { label: "Costs" },
      ],
    },
    moves: [
      "Say it out loud: \"I'll break this into revenue and costs — that way nothing overlaps and nothing's missed.\" Interviewers literally tick a box when they hear the reasoning, not just the buckets.",
      "When you catch yourself brainstorming vibes (brand, experience, vibes), stop and find the formula instead.",
    ],
  },
  {
    id: "issue-trees",
    title: "Issue trees — draw the problem before you solve it",
    category: "framework",
    firm: "Every firm, first 5 minutes of every case",
    prompt:
      "\"Take a minute to structure your thoughts.\" That's your cue to build a tree.",
    body: [
      "An issue tree is just the problem broken into branches until each leaf is a question you can actually answer with data. 'Why are profits down?' is unanswerable. 'Did ticket volume drop?' is a yes/no you can test.",
      "How to build one in an interview: start with the maths (profits = revenue − costs), then keep splitting until each branch is measurable. Two to three levels is usually plenty — deeper than that and you're showing off, shallower and you're hand-waving.",
      "Then — and this is where most candidates fumble — prioritise. Don't walk every branch like you're reading a menu. Say which branch you'd attack first and why: \"Costs are usually stickier, and a 20% drop that fast smells like a revenue problem, so I'd start there.\" That's hypothesis-driven thinking, and it's the actual thing they're scoring.",
    ],
    moves: [
      "Narrate as you draw: \"First level is the maths, second level is where the leak could be.\"",
      "Always end the structure with a hypothesis and a first move — never just sit there next to a pretty tree.",
    ],
  },
  {
    id: "hypothesis-driven",
    title: "Hypothesis-driven — have a take, then test it",
    category: "framework",
    firm: "McKinsey especially (answer-first culture)",
    prompt:
      "\"So — what do you think is going on?\" They ask this earlier than you expect.",
    body: [
      "Consulting runs on having a point of view early, then letting data beat it up. The opposite — gathering every fact before forming any opinion — is what academics do, and it's way too slow for a 30-minute case or a 3-month engagement.",
      "In practice: after your structure, take a stance. \"My hypothesis is this is a revenue-side problem, specifically volume, because a 20% drop in one year is rarely a cost story — costs don't spike that fast unless something broke.\" Then every question you ask is aimed at proving or killing that hypothesis.",
      "Being wrong is fine. Being directionless is not. If the data kills your hypothesis, say so and pivot out loud: \"Okay, revenue's flat — hypothesis dead, moving to the cost side.\" That sentence is worth more than ten correct guesses, because it shows you update instead of anchoring.",
    ],
    moves: [
      "State hypothesis + reason + first test, in one breath.",
      "Narrate pivots. \"Killing that branch, here's why, moving on\" is music to an interviewer's ears.",
    ],
  },

  // ── Profitability ───────────────────────────────────────────
  {
    id: "movie-theatre",
    title: "The movie theatre case — profits down 20%",
    category: "profitability",
    firm: "Bain classic",
    prompt:
      "\"Our client is a movie theatre chain. Their profits are down 20%. What should they do?\"",
    body: [
      "This is THE canonical profitability case, and the trap is baked into the prompt: 'what should they do?' invites you to jump straight to solutions — loyalty apps, better popcorn, dynamic pricing. Don't. You have no idea what's broken yet. Diagnose first, prescribe second.",
      "Structure it with the maths: profits = revenue − costs. Revenue for a theatre splits cleanly into tickets and everything-that-isn't-a-ticket (concessions, rentals, advertising). Then drill tickets further: is it fewer people coming, or the same people coming less often? Those are totally different diseases — the first is competition/relevance (streaming ate the casual moviegoer), the second is habit and product (nothing worth watching, bad experience).",
      "On the cost side, check rent (theatres are real-estate heavy), staffing, and film licensing fees — and ask whether costs rose or just stayed flat while revenue fell. A fixed-cost business with falling revenue is where margins go to die: rent doesn't care that Netflix had a good year.",
      "Then — and only then — recommend. If it's a volume problem: pricing experiments, event screenings, premium formats, concessions bundles. If it's cost-side: renegotiate leases, flex staffing to showtimes. Notice how the recommendations only make sense after the tree tells you which world you're in.",
    ],
    tree: {
      label: "Profits down 20%",
      children: [
        {
          label: "Revenue",
          children: [
            {
              label: "Tickets",
              children: [
                { label: "Fewer people coming? (streaming, competition)" },
                { label: "Same people, less often? (product, habit)" },
              ],
            },
            {
              label: "Everything that isn't a ticket",
              children: [{ label: "Concessions" }, { label: "Rentals" }, { label: "Ads" }],
            },
          ],
        },
        {
          label: "Costs",
          children: [
            { label: "Rent / leases (fixed)" },
            { label: "Staffing (semi-variable)" },
            { label: "Film licensing" },
          ],
        },
      ],
    },
    moves: [
      "Resist the prompt's bait — never answer 'what should they do' before you've found what's wrong.",
      "Quantify as you go: \"20% is big — a fixed-cost base means a modest revenue drop can do that on its own.\"",
      "Tie the final recommendation back to the branch that was actually broken. That's what 'structured thinking' means in practice.",
    ],
  },
  {
    id: "profit-decline-generic",
    title: "The universal profitability playbook",
    category: "profitability",
    firm: "All firms — this template covers ~half of all cases",
    prompt:
      "Any flavour of: \"profits/margins are down / the CEO is worried / should they be?\"",
    body: [
      "Every profitability case is the movie theatre case wearing a different outfit. The skeleton never changes: profits = revenue − costs. Revenue = price × volume. Costs = fixed + variable. Memorise that and you already have a MECE structure for half the cases on earth.",
      "The diagnostic rhythm: (1) Revenue or cost side? (2) If revenue — price or volume? (3) If volume — market shrinking or share being stolen? (4) If costs — which line moved, and is it a one-off or structural? Each answer narrows the tree until you're left with one smoking gun.",
      "Two upgrades that separate good from great. First, segment: don't analyse 'revenue', analyse revenue by product line / region / customer type — averages hide the body. Second, benchmark: \"down 20%\" means nothing until you ask whether the whole industry is down 30% (in which case they're winning) or up 10% (in which case it's definitely them).",
      "For the recommendation, think in three horizons: stop the bleeding (quick pricing/cost moves), fix the engine (mix, channels, contracts), and rethink the game (new segments, M&A, exit). Even a rough nod to sequencing makes you sound like you've done this before.",
    ],
    tree: {
      label: "Profits down",
      children: [
        {
          label: "Revenue = price × volume",
          children: [
            { label: "Price (discounting? mix shift?)" },
            { label: "Volume (market shrinking? share loss?)" },
          ],
        },
        {
          label: "Costs = fixed + variable",
          children: [
            { label: "Fixed (rent, salaries, depreciation)" },
            { label: "Variable (inputs, logistics, commissions)" },
          ],
        },
      ],
    },
    moves: [
      "Always ask \"is it us or the whole market?\" in the first five minutes.",
      "Segment before you conclude. The average is a liar.",
    ],
  },

  // ── Market sizing ───────────────────────────────────────────
  {
    id: "sizing-method",
    title: "Market sizing — structure beats accuracy, every time",
    category: "market-sizing",
    firm: "BCG and Bain love these; Oliver Wyman quant rounds too",
    prompt:
      "\"How many cups of coffee are sold in Joburg every day?\" / \"Size the market for X.\"",
    body: [
      "Nobody knows the answer. The interviewer doesn't know the answer. They're scoring whether you can build a clean equation out of thin air and keep your arithmetic audible. A wrong answer with a beautiful structure beats a lucky guess with none.",
      "The recipe: (1) Clarify what's being asked — revenue or units, per day or per year, who's included. (2) Write the equation before touching numbers, e.g. cups/day = population × % coffee drinkers × cups per drinker per day. (3) Plug in round, defensible numbers and SAY them as you go — silent maths is unscoreable maths. (4) Sanity-check at the end: does the answer pass the laugh test?",
      "Top-down vs bottom-up: top-down starts from a big known number and filters down (population → drinkers → cups). Bottom-up builds from one unit (one café, one street) and scales up. Pick whichever has a firmer anchor — and if you have time, do the other as a cross-check and watch the interviewer nod.",
      "Round aggressively and own it: \"8 million people in Joburg, call it 60% adults, half of them drink coffee daily, average 1.5 cups — that's about 3.6 million cups a day.\" Clean numbers, clean logic, done in three minutes.",
    ],
    moves: [
      "Equation first, numbers second. Always.",
      "Verbalise every step — \"so that's 8m × 0.6 × 0.5 × 1.5\" — so they can follow and correct you (them correcting you is GOOD, it means they're engaged).",
      "End with a sanity check: \"roughly one cup per adult per day — feels plausible.\"",
    ],
    numbers: [
      { q: "SA population for sizings?", a: "~60 million. Joburg ~8m, Cape Town ~5m, Durban ~4m. Anchor with these." },
      { q: "8m × 60% × 50% × 1.5?", a: "3.6m. Do the 8 × 0.6 × 0.5 = 2.4 first, then × 1.5 = 3.6. Chain easy steps." },
      { q: "15% of R240bn?", a: "10% is 24, 5% is 12, so R36bn. Always split percentages into 10s and 5s." },
    ],
  },

  // ── M&A / valuation ─────────────────────────────────────────
  {
    id: "ma-deal-case",
    title: "The M&A case — should they actually do the deal?",
    category: "mna",
    firm: "Rothschild · BCG (they run corp-dev cases) · Bain PEG-adjacent",
    prompt:
      "\"Our client is considering acquiring Company X. Should they?\" / \"What would you pay for it?\"",
    body: [
      "M&A cases feel fancy but the skeleton is simple: does this deal create value, for whom, and at what price? Your tree has three big branches — strategic fit (why buy at all), financial sense (what's it worth, what are the synergies), and feasibility/risks (can they fund it, will regulators allow it, can they integrate it).",
      "Strategic fit first: why this target, why now? Acquiring for scale (cost synergies), for capability (buying tech/talent you can't build), or for market access (the target owns a customer base you can't reach). If the 'why' is weak — empire building, CEO ego, 'synergies' with no mechanism — the deal dies right there, and saying so is a strong answer.",
      "Then the money. Valuation anchors: a quick DCF (what are the future cash flows worth today), trading comps (what multiples do similar listed companies fetch — EV/EBITDA is the workhorse), and precedent transactions (what did buyers actually pay for similar targets). Add synergies on top — revenue synergies (cross-selling) are soft and often over-promised; cost synergies (cutting overlap) are harder and more bankable. The deal only creates value for the acquirer if the price paid is less than standalone value + their share of synergies. Overpay, and all the value flows to the target's shareholders — this is the 'winner's curse', and it killed a stunning number of famous deals (check the Deal Room for the graveyard).",
      "Feasibility last but lethal: funding (cash, debt — what's that do to leverage and the rating?), regulation (competition commissions kill deals — MTN and Telkom know this well), and integration (most synergies die in execution, culture clashes are real).",
    ],
    tree: {
      label: "Should they buy X?",
      children: [
        { label: "Strategic fit (scale? capability? market access?)", children: [] },
        {
          label: "Financial sense",
          children: [
            { label: "Standalone value (DCF / comps / precedents)" },
            { label: "Synergies (cost = bankable, revenue = soft)" },
            { label: "Price vs value (winner's curse)" },
          ],
        },
        {
          label: "Feasibility & risks",
          children: [
            { label: "Funding & leverage" },
            { label: "Regulators / competition" },
            { label: "Integration risk" },
          ],
        },
      ],
    },
    moves: [
      "Give a verdict. \"Yes at up to R12bn, no above that\" beats ten pages of analysis with no answer.",
      "Mention the winner's curse unprompted and watch the Rothschild interviewer sit up.",
      "Tie it to a real deal you know — the Deal Room tab exists for exactly this.",
    ],
  },
  {
    id: "valuation-basics",
    title: "Valuation in 90 seconds — the three anchors",
    category: "mna",
    firm: "Rothschild technicals, plus any 'what's it worth' moment",
    prompt:
      "\"How would you value this company?\" — sometimes the whole case, sometimes a curveball mid-case.",
    body: [
      "There are three anchors, and you should be able to rattle them off in your sleep. One: DCF — the company is worth the sum of its future free cash flows, discounted back to today at the WACC. Fundamental, but only as good as your assumptions — garbage WACC, garbage answer. (Our DCF Benchmark tab does exactly this live, go play with it.)",
      "Two: trading comps — similar listed companies trade at some multiple, e.g. 8× EV/EBITDA, so this one should be in that postcode. Fast, market-real, but it imports whatever mood the market is in. Three: precedent transactions — what buyers actually PAID for similar targets, which usually includes a control premium of 20–40% over trading levels. For M&A, precedents are king because they reflect what control is actually worth.",
      "Enterprise value vs equity value trips everyone: EV is the whole business (market cap + debt − cash); equity value is just what's left for shareholders. Multiples like EV/EBITDA pair with EV; P/E pairs with equity. Mismatch them and your valuation is nonsense — interviewers plant this trap on purpose.",
      "If asked for a number in an interview: triangulate. \"Comps say 8×, precedents say 10× with control premium, my quick DCF lands in between — I'd anchor around R9–11bn and negotiate hard below that.\"",
    ],
    moves: [
      "Name all three methods, then say which you'd trust most for THIS situation and why.",
      "EV vs equity value — get the pairing right every single time.",
    ],
  },

  // ── Interview game ──────────────────────────────────────────
  {
    id: "running-the-case",
    title: "Running the 30 minutes — the meta-game",
    category: "interview-game",
    firm: "All firms",
    prompt: "No prompt — this is how you play the whole thing.",
    body: [
      "Opening (first 2 minutes): repeat the prompt back in your own words, ask 2–3 clarifying questions (what counts as success — profit, share, revenue? what timeframe? any constraints?), then ask for a moment to structure. Taking 60–90 seconds of silence to build your tree is not awkward, it's expected. Rushing in is the actual red flag.",
      "Middle (the engine): you're driving, not the interviewer. Work the tree branch by branch, say where you're going and why before you ask for data (\"costs look flat, so I want to drill revenue — do we know how price vs volume split?\"). When they hand you an exhibit, say what you see before you analyse: headline first, then the detail that matters.",
      "The maths moments: do them out loud, round shamelessly, label your units. If you blank, say so and restructure the calculation — silence plus scribbling is the only truly losing move.",
      "Closing (last 3 minutes): they'll say 'the CEO walks in, what do you tell her?' Structure it: recommendation FIRST (answer-first, always), then the 2–3 supporting reasons, then risks and next steps. Thirty seconds, max. \"They should renegotiate the two big leases and launch premium screenings — because the drop is revenue-side, volume-driven, and fixed costs are amplifying it. Risks: execution and streaming headwinds; next step is a pricing pilot in three locations.\" That paragraph is the offer.",
    ],
    moves: [
      "Clarify → structure → hypothesise → drive → land. Five beats, every case.",
      "Answer-first on every conclusion, not just the final one.",
      "Be someone they'd enjoy staffing for 12 weeks. Energy and coachability genuinely count.",
    ],
  },
  {
    id: "fit-pepi",
    title: "The non-case half — fit & your story",
    category: "interview-game",
    firm: "Bain is famous for PEI-style digging; everyone does some",
    prompt:
      "\"Tell me about yourself.\" / \"Why consulting?\" / \"Tell me about a time you led through conflict.\"",
    body: [
      "Half your interview isn't casing. Bain in particular will take one story and excavate it for ten minutes — every decision, every conversation, what you'd do differently. Surface-level answers die here; they want the actual internal reasoning.",
      "Build a story bank of 5–6 stories that cover: leadership, conflict, failure, impact, and a time you changed your mind. Tell each in STAR but keep the Situation/Task to one breath — the Action is where the marks are, and end every story with what you learned or do differently now. Self-awareness is the cheat code.",
      "\"Why consulting / why us\" needs a specific, non-generic answer. 'I like problem solving and travel' is what everyone says. Better: name the kind of problem, the firm's actual angle (Bain's results obsession, BCG's thought leadership, OW's quant depth, Rothschild's pure advisory model), and a person or project you genuinely know about. And yes — 'why Rothschild' for a deal-heads shop should include your actual interest in deals. You literally have a Deal Room. Use it.",
    ],
    moves: [
      "Story bank: leadership, conflict, failure, impact, mind-change — 2 minutes each, lessons at the end.",
      "Prep one story you can survive ten minutes of follow-up questions on. That's the Bain test.",
    ],
  },
];
