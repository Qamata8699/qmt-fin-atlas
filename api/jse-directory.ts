// Curated JSE directory — guarantees South African companies are always searchable,
// even when Yahoo's free search API ignores .JO tickers or is rate-limited.
// Names include common aliases so "pick n pay", "shoprite", "checkers" etc. all hit.

export interface DirEntry {
  symbol: string;
  name: string;
  exchange: "JSE" | "LSE";
  aliases?: string[];
}

export const JSE_DIRECTORY: DirEntry[] = [
  { symbol: "SHP.JO", name: "Shoprite Holdings Ltd", exchange: "JSE", aliases: ["shoprite", "checkers", "usave"] },
  { symbol: "PIK.JO", name: "Pick n Pay Stores Ltd", exchange: "JSE", aliases: ["pick n pay", "picknpay", "pnp", "boxer"] },
  { symbol: "SPP.JO", name: "The Spar Group Ltd", exchange: "JSE", aliases: ["spar"] },
  { symbol: "WHL.JO", name: "Woolworths Holdings Ltd", exchange: "JSE", aliases: ["woolworths", "woolies"] },
  { symbol: "TFG.JO", name: "The Foschini Group Ltd", exchange: "JSE", aliases: ["foschini", "tfg"] },
  { symbol: "TRU.JO", name: "Truworths International Ltd", exchange: "JSE", aliases: ["truworths"] },
  { symbol: "MRP.JO", name: "Mr Price Group Ltd", exchange: "JSE", aliases: ["mr price", "mrp"] },
  { symbol: "PEP.JO", name: "Pepkor Holdings Ltd", exchange: "JSE", aliases: ["pep", "pepkor", "ackermans"] },
  { symbol: "CLS.JO", name: "Clicks Group Ltd", exchange: "JSE", aliases: ["clicks"] },
  { symbol: "DCP.JO", name: "Dis-Chem Pharmacies Ltd", exchange: "JSE", aliases: ["dis-chem", "dischem"] },

  { symbol: "SBK.JO", name: "Standard Bank Group Ltd", exchange: "JSE", aliases: ["standard bank", "stanbic"] },
  { symbol: "FSR.JO", name: "FirstRand Ltd", exchange: "JSE", aliases: ["firstrand", "fnb", "rmb"] },
  { symbol: "NED.JO", name: "Nedbank Group Ltd", exchange: "JSE", aliases: ["nedbank"] },
  { symbol: "ABG.JO", name: "Absa Group Ltd", exchange: "JSE", aliases: ["absa", "barclays africa"] },
  { symbol: "CPI.JO", name: "Capitec Bank Holdings Ltd", exchange: "JSE", aliases: ["capitec"] },
  { symbol: "INL.JO", name: "Investec Ltd", exchange: "JSE", aliases: ["investec"] },
  { symbol: "DSY.JO", name: "Discovery Ltd", exchange: "JSE", aliases: ["discovery", "vitality"] },
  { symbol: "SLM.JO", name: "Sanlam Ltd", exchange: "JSE", aliases: ["sanlam"] },
  { symbol: "OMU.JO", name: "Old Mutual Ltd", exchange: "JSE", aliases: ["old mutual"] },
  { symbol: "OUT.JO", name: "OUTsurance Group Ltd", exchange: "JSE", aliases: ["outsurance"] },

  { symbol: "NPN.JO", name: "Naspers Ltd", exchange: "JSE", aliases: ["naspers", "prosus parent"] },
  { symbol: "PRX.JO", name: "Prosus NV", exchange: "JSE", aliases: ["prosus", "tencent holder"] },
  { symbol: "MTN.JO", name: "MTN Group Ltd", exchange: "JSE", aliases: ["mtn"] },
  { symbol: "VOD.JO", name: "Vodacom Group Ltd", exchange: "JSE", aliases: ["vodacom"] },
  { symbol: "TKG.JO", name: "Telkom SA SOC Ltd", exchange: "JSE", aliases: ["telkom"] },
  { symbol: "REM.JO", name: "Remgro Ltd", exchange: "JSE", aliases: ["remgro"] },
  { symbol: "BTI.JO", name: "British American Tobacco plc", exchange: "JSE", aliases: ["british american tobacco", "bats"] },
  { symbol: "CFR.JO", name: "Compagnie Financière Richemont SA", exchange: "JSE", aliases: ["richemont", "cartier"] },

  { symbol: "AGL.JO", name: "Anglo American plc", exchange: "JSE", aliases: ["anglo american", "anglos"] },
  { symbol: "BHP.JO", name: "BHP Group Ltd", exchange: "JSE", aliases: ["bhp", "billiton"] },
  { symbol: "GFI.JO", name: "Gold Fields Ltd", exchange: "JSE", aliases: ["gold fields"] },
  { symbol: "ANG.JO", name: "AngloGold Ashanti plc", exchange: "JSE", aliases: ["anglogold"] },
  { symbol: "HAR.JO", name: "Harmony Gold Mining Company Ltd", exchange: "JSE", aliases: ["harmony gold"] },
  { symbol: "IMP.JO", name: "Impala Platinum Holdings Ltd", exchange: "JSE", aliases: ["implats", "impala platinum"] },
  { symbol: "AMS.JO", name: "Anglo American Platinum Ltd", exchange: "JSE", aliases: ["amplats"] },
  { symbol: "NPH.JO", name: "Northam Platinum Holdings Ltd", exchange: "JSE", aliases: ["northam"] },
  { symbol: "SSW.JO", name: "Sibanye Stillwater Ltd", exchange: "JSE", aliases: ["sibanye", "sibanye stillwater"] },
  { symbol: "EXX.JO", name: "Exxaro Resources Ltd", exchange: "JSE", aliases: ["exxaro"] },
  { symbol: "KIO.JO", name: "Kumba Iron Ore Ltd", exchange: "JSE", aliases: ["kumba"] },
  { symbol: "SOL.JO", name: "Sasol Ltd", exchange: "JSE", aliases: ["sasol"] },

  { symbol: "BID.JO", name: "Bidvest Group Ltd", exchange: "JSE", aliases: ["bidvest"] },
  { symbol: "BVT.JO", name: "The Bid Corporation Ltd", exchange: "JSE", aliases: ["bidcorp"] },
  { symbol: "APN.JO", name: "Aspen Pharmacare Holdings Ltd", exchange: "JSE", aliases: ["aspen"] },
  { symbol: "LHC.JO", name: "Life Healthcare Group Holdings Ltd", exchange: "JSE", aliases: ["life healthcare"] },
  { symbol: "NTC.JO", name: "Netcare Ltd", exchange: "JSE", aliases: ["netcare"] },

  { symbol: "GRT.JO", name: "Growthpoint Properties Ltd", exchange: "JSE", aliases: ["growthpoint"] },
  { symbol: "RDF.JO", name: "Redefine Properties Ltd", exchange: "JSE", aliases: ["redefine"] },
  { symbol: "VKE.JO", name: "Vukile Property Fund Ltd", exchange: "JSE", aliases: ["vukile"] },
  { symbol: "EQS.JO", name: "Equites Property Fund Ltd", exchange: "JSE", aliases: ["equites"] },

  { symbol: "MNP.JO", name: "Mondi plc", exchange: "JSE", aliases: ["mondi"] },
  { symbol: "SAP.JO", name: "Sappi Ltd", exchange: "JSE", aliases: ["sappi"] },
  { symbol: "TBS.JO", name: "Tiger Brands Ltd", exchange: "JSE", aliases: ["tiger brands", "albany"] },
  { symbol: "AVI.JO", name: "AVI Ltd", exchange: "JSE", aliases: ["avi", "five roses"] },
  { symbol: "RCL.JO", name: "RCL Foods Ltd", exchange: "JSE", aliases: ["rcl foods", "rainbow chicken"] },
  { symbol: "AFT.JO", name: "Afrimat Ltd", exchange: "JSE", aliases: ["afrimat"] },
  { symbol: "PPC.JO", name: "PPC Ltd", exchange: "JSE", aliases: ["ppc cement"] },
  { symbol: "MUR.JO", name: "Murray & Roberts Holdings Ltd", exchange: "JSE", aliases: ["murray and roberts"] },
  { symbol: "WBO.JO", name: "Wilson Bayly Holmes-Ovcon Ltd", exchange: "JSE", aliases: ["wbho"] },
  { symbol: "MTA.JO", name: "Metair Investments Ltd", exchange: "JSE", aliases: ["metair"] },
  { symbol: "ABF.JO", name: "African Rainbow Minerals Ltd", exchange: "JSE", aliases: ["arm", "african rainbow minerals"] },
  { symbol: "THA.JO", name: "Tharisa plc", exchange: "JSE", aliases: ["tharisa"] },
  { symbol: "MCG.JO", name: "MultiChoice Group Ltd", exchange: "JSE", aliases: ["multichoice", "dstv", "supersport"] },
  { symbol: "SPJ.JO", name: "Super Group Ltd", exchange: "JSE", aliases: ["super group"] },
  { symbol: "KAP.JO", name: "Kap Ltd", exchange: "JSE", aliases: ["kap"] },
  { symbol: "ATT.JO", name: "Attacq Ltd", exchange: "JSE", aliases: ["attacq", "mall of africa"] },
  { symbol: "RNI.JO", name: "Reinet Investments SCA", exchange: "JSE", aliases: ["reinet"] },
  { symbol: "QLT.JO", name: "Quilter plc", exchange: "JSE", aliases: ["quilter"] },
];

export function searchDirectory(q: string): { symbol: string; name: string; exchange: string; type: string }[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return JSE_DIRECTORY.filter((e) => {
    if (e.symbol.toLowerCase().includes(needle)) return true;
    if (e.name.toLowerCase().includes(needle)) return true;
    return (e.aliases ?? []).some((a) => a.includes(needle) || needle.includes(a));
  }).map((e) => ({ symbol: e.symbol, name: e.name, exchange: e.exchange, type: "EQUITY" }));
}
