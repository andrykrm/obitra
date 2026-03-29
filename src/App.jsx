import { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";
import { fbGet, fbSet, fbListen } from "./firebase.js";

/* ═══════════════════════════════════════
   THEME CONFIG
   ═══════════════════════════════════════ */
const THEMES = {
  dark: {
    bg: "#111111", card: "rgba(255,255,255,0.04)", cardBorder: "rgba(255,255,255,0.08)", text: "#E8E8E8",
    textDim: "#777777", textMuted: "#555555", inputBg: "rgba(255,255,255,0.03)",
    accent: "#5a7d9f", accentLight: "#7a9dbf",
    green: "#22C55E", red: "#EF4444", yellow: "#F59E0B",
    journalAccent: "#5a7d9f", journalNeg: "#ffffff",
    tvTheme: "dark", tvBg: "rgba(17, 17, 17, 1)",
    glass: "rgba(255,255,255,0.035)", glassBorder: "rgba(255,255,255,0.08)", glassBlur: "blur(20px) saturate(1.4)",
  },
  light: {
    bg: "#F0F2F5", card: "#FFFFFF", cardBorder: "#E2E8F0", text: "#1A202C",
    textDim: "#718096", textMuted: "#A0AEC0", inputBg: "#F7FAFC",
    accent: "#5a7d9f", accentLight: "#7a9dbf",
    green: "#16A34A", red: "#DC2626", yellow: "#D97706",
    journalAccent: "#5a7d9f", journalNeg: "#334155",
    tvTheme: "light", tvBg: "#ffffff",
    glass: "#FFFFFF", glassBorder: "#E2E8F0", glassBlur: "none",
  },
};

/* ═══════════════════════════════════════
   LOGO
   ═══════════════════════════════════════ */
function EnergyOrb({ size = 40 }) {
  const s = size;
  const c = s / 2;
  const id = 'orb' + size;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`${id}g1`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c8e0ff" />
          <stop offset="20%" stopColor="#7ab4ff" />
          <stop offset="45%" stopColor="#4a90d9" />
          <stop offset="70%" stopColor="#2a5f9e" />
          <stop offset="100%" stopColor="#0d1b2a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}g2`} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#7ab4ff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#4a7db8" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}g3`} cx="50%" cy="45%" r="25%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c8e0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={c} cy={c} r={c * 0.92} fill={`url(#${id}g2)`} />
      <circle cx={c} cy={c} r={c * 0.7} fill={`url(#${id}g2)`} />
      <circle cx={c} cy={c} r={c * 0.48} fill={`url(#${id}g1)`} />
      <circle cx={c} cy={c} r={c * 0.18} fill={`url(#${id}g3)`} />
    </svg>
  );
}
/* ═══════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════ */
const LANG = {
  en: {
    // Sidebar
    dashboard: "Dashboard", tradingview: "TradingView", journal: "Journal",
    macro: "Macro", newsHub: "News Hub", socialIntel: "Social Intel",
    tweetLab: "Tweet Lab", chatRoom: "Chat Room", proTerminal: "Pro Terminal",
    sessions: "Sessions", open: "OPEN", closed: "CLOSED",
    // Tab titles
    titleDashboard: "Trading Dashboard", titleChart: "Charts & Browser",
    titleJournal: "Trading Journal", titleMacro: "Weekly Macro Outlook",
    titleNews: "Economic Calendar", titleSocial: "Social Intelligence",
    titleLab: "Tweet Lab", titleChat: "Chat Room",
    subtitle: "Real-time market data & intelligence",
    // Dashboard
    watchlist: "Watchlist", redFolder: "Red Folder", seeAll: "See all →",
    openArrow: "Open →", tvArrow: "TradingView →",
    // Journal
    statistics: "Statistics", tradeLog: "Trade Log", editTrade: "Edit",
    newTrade: "+ Trade", settings: "Settings", private: "private", funded: "funded",
    all: "All", winRate: "Win Rate", totalPnl: "Total P&L", profitFactor: "Profit Factor",
    streak: "Streak", expectancy: "Expectancy", perTrade: "per trade",
    avgWin: "Avg Win", avgLoss: "Avg Loss", longWR: "Long WR", shortWR: "Short WR",
    equityCurve: "Equity Curve", byPair: "By Pair", byDay: "By Day",
    noData: "No data", noTrades: "No trades in", account: "account",
    logTrade: "Log Trade", logFirst: "+ Log Trade", save: "Save", cancel: "Cancel",
    logNewTrade: "Log New Trade", editTradeTitle: "Edit Trade",
    date: "Date", pair: "Pair", direction: "Direction", session: "Session",
    entry: "Entry", exit: "Exit", lots: "Lots", pnl: "P&L ($) *",
    rr: "R:R", setup: "Setup", emotion: "Emotion", notes: "Notes",
    analysis: "Analysis...", addTradeToSee: "Add trades to see equity curve",
    noDataYet: "No data yet",
    // Settings
    accountSettings: "Account Settings", privateAccount: "Private Account",
    accountBalance: "Account Balance ($)", fundedAccounts: "Funded Accounts",
    name: "Name", provider: "Provider", balance: "Balance", add: "+ Add",
    // News
    econCalendar: "Economic Calendar — Red Folder",
    highImpactEvents: "High-impact USD & EUR events",
    today: "Today", tomorrow: "Tomorrow",
    // Social
    aiAnalysis: "AI Market Analysis",
    aiAnalysisSub: "Mechanical assessment — retail impact + trade actions",
    runAnalysis: "Run Analysis", analyzing: "Analyzing...",
    sentiment: "Sentiment", retailImpact: "Retail Impact",
    tradeActions: "Trade Actions", risks: "Risks",
    trumpImpact: "Trump Impact", highImpactNews: "High-Impact News",
    clickRunAnalysis: "Click \"Run Analysis\" for AI assessment",
    truthSocial: "Truth Social — Trump", economicX: "Economic X",
    // Macro
    weeklyMacro: "Weekly Macro Outlook — EUR/USD",
    macroSub: "Monday morning briefing • AI-powered macro analysis",
    generateOutlook: "Generate Outlook", generating: "Generating...",
    weeklyBias: "WEEKLY BIAS", summary: "SUMMARY", confidence: "Confidence",
    usdDrivers: "USD DRIVERS", eurDrivers: "EUR DRIVERS",
    resistance: "RESISTANCE", support: "SUPPORT",
    dailyBreakdown: "DAILY BREAKDOWN",
    bullishScenario: "BULLISH SCENARIO", bearishScenario: "BEARISH SCENARIO",
    tradePlan: "TRADE PLAN",
    macroEmpty: "Monday Morning Macro Briefing",
    macroEmptySub: "Generate a comprehensive EUR/USD weekly outlook",
    // Lab
    tweetLabTitle: "Tweet Lab", tweetLabSub: "AI-generated hedge fund tweets",
    generateTweets: "Generate Tweets", copy: "Copy",
    tweetLabEmpty: "Generate tweets based on live market data",
    // Chat
    joinChat: "Join Chat", chatShared: "Shared with anyone who has this app",
    yourName: "Your name...", join: "Join", tradeChat: "Trade Chat",
    asLabel: "as", noMessages: "No messages yet", typeMessage: "Type a message...",
    send: "Send", sendImg: "Send Img", pasteImgUrl: "Paste image URL...",
    live: "LIVE", trades: "Trades",
    // Login
    welcomeTitle: "Welcome to Obitra",
    welcomeSub: "Enter your username to access your personal dashboard. Your journal, stats, and settings are saved per user.",
    username: "Username", loginBtn: "Enter Hub",
    loggedInAs: "Logged in as", switchUser: "Switch User",
    textSizeLabel: "Text", small: "S", medium: "M", large: "L",
  },
  de: {
    dashboard: "Dashboard", tradingview: "TradingView", journal: "Journal",
    macro: "Makro", newsHub: "News Hub", socialIntel: "Social Intel",
    tweetLab: "Tweet Lab", chatRoom: "Chatraum", proTerminal: "Pro Terminal",
    sessions: "Sitzungen", open: "OFFEN", closed: "GESCHL.",
    titleDashboard: "Trading Dashboard", titleChart: "Charts & Browser",
    titleJournal: "Trading Journal", titleMacro: "Wöchentlicher Makro-Ausblick",
    titleNews: "Wirtschaftskalender", titleSocial: "Social Intelligence",
    titleLab: "Tweet Lab", titleChat: "Chatraum",
    subtitle: "Echtzeit-Marktdaten & Analysen",
    watchlist: "Watchlist", redFolder: "Red Folder", seeAll: "Alle →",
    openArrow: "Öffnen →", tvArrow: "TradingView →",
    statistics: "Statistiken", tradeLog: "Trade Log", editTrade: "Bearb.",
    newTrade: "+ Trade", settings: "Einstellungen", private: "privat", funded: "funded",
    all: "Alle", winRate: "Gewinnrate", totalPnl: "Gesamt P&L", profitFactor: "Profitfaktor",
    streak: "Serie", expectancy: "Erwartungswert", perTrade: "pro Trade",
    avgWin: "Ø Gewinn", avgLoss: "Ø Verlust", longWR: "Long GR", shortWR: "Short GR",
    equityCurve: "Kapitalkurve", byPair: "Nach Paar", byDay: "Nach Tag",
    noData: "Keine Daten", noTrades: "Keine Trades im", account: "Konto",
    logTrade: "Trade loggen", logFirst: "+ Trade loggen", save: "Speichern", cancel: "Abbrechen",
    logNewTrade: "Neuen Trade loggen", editTradeTitle: "Trade bearbeiten",
    date: "Datum", pair: "Paar", direction: "Richtung", session: "Sitzung",
    entry: "Einstieg", exit: "Ausstieg", lots: "Lots", pnl: "P&L ($) *",
    rr: "R:R", setup: "Setup", emotion: "Emotion", notes: "Notizen",
    analysis: "Analyse...", addTradeToSee: "Trades hinzufügen um die Kurve zu sehen",
    noDataYet: "Noch keine Daten",
    accountSettings: "Kontoeinstellungen", privateAccount: "Privates Konto",
    accountBalance: "Kontostand ($)", fundedAccounts: "Funded Konten",
    name: "Name", provider: "Anbieter", balance: "Kontostand", add: "+ Hinzufügen",
    econCalendar: "Wirtschaftskalender — Red Folder",
    highImpactEvents: "High-Impact USD & EUR Events",
    today: "Heute", tomorrow: "Morgen",
    aiAnalysis: "KI-Marktanalyse",
    aiAnalysisSub: "Mechanische Bewertung — Einfluss auf Retail + Handelsempfehlungen",
    runAnalysis: "Analyse starten", analyzing: "Analysiere...",
    sentiment: "Stimmung", retailImpact: "Retail-Einfluss",
    tradeActions: "Handelsempfehlungen", risks: "Risiken",
    trumpImpact: "Trump Einfluss", highImpactNews: "High-Impact Nachrichten",
    clickRunAnalysis: "Klicke \"Analyse starten\" für KI-Bewertung",
    truthSocial: "Truth Social — Trump", economicX: "Economic X",
    weeklyMacro: "Wöchentlicher Makro-Ausblick — EUR/USD",
    macroSub: "Montag-Morgen-Briefing • KI-gestützte Makroanalyse",
    generateOutlook: "Ausblick generieren", generating: "Generiere...",
    weeklyBias: "WOCHEN-TENDENZ", summary: "ZUSAMMENFASSUNG", confidence: "Konfidenz",
    usdDrivers: "USD TREIBER", eurDrivers: "EUR TREIBER",
    resistance: "WIDERSTAND", support: "UNTERSTÜTZUNG",
    dailyBreakdown: "TAGES-ÜBERSICHT",
    bullishScenario: "BULLISCHES SZENARIO", bearishScenario: "BÄRISCHES SZENARIO",
    tradePlan: "HANDELSPLAN",
    macroEmpty: "Montag-Morgen Makro-Briefing",
    macroEmptySub: "Umfassenden EUR/USD Wochenausblick generieren",
    tweetLabTitle: "Tweet Lab", tweetLabSub: "KI-generierte Hedgefonds-Tweets",
    generateTweets: "Tweets generieren", copy: "Kopieren",
    tweetLabEmpty: "Tweets basierend auf Echtzeit-Marktdaten generieren",
    joinChat: "Chat beitreten", chatShared: "Sichtbar für alle mit dieser App",
    yourName: "Dein Name...", join: "Beitreten", tradeChat: "Trade Chat",
    asLabel: "als", noMessages: "Noch keine Nachrichten", typeMessage: "Nachricht eingeben...",
    send: "Senden", sendImg: "Bild senden", pasteImgUrl: "Bild-URL einfügen...",
    live: "LIVE", trades: "Trades",
    // Login
    welcomeTitle: "Willkommen bei Obitra",
    welcomeSub: "Gib deinen Benutzernamen ein. Dein Journal, Statistiken und Einstellungen werden pro Nutzer gespeichert.",
    username: "Benutzername", loginBtn: "Hub betreten",
    loggedInAs: "Eingeloggt als", switchUser: "Nutzer wechseln",
    textSizeLabel: "Text", small: "S", medium: "M", large: "L",
  },
};

/* ═══════════════════════════════════════
   STORAGE HELPERS
   ═══════════════════════════════════════ */
async function sGet(k) {
  try { const v = localStorage.getItem(`ob:${k}`); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
async function sSet(k, v) {
  try { localStorage.setItem(`ob:${k}`, JSON.stringify(v)); } catch (e) { console.error(e); }
}
async function sGetShared(k) {
  try { return await fbGet(k); }
  catch { return null; }
}
async function sSetShared(k, v) {
  try { await fbSet(k, v); } catch (e) { console.error(e); }
}

/* ═══════════════════════════════════════
   STATIC DATA
   ═══════════════════════════════════════ */
const PAIRS_LIST = [
  "EUR/USD","GBP/USD","USD/JPY","USD/CHF","AUD/USD","NZD/USD",
  "USD/CAD","EUR/GBP","EUR/JPY","GBP/JPY","XAU/USD","BTC/USD",
  "US30","NAS100","SPX500"
];

const PAIRS = [
  { symbol: "EUR/USD", base: 1.0842, spread: 0.8 },
  { symbol: "GBP/USD", base: 1.2654, spread: 1.1 },
  { symbol: "USD/JPY", base: 154.32, spread: 0.9 },
  { symbol: "USD/CHF", base: 0.8821, spread: 1.0 },
  { symbol: "AUD/USD", base: 0.6543, spread: 0.7 },
  { symbol: "NZD/USD", base: 0.6012, spread: 1.2 },
  { symbol: "USD/CAD", base: 1.3621, spread: 1.0 },
  { symbol: "EUR/GBP", base: 0.8568, spread: 1.3 },
];

const _today = new Date();
const _d = (offset) => { const d = new Date(_today); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };

// Fallback static events (used if API fails)
const STATIC_EVENTS = [
  { date: _d(0), time: "08:30", currency: "USD", event: "Core PCE Price Index m/m", forecast: "0.2%", previous: "0.3%", actual: "", surprise: "" },
  { date: _d(0), time: "10:00", currency: "USD", event: "Pending Home Sales m/m", forecast: "1.5%", previous: "-4.9%", actual: "", surprise: "" },
  { date: _d(1), time: "08:30", currency: "USD", event: "Non-Farm Employment Change", forecast: "180K", previous: "151K", actual: "", surprise: "" },
  { date: _d(1), time: "08:30", currency: "USD", event: "Unemployment Rate", forecast: "4.1%", previous: "4.1%", actual: "", surprise: "" },
  { date: _d(2), time: "08:00", currency: "EUR", event: "German CPI m/m", forecast: "0.3%", previous: "0.4%", actual: "", surprise: "" },
  { date: _d(2), time: "10:00", currency: "EUR", event: "EU CPI Flash Estimate y/y", forecast: "2.3%", previous: "2.3%", actual: "", surprise: "" },
  { date: _d(3), time: "08:30", currency: "USD", event: "ADP Non-Farm Employment", forecast: "148K", previous: "140K", actual: "", surprise: "" },
  { date: _d(3), time: "10:00", currency: "USD", event: "JOLTS Job Openings", forecast: "7.74M", previous: "7.74M", actual: "", surprise: "" },
  { date: _d(4), time: "08:30", currency: "USD", event: "Trade Balance", forecast: "-68.7B", previous: "-68.3B", actual: "", surprise: "" },
  { date: _d(4), time: "10:00", currency: "USD", event: "ISM Services PMI", forecast: "53.0", previous: "53.5", actual: "", surprise: "" },
  { date: _d(5), time: "08:30", currency: "USD", event: "Unemployment Claims", forecast: "225K", previous: "224K", actual: "", surprise: "" },
  { date: _d(5), time: "08:00", currency: "EUR", event: "ECB Meeting Minutes", forecast: "", previous: "", actual: "", surprise: "" },
];

// Fetch live economic calendar
async function fetchEconomicCalendar() {
  try {
    const res = await fetch("https://economic-calendar-api.vercel.app/api/events");
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    // Filter high-impact events and map to our format
    return data
      .filter(e => e.impact === "high" || e.impact === "medium")
      .slice(0, 30)
      .map(e => ({
        date: e.date || _d(0),
        time: e.time || "—",
        currency: e.currency || "USD",
        event: e.title || e.event || "Unknown",
        forecast: e.forecast || "",
        previous: e.previous || "",
        actual: e.actual || "",
        surprise: e.actual && e.forecast ? (parseFloat(e.actual) > parseFloat(e.forecast) ? "positive" : "negative") : "",
      }));
  } catch {
    return null; // Will use STATIC_EVENTS as fallback
  }
}

const HIGH_IMPACT_NEWS = [
  { time: "12min ago", headline: "Core PCE expected at 0.2% — in line with Fed's disinflation target, markets await confirmation", source: "Reuters", currency: "USD", sentiment: "dovish" },
  { time: "28min ago", headline: "ECB's Lane: 'Inflation path remains uncertain, data-dependent approach continues'", source: "ECB", currency: "EUR", sentiment: "hawkish" },
  { time: "1h ago", headline: "Trump signals new tariff wave on EU auto imports — 25% discussed", source: "Bloomberg", currency: "EUR", sentiment: "bearish" },
  { time: "2h ago", headline: "US 10Y yield steady at 4.25% ahead of key employment data this week", source: "CNBC", currency: "USD", sentiment: "neutral" },
  { time: "3h ago", headline: "German Ifo Business Climate falls to 86.7, below 87.5 consensus", source: "Ifo Institute", currency: "EUR", sentiment: "bearish" },
  { time: "5h ago", headline: "Fed's Waller: 'Two rate cuts still appropriate for 2026 if data cooperates'", source: "Fed", currency: "USD", sentiment: "dovish" },
  { time: "6h ago", headline: "Eurozone Q1 GDP growth revised down to 0.1% from 0.2%", source: "Eurostat", currency: "EUR", sentiment: "bearish" },
];

/* ═══════════════════════════════════════
   STATS CALCULATOR
   ═══════════════════════════════════════ */
function calcStats(trades, startBal) {
  const empty = {
    totalTrades: 0, wins: 0, losses: 0, be: 0, winRate: 0, totalPnl: 0,
    avgWin: 0, avgLoss: 0, pf: 0, avgRR: 0, best: 0, worst: 0,
    streak: 0, streakType: "", maxW: 0, maxL: 0, expectancy: 0,
    balance: startBal, longWR: 0, shortWR: 0, balHist: [startBal],
    monthlyPnl: {}, weeklyPnl: {}, dailyPnl: {}, yearlyPnl: {},
    pairStats: {}, dayStats: {},
  };
  if (!trades.length) return empty;

  const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  const wins = sorted.filter(t => t.pnl > 0);
  const losses = sorted.filter(t => t.pnl < 0);
  const be = sorted.filter(t => t.pnl === 0);
  const totalPnl = sorted.reduce((s, t) => s + t.pnl, 0);
  const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const longs = sorted.filter(t => t.direction === "Long");
  const shorts = sorted.filter(t => t.direction === "Short");

  let mxW = 0, mxL = 0, cw = 0, cl = 0;
  sorted.forEach(t => {
    if (t.pnl > 0) { cw++; cl = 0; }
    else if (t.pnl < 0) { cl++; cw = 0; }
    else { cw = 0; cl = 0; }
    mxW = Math.max(mxW, cw);
    mxL = Math.max(mxL, cl);
  });

  let streak = 0, sType = "";
  if (sorted.length) {
    let i = sorted.length - 1;
    const dir = sorted[i].pnl > 0 ? 1 : sorted[i].pnl < 0 ? -1 : 0;
    while (i >= 0 && ((dir > 0 && sorted[i].pnl > 0) || (dir < 0 && sorted[i].pnl < 0))) {
      streak++; i--;
    }
    sType = dir > 0 ? "W" : dir < 0 ? "L" : "";
  }

  let bal = startBal;
  const balHist = [startBal];
  sorted.forEach(t => { bal += t.pnl; balHist.push(bal); });

  const monthlyPnl = {}, weeklyPnl = {}, dailyPnl = {}, yearlyPnl = {};
  const pairStats = {}, dayStats = {};

  sorted.forEach(t => {
    const dt = new Date(t.date);
    monthlyPnl[t.date.slice(0, 7)] = (monthlyPnl[t.date.slice(0, 7)] || 0) + t.pnl;
    dailyPnl[t.date] = (dailyPnl[t.date] || 0) + t.pnl;
    yearlyPnl[t.date.slice(0, 4)] = (yearlyPnl[t.date.slice(0, 4)] || 0) + t.pnl;
    const wkDate = new Date(dt);
    wkDate.setDate(wkDate.getDate() - wkDate.getDay() + 1);
    const wk = "W" + wkDate.toISOString().slice(5, 10);
    weeklyPnl[wk] = (weeklyPnl[wk] || 0) + t.pnl;

    if (!pairStats[t.pair]) pairStats[t.pair] = { trades: 0, pnl: 0, wins: 0 };
    pairStats[t.pair].trades++;
    pairStats[t.pair].pnl += t.pnl;
    if (t.pnl > 0) pairStats[t.pair].wins++;

    const dayName = new Date(t.date).toLocaleDateString("en-US", { weekday: "short" });
    if (!dayStats[dayName]) dayStats[dayName] = { trades: 0, pnl: 0, wins: 0 };
    dayStats[dayName].trades++;
    dayStats[dayName].pnl += t.pnl;
    if (t.pnl > 0) dayStats[dayName].wins++;
  });

  const wr = (wins.length / sorted.length) * 100;
  const avgRR = wins.length && losses.length ? (grossWin / wins.length) / (grossLoss / losses.length) : 0;
  const exp = (wr / 100) * (wins.length ? grossWin / wins.length : 0) -
              ((100 - wr) / 100) * (losses.length ? grossLoss / losses.length : 0);

  return {
    totalTrades: sorted.length, wins: wins.length, losses: losses.length, be: be.length,
    winRate: wr, totalPnl, avgWin: wins.length ? grossWin / wins.length : 0,
    avgLoss: losses.length ? -(grossLoss / losses.length) : 0,
    pf: grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0,
    avgRR, best: Math.max(...sorted.map(t => t.pnl)), worst: Math.min(...sorted.map(t => t.pnl)),
    streak, streakType: sType, maxW: mxW, maxL: mxL, expectancy: exp, balance: bal,
    longWR: longs.length ? (longs.filter(t => t.pnl > 0).length / longs.length) * 100 : 0,
    shortWR: shorts.length ? (shorts.filter(t => t.pnl > 0).length / shorts.length) * 100 : 0,
    balHist, monthlyPnl, weeklyPnl, dailyPnl, yearlyPnl, pairStats, dayStats,
  };
}

/* ═══════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════ */
function Spark({ data, color, w = 80, h = 28 }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const r = mx - mn || 1;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - mn) / r) * h}`
  ).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Badge({ level, T }) {
  const colors = { high: T.red, medium: T.yellow, low: T.green };
  const c = colors[level] || T.textDim;
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: c, boxShadow: `0 0 6px ${c}40`,
    }} />
  );
}

function DonutChart({ value, label, color, T }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <svg width={74} height={74} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={37} cy={37} r={r} fill="none" stroke={T.glassBorder} strokeWidth="5" />
        <circle cx={37} cy={37} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s" }} />
      </svg>
      <div style={{ position: "relative", marginTop: -52, fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Space Grotesk'" }}>
        {value}%
      </div>
      <div style={{ marginTop: 20, fontSize: 9, color: T.textDim, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, T }) {
  const isDark = T.bg === "#111111";
  return (
    <div style={{ background: isDark ? "rgba(255,255,255,0.035)" : T.card, border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : T.glassBorder}`, borderRadius: 14, padding: "12px 14px", backdropFilter: isDark ? "blur(16px) saturate(1.3)" : "none", WebkitBackdropFilter: isDark ? "blur(16px) saturate(1.3)" : "none" }}>
      <div style={{ fontSize: 9, color: T.textDim, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 5 }}>
        {icon && <Icon name={icon} color={T.textDim} size={11} />}{label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk'", color: T.text }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: T.textDim, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, options, placeholder, step, T }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "7px 9px", color: T.text, fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} step={step}
          style={{ background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "7px 9px", color: T.text, fontSize: 11, outline: "none", fontFamily: "'Space Grotesk'" }} />
      )}
    </div>
  );
}

function ImageUpload({ value, onChange, label, T, compact }) {
  const fileRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      {label && <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>{label}</label>}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={value} style={{ maxHeight: compact ? 40 : 60, borderRadius: 8, display: "block" }} />
          <span onClick={() => onChange("")} style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: T.red, color: "#fff", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700 }}>x</span>
        </div>
      ) : (
        <span onClick={() => fileRef.current?.click()}
          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: compact ? "4px 8px" : "6px 12px", borderRadius: 8, background: T.glass, border: `1px solid ${T.glassBorder}`, cursor: "pointer", fontSize: compact ? 8 : 9, color: T.textDim, fontWeight: 600 }}>
          <Icon name="image" color={T.textDim} size={compact ? 10 : 12} /> {compact ? "" : (label || "Upload")}
        </span>
      )}
    </div>
  );
}

function EquityCurve({ data, T }) {
  const w = 540, h = 150;
  if (data.length < 2) return <div style={{ color: T.textMuted, fontSize: 11, padding: 30, textAlign: "center" }}>Add trades to see equity curve</div>;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${8 + (1 - (v - mn) / rng) * (h - 16)}`);
  const line = pts.join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.journalAccent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={T.journalAccent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#eqGrad)" />
      <polyline points={line} fill="none" stroke={T.journalAccent} strokeWidth="2" strokeLinejoin="round" />
      <text x={4} y={14} fill={T.textDim} fontSize="9" fontFamily="'Space Grotesk'">${mx.toFixed(0)}</text>
      <text x={4} y={h - 4} fill={T.textDim} fontSize="9" fontFamily="'Space Grotesk'">${mn.toFixed(0)}</text>
    </svg>
  );
}

function PnlBars({ data, T }) {
  const w = 540, h = 120;
  const entries = Object.entries(data);
  if (!entries.length) return <div style={{ color: T.textMuted, fontSize: 11, padding: 30, textAlign: "center" }}>No data yet</div>;
  const vals = entries.map(e => e[1]);
  const maxAbs = Math.max(...vals.map(Math.abs), 1);
  const bw = Math.min(36, (w - 40) / entries.length - 4);
  const mid = h / 2;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
      <line x1={20} x2={w - 20} y1={mid} y2={mid} stroke={T.glassBorder} strokeWidth="1" />
      {entries.map(([m, v], i) => {
        const x = 30 + i * ((w - 60) / entries.length);
        const bh = (Math.abs(v) / maxAbs) * (mid - 16);
        const yPos = v >= 0 ? mid - bh : mid;
        const col = v >= 0 ? T.journalAccent : T.journalNeg;
        return (
          <g key={m}>
            <rect x={x} y={yPos} width={bw} height={bh} rx={3} fill={col} fillOpacity={v >= 0 ? 0.8 : 0.5} />
            <text x={x + bw / 2} y={h - 2} fill={T.textDim} fontSize="7" textAnchor="middle" fontFamily="'Space Grotesk'">
              {m.length > 7 ? m.slice(-5) : m.slice(-2)}
            </text>
            <text x={x + bw / 2} y={v >= 0 ? yPos - 3 : yPos + bh + 9} fill={col} fontSize="7" textAnchor="middle" fontFamily="'Space Grotesk'">
              {v >= 0 ? "+" : ""}{v.toFixed(0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════
   TRADE CALENDAR
   ═══════════════════════════════════════ */
function TradeCalendar({ trades, T }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const daysInMonth = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();
  const firstDay = new Date(viewMonth.year, viewMonth.month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon-start

  const dailyPnl = {};
  trades.forEach(t => {
    const d = t.date;
    if (!dailyPnl[d]) dailyPnl[d] = { pnl: 0, count: 0, wins: 0 };
    dailyPnl[d].pnl += t.pnl;
    dailyPnl[d].count++;
    if (t.pnl > 0) dailyPnl[d].wins++;
  });

  const monthStr = new Date(viewMonth.year, viewMonth.month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setViewMonth(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  };
  const nextMonth = () => {
    setViewMonth(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  };

  const days = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span onClick={prevMonth} style={{ cursor: "pointer", color: T.textDim, fontWeight: 600, fontSize: 14, padding: "2px 8px" }}>&lt;</span>
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Space Grotesk'" }}>{monthStr}</span>
        <span onClick={nextMonth} style={{ cursor: "pointer", color: T.textDim, fontWeight: 600, fontSize: 14, padding: "2px 8px" }}>&gt;</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
          <div key={d} style={{ fontSize: 8, color: T.textMuted, fontWeight: 600, padding: "4px 0" }}>{d}</div>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const dateStr = `${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const data = dailyPnl[dateStr];
          const isToday = dateStr === new Date().toISOString().slice(0, 10);
          return (
            <div key={day} style={{
              padding: "4px 2px", borderRadius: 8, fontSize: 9, fontFamily: "'Space Grotesk'",
              background: data ? (data.pnl > 0 ? `${T.journalAccent}25` : data.pnl < 0 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)") : "transparent",
              border: isToday ? `1px solid ${T.accent}` : "1px solid transparent",
              position: "relative", minHeight: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ color: data ? T.text : T.textMuted, fontWeight: isToday ? 700 : 400 }}>{day}</div>
              {data && (
                <div style={{ fontSize: 7, fontWeight: 600, color: data.pnl > 0 ? T.journalAccent : T.red, marginTop: 1 }}>
                  {data.pnl > 0 ? "+" : ""}{data.pnl.toFixed(0)}
                </div>
              )}
              {data && data.count > 0 && (
                <div style={{ display: "flex", gap: 1, marginTop: 1 }}>
                  {Array.from({ length: Math.min(data.count, 4) }).map((_, j) => (
                    <div key={j} style={{ width: 3, height: 3, borderRadius: "50%", background: j < data.wins ? T.journalAccent : T.red }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPOUND FORECAST GRAPH
   ═══════════════════════════════════════ */
function CompoundForecast({ stats, currentBalance, T }) {
  const w = 540, h = 170;
  const months = 12;

  // Calculate average monthly return from actual data
  const monthlyEntries = Object.values(stats.monthlyPnl);
  const avgMonthlyPnl = monthlyEntries.length > 0 ? monthlyEntries.reduce((s, v) => s + v, 0) / monthlyEntries.length : 0;
  const avgMonthlyPct = currentBalance > 0 ? (avgMonthlyPnl / currentBalance) * 100 : 0;

  // Generate 3 scenarios: pessimistic, average, optimistic
  const scenarios = [
    { label: "Conservative", pct: avgMonthlyPct * 0.5, color: T.textDim, dash: "4,4" },
    { label: "Expected", pct: avgMonthlyPct, color: T.journalAccent, dash: "" },
    { label: "Optimistic", pct: avgMonthlyPct * 1.5, color: T.accentLight, dash: "6,3" },
  ];

  const allValues = [];
  scenarios.forEach(sc => {
    let bal = currentBalance;
    for (let m = 0; m <= months; m++) {
      allValues.push(bal);
      bal *= (1 + sc.pct / 100);
    }
  });

  const mn = Math.min(...allValues, currentBalance * 0.9);
  const mx = Math.max(...allValues, currentBalance * 1.1);
  const rng = mx - mn || 1;
  const pad = { t: 16, r: 60, b: 24, l: 8 };

  const getY = (v) => pad.t + (1 - (v - mn) / rng) * (h - pad.t - pad.b);
  const getX = (m) => pad.l + (m / months) * (w - pad.l - pad.r);

  if (avgMonthlyPct === 0) {
    return <div style={{ color: T.textMuted, fontSize: 11, textAlign: "center", padding: 30 }}>Add trades to see compound forecast</div>;
  }

  return (
    <div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
        {/* Grid */}
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1={pad.l} x2={w - pad.r} y1={pad.t + f * (h - pad.t - pad.b)} y2={pad.t + f * (h - pad.t - pad.b)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        ))}
        {/* Current balance line */}
        <line x1={pad.l} x2={w - pad.r} y1={getY(currentBalance)} y2={getY(currentBalance)} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="3,3" />

        {/* Scenario lines */}
        {scenarios.map((sc, si) => {
          let bal = currentBalance;
          const points = [];
          for (let m = 0; m <= months; m++) {
            points.push(`${getX(m)},${getY(bal)}`);
            bal *= (1 + sc.pct / 100);
          }
          const endBal = currentBalance * Math.pow(1 + sc.pct / 100, months);
          return (
            <g key={si}>
              <polyline points={points.join(" ")} fill="none" stroke={sc.color} strokeWidth={si === 1 ? 2 : 1.2} strokeDasharray={sc.dash} strokeLinecap="round" />
              <circle cx={getX(months)} cy={getY(endBal)} r={3} fill={sc.color} />
              <text x={w - pad.r + 5} y={getY(endBal) + 3} fill={sc.color} fontSize="8" fontFamily="'Space Grotesk'">${endBal >= 1000 ? (endBal / 1000).toFixed(1) + "k" : endBal.toFixed(0)}</text>
            </g>
          );
        })}

        {/* Month labels */}
        {Array.from({ length: months + 1 }).filter((_, i) => i % 3 === 0).map((_, i) => {
          const m = i * 3;
          return <text key={m} x={getX(m)} y={h - 4} fill={T.textDim} fontSize="7" textAnchor="middle" fontFamily="'Space Grotesk'">M{m}</text>;
        })}

        {/* Start label */}
        <text x={pad.l} y={getY(currentBalance) - 6} fill={T.textDim} fontSize="8" fontFamily="'Space Grotesk'">${currentBalance >= 1000 ? (currentBalance / 1000).toFixed(1) + "k" : currentBalance.toFixed(0)}</text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 6 }}>
        {scenarios.map((sc, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 2, background: sc.color, borderRadius: 1 }} />
            <span style={{ fontSize: 8, color: T.textDim }}>{sc.label} ({sc.pct >= 0 ? "+" : ""}{sc.pct.toFixed(1)}%/mo)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   EPIC UNIVERSE BACKGROUND
   ═══════════════════════════════════════ */
function StarField({ theme }) {
  const canvasRef = useRef(null);
  const starsRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (theme !== "dark") { if (animRef.current) cancelAnimationFrame(animRef.current); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const resize = () => {
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Generate stars in 3 depth layers
    if (!starsRef.current) {
      const stars = [];
      // Far stars - tiny, slow, many
      for (let i = 0; i < 300; i++) {
        stars.push({
          x: Math.random() * 4000, y: Math.random() * 4000,
          r: Math.random() * 0.6 + 0.15,
          baseAlpha: Math.random() * 0.35 + 0.05,
          twinkle: Math.random() * 0.006 + 0.001,
          phase: Math.random() * Math.PI * 2,
          dx: (Math.random() - 0.5) * 0.008,
          dy: Math.random() * 0.005 + 0.002,
          layer: 0,
        });
      }
      // Mid stars
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * 4000, y: Math.random() * 4000,
          r: Math.random() * 1.0 + 0.4,
          baseAlpha: Math.random() * 0.5 + 0.15,
          twinkle: Math.random() * 0.01 + 0.003,
          phase: Math.random() * Math.PI * 2,
          dx: (Math.random() - 0.5) * 0.02,
          dy: Math.random() * 0.012 + 0.005,
          layer: 1,
        });
      }
      // Close stars - bright, glow
      for (let i = 0; i < 30; i++) {
        stars.push({
          x: Math.random() * 4000, y: Math.random() * 4000,
          r: Math.random() * 1.4 + 0.8,
          baseAlpha: Math.random() * 0.6 + 0.3,
          twinkle: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2,
          dx: (Math.random() - 0.5) * 0.04,
          dy: Math.random() * 0.025 + 0.01,
          layer: 2,
          hue: Math.random() > 0.7 ? (Math.random() > 0.5 ? 220 : 30) : 0,
        });
      }
      starsRef.current = { stars, shootingStars: [], nebulae: [
        { x: w * 0.2, y: h * 0.3, rx: 280, ry: 160, hue: 220, alpha: 0.018, rot: 0.3 },
        { x: w * 0.75, y: h * 0.6, rx: 200, ry: 240, hue: 280, alpha: 0.015, rot: -0.5 },
        { x: w * 0.5, y: h * 0.15, rx: 350, ry: 120, hue: 200, alpha: 0.012, rot: 0.1 },
      ]};
    }

    const data = starsRef.current;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 1;

      // Milky Way band — diagonal soft light streak
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.rotate(-0.45);
      const mwGrad = ctx.createLinearGradient(0, -h * 0.06, 0, h * 0.06);
      mwGrad.addColorStop(0, "rgba(140,170,220,0)");
      mwGrad.addColorStop(0.3, "rgba(140,170,220,0.018)");
      mwGrad.addColorStop(0.5, "rgba(180,200,240,0.03)");
      mwGrad.addColorStop(0.7, "rgba(140,170,220,0.018)");
      mwGrad.addColorStop(1, "rgba(140,170,220,0)");
      ctx.fillStyle = mwGrad;
      ctx.fillRect(-w * 0.9, -h * 0.06, w * 1.8, h * 0.12);
      // Scatter faint dust particles along the band
      for (let i = 0; i < 40; i++) {
        const mx = (Math.sin(i * 7.3 + t * 0.0002) * 0.5 + 0.5) * w * 1.4 - w * 0.7;
        const my = (Math.cos(i * 4.1) * 0.4) * h * 0.08;
        const ma = 0.03 + Math.sin(t * 0.003 + i) * 0.015;
        ctx.beginPath();
        ctx.arc(mx, my, 0.6 + Math.sin(i) * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 240, ${ma})`;
        ctx.fill();
      }
      ctx.restore();

      // Nebula clouds
      for (const nb of data.nebulae) {
        ctx.save();
        ctx.translate(nb.x, nb.y);
        ctx.rotate(nb.rot + t * 0.00003);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(nb.rx, nb.ry));
        grad.addColorStop(0, `hsla(${nb.hue}, 60%, 50%, ${nb.alpha * 1.5})`);
        grad.addColorStop(0.4, `hsla(${nb.hue}, 50%, 40%, ${nb.alpha})`);
        grad.addColorStop(1, `hsla(${nb.hue}, 40%, 30%, 0)`);
        ctx.fillStyle = grad;
        ctx.scale(1, nb.ry / nb.rx);
        ctx.beginPath();
        ctx.arc(0, 0, nb.rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Stars
      for (const s of data.stars) {
        const alpha = s.baseAlpha + Math.sin(t * s.twinkle + s.phase) * (s.layer === 2 ? 0.35 : 0.15);
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > h + 5) { s.y = -5; s.x = Math.random() * w; }
        if (s.x > w + 5) s.x = -5;
        if (s.x < -5) s.x = w + 5;

        const a = Math.max(0, Math.min(1, alpha));
        // Glow for close stars
        if (s.layer === 2 && a > 0.3) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          if (s.hue) {
            grd.addColorStop(0, `hsla(${s.hue}, 40%, 80%, ${a * 0.15})`);
          } else {
            grd.addColorStop(0, `rgba(255, 255, 255, ${a * 0.12})`);
          }
          grd.addColorStop(1, `rgba(255, 255, 255, 0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        if (s.hue) {
          ctx.fillStyle = `hsla(${s.hue}, 30%, 85%, ${a})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        }
        ctx.fill();
      }

      // Shooting stars
      if (Math.random() < 0.003) {
        data.shootingStars.push({
          x: Math.random() * w * 0.8, y: Math.random() * h * 0.3,
          vx: 3 + Math.random() * 4, vy: 1.5 + Math.random() * 2,
          life: 1, decay: 0.015 + Math.random() * 0.01,
          len: 40 + Math.random() * 60,
        });
      }
      for (let i = data.shootingStars.length - 1; i >= 0; i--) {
        const ss = data.shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;
        if (ss.life <= 0) { data.shootingStars.splice(i, 1); continue; }
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * ss.len / ss.vx, ss.y - ss.vy * ss.len / ss.vy);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life * 0.7})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - (ss.vx / Math.sqrt(ss.vx*ss.vx+ss.vy*ss.vy)) * ss.len * ss.life, ss.y - (ss.vy / Math.sqrt(ss.vx*ss.vx+ss.vy*ss.vy)) * ss.len * ss.life);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [theme]);

  if (theme !== "dark") return null;
  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, filter: "blur(0.6px)" }} />;
}

/* ═══════════════════════════════════════
   MINIMAL SVG ICONS
   ═══════════════════════════════════════ */
const ICONS = {
  dashboard: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  chart: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  journal: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="16" y2="7"/><line x1="9" y1="11" x2="14" y2="11"/></svg>,
  macro: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  news: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><line x1="6" y1="8" x2="14" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="12" y2="16"/></svg>,
  social: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>,
  lab: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M9 3h6v6l5 8.5a1.5 1.5 0 0 1-1.3 2.5H5.3a1.5 1.5 0 0 1-1.3-2.5L9 9V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>,
  chat: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  stats: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  list: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill={c}/><circle cx="4" cy="12" r="1" fill={c}/><circle cx="4" cy="18" r="1" fill={c}/></svg>,
  plus: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  settings: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  target: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  dollar: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  ratio: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>,
  flame: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 3-7 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.5-2.5 1.5-3.5z"/></svg>,
  barChart: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  trendUp: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  trendDown: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  arrowUp: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  arrowDown: (c) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  image: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  sun: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
};

function Icon({ name, color = "currentColor", size }) {
  const fn = ICONS[name];
  if (!fn) return null;
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size || 14, height: size || 14 }}>{fn(color)}</span>;
}


function ChartHub({ T, lang, isMobile }) {
  const charts = [
    { l: "EUR/USD", s: "FX:EURUSD" }, { l: "GBP/USD", s: "FX:GBPUSD" },
    { l: "USD/JPY", s: "FX:USDJPY" }, { l: "XAU/USD", s: "TVC:GOLD" },
    { l: "BTC/USD", s: "BITSTAMP:BTCUSD" }, { l: "NAS100", s: "PEPPERSTONE:NAS100" },
    { l: "DXY", s: "CAPITALCOM:DXY" }, { l: "US30", s: "DJ:DJI" },
  ];
  const tools = [
    { l: "TradingView", s: lang === "de" ? "Charts & Analyse" : "Charts & Analysis", u: "https://www.tradingview.com", ic: "chart" },
    { l: "Forex Factory", s: lang === "de" ? "Wirtschaftskalender" : "Economic Calendar", u: "https://www.forexfactory.com/calendar", ic: "news" },
    { l: "Investing.com", s: lang === "de" ? "Marktdaten" : "Market Data", u: "https://www.investing.com", ic: "macro" },
    { l: "MyFXBook", s: lang === "de" ? "Performance" : "Performance", u: "https://www.myfxbook.com", ic: "stats" },
    { l: "Finviz", s: lang === "de" ? "Heatmap" : "Heatmap", u: "https://finviz.com/map.ashx", ic: "dashboard" },
    { l: "TradingEcon.", s: lang === "de" ? "Makrodaten" : "Macro Data", u: "https://tradingeconomics.com/calendar", ic: "barChart" },
  ];
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{lang === "de" ? "Charts öffnen" : "Open Charts"}</div>
        <div style={{ fontSize: 9, color: T.textDim, marginBottom: 12 }}>{lang === "de" ? "TradingView öffnet sich im neuen Tab" : "TradingView opens in a new tab"}</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 6 }}>
          {charts.map(c => (
            <a key={c.s} href={`https://www.tradingview.com/chart/?symbol=${c.s}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 6px", borderRadius: 8, background: T.glass, border: `1px solid ${T.glassBorder}`, cursor: "pointer", textDecoration: "none" }}>
              <Icon name="chart" color={T.accent} size={12} />
              <span style={{ fontSize: 10, fontWeight: 600, color: T.text }}>{c.l}</span>
            </a>
          ))}
        </div>
      </div>
      <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Trading Tools</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 8 }}>
          {tools.map(tl => (
            <a key={tl.u} href={tl.u} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 14, background: T.glass, border: `1px solid ${T.glassBorder}`, cursor: "pointer", textDecoration: "none" }}>
              <Icon name={tl.ic} color={T.accent} size={14} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: T.text }}>{tl.l}</div>
                <div style={{ fontSize: 8, color: T.textDim }}>{tl.s}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function TradingHub() {
  const [theme, setTheme] = useState("dark");
  const T = THEMES[theme];
  const [lang, setLang] = useState("en");
  const t = useCallback((key) => LANG[lang]?.[key] || LANG.en[key] || key, [lang]);
  const [userId, setUserId] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [textSize, setTextSize] = useState("small");
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [NEWS_EVENTS, setNewsEvents] = useState(STATIC_EVENTS);
  const lastChatCount = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const [selPair, setSelPair] = useState(0);
  const [clock, setClock] = useState(new Date());
  const [newsFilter, setNewsFilter] = useState("all");

  const [prices, setPrices] = useState(() =>
    PAIRS.map(p => ({
      ...p, price: p.base,
      change: (Math.random() - 0.45) * 0.5,
      spark: Array.from({ length: 20 }, () => p.base + (Math.random() - 0.48) * p.base * 0.002),
    }))
  );

  // Journal state
  const [trades, setTrades] = useState([]);
  const [jView, setJView] = useState("stats");
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [capitalMode, setCapitalMode] = useState("private");
  const [pnlPeriod, setPnlPeriod] = useState("monthly");
  const [privateBalance, setPrivateBalance] = useState(10000);
  const [fundedAccounts, setFundedAccounts] = useState([{ id: "1", name: "FTMO #1", provider: "FTMO", balance: 100000 }]);
  const [selectedFunded, setSelectedFunded] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [newAccName, setNewAccName] = useState("");
  const [newAccProvider, setNewAccProvider] = useState("FTMO");
  const [newAccBalance, setNewAccBalance] = useState("100000");

  const emptyForm = {
    date: new Date().toISOString().slice(0, 10), pair: "EUR/USD", direction: "",
    entryPrice: "", exitPrice: "", slPrice: "", lotSize: "0.1", pnl: "", rr: "",
    setup: "", notes: "", session: "London", emotion: "Neutral", screenshot: "", screenshot: "",
  };
  const [form, setForm] = useState(emptyForm);

  // Auto-calc direction + R:R when entry/exit/SL change
  const updateFormAuto = (newForm) => {
    const entry = parseFloat(newForm.entryPrice);
    const exit = parseFloat(newForm.exitPrice);
    const sl = parseFloat(newForm.slPrice);
    // Auto direction
    if (!isNaN(entry) && !isNaN(exit) && entry !== exit) {
      newForm.direction = exit > entry ? "Long" : "Short";
    }
    // Auto R:R
    if (!isNaN(entry) && !isNaN(exit) && !isNaN(sl) && entry !== sl) {
      const rr = Math.abs(exit - entry) / Math.abs(entry - sl);
      newForm.rr = rr.toFixed(2);
    }
    return newForm;
  };

  // AI state

  // Chat state
  const [chatMsgs, setChatMsgs] = useState([]);
  const [eduPosts, setEduPosts] = useState([]);
  const [eduTitle, setEduTitle] = useState("");
  const [eduBody, setEduBody] = useState("");
  const [eduTag, setEduTag] = useState("concept");
  const [eduImage, setEduImage] = useState("");
  const [showEduForm, setShowEduForm] = useState(false);
  const [labGalleries, setLabGalleries] = useState([]);
  const [activeGallery, setActiveGallery] = useState(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryName, setGalleryName] = useState("");
  const [galleryDesc, setGalleryDesc] = useState("");
  const [galleryThumb, setGalleryThumb] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [csvImportResult, setCsvImportResult] = useState("");
  const [riskBalance, setRiskBalance] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [riskSL, setRiskSL] = useState(15);
  const [riskTP, setRiskTP] = useState(30);
  const [riskPair, setRiskPair] = useState("standard");
  const [goals, setGoals] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, year: 0 });
  const [editGoals, setEditGoals] = useState(false);
  const [goalInputs, setGoalInputs] = useState({ q1: "", q2: "", q3: "", q4: "", year: "" });
  const [chatInput, setChatInput] = useState("");
  const [chatName, setChatName] = useState("");
  const [chatNameSet, setChatNameSet] = useState(false);
  const [chatImgUrl, setChatImgUrl] = useState("");
  const [showImgInput, setShowImgInput] = useState(false);
  const chatEndRef = useRef(null);

  // User-specific storage key
  const uKey = useCallback((k) => userId ? `${userId}:${k}` : k, [userId]);

  // ── Load user from storage on mount ──
  useEffect(() => {
    sGet("hub-active-user").then(d => d && setUserId(d));
    sGet("hub-lang").then(d => d && setLang(d));
    sGet("hub-theme").then(d => d && setTheme(d));
    sGet("hub-textsize").then(d => d && setTextSize(d));
  }, []);

  // ── Load user-specific data when userId changes ──
  useEffect(() => {
    if (!userId) return;
    sGet(`${userId}:journal-trades`).then(d => d && setTrades(d));
    sGet(`${userId}:private-balance`).then(d => d !== null && setPrivateBalance(d));
    sGet(`${userId}:funded-accounts`).then(d => d && setFundedAccounts(d));
    sGet(`${userId}:chat-name`).then(d => { if (d) { setChatName(d); setChatNameSet(true); } });
    sGet(`${userId}:goals`).then(d => d && setGoals(d));
  }, [userId]);

  // ── Timers ──
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const delta = (Math.random() - 0.48) * p.base * 0.0003;
        const np = p.price + delta;
        return { ...p, price: np, change: ((np - p.base) / p.base) * 100, spark: [...p.spark.slice(1), np] };
      }));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  // ── Chat + Lab realtime via Firebase ──
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Realtime chat listener — instant updates, no polling
  useEffect(() => {
    const unsub = fbListen("hub-chat-v2", (d) => {
      if (d && Array.isArray(d)) {
        // Push notification for new messages
        if (d.length > lastChatCount.current && lastChatCount.current > 0 && tab !== "chat") {
          const latest = d[d.length - 1];
          if (latest && latest.name !== chatName && "Notification" in window && Notification.permission === "granted") {
            new Notification(`Obitra — ${latest.name}`, { body: latest.text || "Sent an image", icon: "/icon-192.png" });
          }
        }
        lastChatCount.current = d.length;
        setChatMsgs(d);
      }
    });
    return () => unsub && unsub();
  }, [tab, chatName]);

  // Realtime lab galleries listener
  useEffect(() => {
    const unsub = fbListen("lab-galleries", (d) => {
      if (d && Array.isArray(d)) setLabGalleries(d);
    });
    return () => unsub && unsub();
  }, []);

  // ── Load live economic calendar ──
  useEffect(() => {
    fetchEconomicCalendar().then(events => {
      if (events && events.length > 0) setNewsEvents(events);
    });
    // Refresh every 30 min
    const t = setInterval(() => {
      fetchEconomicCalendar().then(events => {
        if (events && events.length > 0) setNewsEvents(events);
      });
    }, 30 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);

  // ── Computed ──
  const currentBalance = useMemo(() => {
    if (capitalMode === "private") return privateBalance;
    if (selectedFunded === "all") return fundedAccounts.reduce((s, a) => s + a.balance, 0);
    const acc = fundedAccounts.find(a => a.id === selectedFunded);
    return acc ? acc.balance : 0;
  }, [capitalMode, privateBalance, fundedAccounts, selectedFunded]);

  const filteredTrades = useMemo(() => {
    if (capitalMode === "private") return trades.filter(t => t.capital === "private" || !t.capital);
    if (selectedFunded === "all") return trades.filter(t => t.capital === "funded");
    return trades.filter(t => t.capital === "funded" && t.fundedAccountId === selectedFunded);
  }, [trades, capitalMode, selectedFunded]);

  const stats = useMemo(() => calcStats(filteredTrades, currentBalance), [filteredTrades, currentBalance]);

  const sessions = [
    { name: "Sydney", open: clock.getUTCHours() >= 21 || clock.getUTCHours() < 6 },
    { name: "Tokyo", open: clock.getUTCHours() >= 0 && clock.getUTCHours() < 9 },
    { name: "London", open: clock.getUTCHours() >= 7 && clock.getUTCHours() < 16 },
    { name: "New York", open: clock.getUTCHours() >= 13 && clock.getUTCHours() < 22 },
  ];

  const filteredEvents = NEWS_EVENTS.filter(e =>
    newsFilter === "all" || (newsFilter === "usd" && e.currency === "USD") || (newsFilter === "eur" && e.currency === "EUR")
  );

  const groupedEvents = {};
  filteredEvents.forEach(e => {
    if (!groupedEvents[e.date]) groupedEvents[e.date] = [];
    groupedEvents[e.date].push(e);
  });

  const getDateLabel = (d) => {
    const today = new Date().toISOString().slice(0, 10);
    const tmr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    if (d === today) return t("today");
    if (d === tmr) return t("tomorrow");
    return new Date(d + "T00:00").toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  const pair = prices[selPair];
  const pd = pair.base > 100 ? 2 : pair.base > 10 ? 3 : 4;
  const totalFundedBal = fundedAccounts.reduce((s, a) => s + a.balance, 0);
  const pnlDataMap = { daily: stats.dailyPnl, weekly: stats.weeklyPnl, monthly: stats.monthlyPnl, yearly: stats.yearlyPnl };

  // ── Handlers ──
  const saveTrade = () => {
    const pnl = parseFloat(form.pnl);
    if (isNaN(pnl)) return;
    const trade = {
      ...form, pnl, rr: parseFloat(form.rr) || 0, lotSize: parseFloat(form.lotSize) || 0,
      id: editing ? editing.id : Date.now().toString(), capital: capitalMode,
      fundedAccountId: capitalMode === "funded" ? (selectedFunded === "all" ? (fundedAccounts[0]?.id || "") : selectedFunded) : "",
    };
    const u = editing ? trades.map(t => t.id === editing.id ? trade : t) : [...trades, trade];
    setTrades(u); sSet(uKey("journal-trades"), u);
    setEditing(null); setJView("log"); setForm(emptyForm);
  };

  const delTrade = (id) => {
    const u = trades.filter(t => t.id !== id);
    setTrades(u); sSet(uKey("journal-trades"), u); setConfirmDel(null);
  };

  const editTrade = (t) => {
    setForm({ ...t, pnl: String(t.pnl), rr: String(t.rr || ""), lotSize: String(t.lotSize || "0.1") });
    setEditing(t); setJView("add");
  };

  const addFundedAccount = () => {
    if (!newAccName.trim()) return;
    const acc = { id: Date.now().toString(), name: newAccName.trim(), provider: newAccProvider, balance: parseFloat(newAccBalance) || 100000 };
    const u = [...fundedAccounts, acc];
    setFundedAccounts(u); sSet(uKey("funded-accounts"), u);
    setNewAccName(""); setNewAccBalance("100000");
  };

  const removeFundedAccount = (id) => {
    const u = fundedAccounts.filter(a => a.id !== id);
    setFundedAccounts(u); sSet(uKey("funded-accounts"), u);
    if (selectedFunded === id) setSelectedFunded("all");
  };

  const updatePrivBal = (v) => {
    const n = parseFloat(v) || 0;
    setPrivateBalance(n); sSet(uKey("private-balance"), n);
  };

  const toggleTheme = () => {
    const n = theme === "dark" ? "light" : "dark";
    setTheme(n); sSet("hub-theme", n);
  };

  const toggleLang = () => {
    const n = lang === "en" ? "de" : "en";
    setLang(n); sSet("hub-lang", n);
  };

  const cycleTextSize = () => {
    const order = ["small", "medium", "large"];
    const next = order[(order.indexOf(textSize) + 1) % 3];
    setTextSize(next); sSet("hub-textsize", next);
  };

  const fontScale = textSize === "large" ? 1.4 : textSize === "medium" ? 1.2 : 1;
  const baseFontSize = Math.round(13 * fontScale);

  const handleLogin = () => {
    const name = userInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!name) return;
    setUserId(name);
    sSet("hub-active-user", name);
    // Reset state for new user load
    setTrades([]); setPrivateBalance(10000);
    setFundedAccounts([{ id: "1", name: "FTMO #1", provider: "FTMO", balance: 100000 }]);
    setChatName(""); setChatNameSet(false);
    setUserInput("");
  };

  const handleSwitchUser = () => {
    setUserId(null);
    sSet("hub-active-user", null);
    setTrades([]); setTab("dashboard"); setJView("stats");
    setChatName(""); setChatNameSet(false);
  };


  // ── Chat ──
  const sendChat = async (imgUrl) => {
    const text = chatInput.trim();
    const img = imgUrl || "";
    if (!text && !img) return;
    if (!chatNameSet) return;
    const msg = { id: Date.now(), name: chatName, text, image: img, time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) };
    const updated = [...chatMsgs, msg].slice(-200);
    setChatMsgs(updated); setChatInput(""); setChatImgUrl(""); setShowImgInput(false);
    await sSetShared("hub-chat-v2", updated);
  };

  // ── Lab Galleries ──
  const saveGallery = async () => {
    if (!galleryName.trim()) return;
    const g = { id: Date.now(), name: galleryName.trim(), desc: galleryDesc.trim(), thumb: galleryThumb.trim(), author: userId, posts: [], date: new Date().toLocaleDateString("en-GB") };
    const updated = [g, ...labGalleries];
    setLabGalleries(updated); await sSetShared("lab-galleries", updated);
    setGalleryName(""); setGalleryDesc(""); setGalleryThumb(""); setShowGalleryForm(false);
  };
  const deleteGallery = async (id) => {
    const updated = labGalleries.filter(g => g.id !== id);
    setLabGalleries(updated); await sSetShared("lab-galleries", updated);
    if (activeGallery === id) setActiveGallery(null);
  };
  const saveEduPost = async () => {
    if (!eduTitle.trim() || !eduBody.trim() || !activeGallery) return;
    const post = { id: Date.now(), title: eduTitle.trim(), body: eduBody.trim(), tag: eduTag, image: eduImage.trim(), author: userId, date: new Date().toLocaleDateString("en-GB") };
    const updated = labGalleries.map(g => g.id === activeGallery ? { ...g, posts: [post, ...g.posts] } : g);
    setLabGalleries(updated); await sSetShared("lab-galleries", updated);
    setEduTitle(""); setEduBody(""); setEduTag("concept"); setEduImage(""); setShowEduForm(false);
  };
  const deleteEduPost = async (galleryId, postId) => {
    const updated = labGalleries.map(g => g.id === galleryId ? { ...g, posts: g.posts.filter(p => p.id !== postId) } : g);
    setLabGalleries(updated); await sSetShared("lab-galleries", updated);
  };

  // ── Sidebar config ──
  const sideItems = [
    { id: "dashboard", icon: "dashboard", label: t("dashboard") },
    { id: "chart", icon: "chart", label: "TradingView" },
    { id: "journal", icon: "journal", label: t("journal") },
    { type: "divider" },
    { id: "news", icon: "news", label: t("newsHub") },
    { id: "social", icon: "social", label: t("socialIntel") },
    { type: "divider" },
    { id: "chat", icon: "chat", label: t("chatRoom") },
    { id: "edu", icon: "lab", label: "Lab" },
  ];

  const tabTitles = {
    dashboard: t("titleDashboard"), chart: t("titleChart"), journal: t("titleJournal"),
    news: t("titleNews"), social: t("titleSocial"),
    chat: t("titleChat"), edu: lang === "de" ? "Lab" : "Lab",
  };

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  // ── LOGIN SCREEN ──
  if (!userId) {
    return (
      <div style={{ display: "flex", height: "100dvh", minHeight: "-webkit-fill-available", background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", fontSize: 13, alignItems: "center", justifyContent: "center", transition: "background 0.3s", position: "relative", overflow: "hidden", fontSize: baseFontSize }}>
        <StarField theme={theme} />
        <div style={{ position: "fixed", top: 18, right: 18, display: "flex", gap: 6, zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2, background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 20, padding: 2, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur }}>
            {["small", "medium", "large"].map(s => (
              <span key={s} onClick={() => { setTextSize(s); sSet("hub-textsize", s); }}
                style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, cursor: "pointer", background: textSize === s ? T.accent : "transparent", color: textSize === s ? "#fff" : T.textDim, fontFamily: "'Space Grotesk'", transition: "all 0.15s" }}>
                {t(s)}
              </span>
            ))}
          </div>
          <div onClick={toggleLang} style={{ width: 34, height: 34, borderRadius: "50%", background: T.glass, border: `1px solid ${T.glassBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "'Space Grotesk'", color: T.accent, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur }}>{lang === "en" ? "DE" : "EN"}</div>
          <div onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: "50%", background: T.glass, border: `1px solid ${T.glassBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur }}>{theme === "dark" ? <Icon name="sun" color={T.accent} /> : <Icon name="moon" color={T.accent} />}</div>
        </div>
        <div className="ob-fade" style={{ textAlign: "center", maxWidth: 400, position: "relative", zIndex: 1 }}>
          <div className="ob-orb" style={{ margin: "0 auto 20px", filter: "drop-shadow(0 8px 32px rgba(90,125,159,0.5))" }}><EnergyOrb size={72} /></div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.04em", background: `linear-gradient(135deg, ${T.text}, ${T.accentLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t("welcomeTitle")}</h1>
          <p style={{ fontSize: 12, color: T.textDim, margin: "0 0 6px", lineHeight: 1.6 }}>{t("welcomeSub")}</p>
          <p style={{ fontSize: 10, color: T.textMuted, margin: "0 0 22px" }}>Journal · Charts · News · Chat · Lab</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <input value={userInput} onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
              placeholder={t("username")}
              style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, padding: "12px 18px", color: T.text, fontSize: 13, outline: "none", width: 200, fontFamily: "'Space Grotesk'", backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur }} />
            <button className="ob-btn" onClick={handleLogin}
              style={{ padding: "12px 24px", borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentLight})`, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", boxShadow: `0 4px 20px ${T.accent}40` }}>
              {t("loginBtn")}
            </button>
          </div>
          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {["Multi-User", lang === "de" ? "Dunkel/Hell" : "Dark/Light", "DE/EN", lang === "de" ? "Persistent" : "Persistent"].map(f => (
              <span key={f} style={{ fontSize: 8, color: T.textMuted, padding: "3px 10px", borderRadius: 20, border: `1px solid ${T.glassBorder}`, background: T.glass, backdropFilter: T.glassBlur }}>{f}</span>
            ))}
          </div>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>
      </div>
    );
  }

  // ── MAIN APP ──
  return (
    <div className="ob-safe" style={{ display: "flex", height: "100dvh", minHeight: "-webkit-fill-available", background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", fontSize: 13, overflow: "hidden", transition: "background 0.3s", position: "relative" }}>
      {theme === "dark" && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 20%, rgba(90,125,159,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(122,157,191,0.04) 0%, transparent 50%)", pointerEvents: "none", zIndex: 0 }} />}

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99, backdropFilter: "blur(4px)" }} />
      )}

      {/* ══ SIDEBAR ══ */}
      <div style={{
        width: isMobile ? 260 : 195, minWidth: isMobile ? 260 : 195,
        background: isMobile ? (theme === "dark" ? "#111111" : "#ffffff") : (theme === "dark" ? "rgba(255,255,255,0.03)" : T.card),
        borderRight: `1px solid ${T.glassBorder}`,
        display: "flex", flexDirection: "column",
        padding: "12px 0",
        transition: "transform 0.3s ease, background 0.3s",
        backdropFilter: isMobile ? "none" : T.glassBlur, WebkitBackdropFilter: isMobile ? "none" : T.glassBlur,
        zIndex: 100,
        ...(isMobile ? {
          position: "fixed", top: 0, left: 0, bottom: 0,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: sidebarOpen ? "8px 0 32px rgba(0,0,0,0.5)" : "none",
        } : {}),
      }}>
        <div style={{ padding: "0 15px 16px", borderBottom: `1px solid ${T.glassBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div className="ob-orb" style={{ filter: "drop-shadow(0 2px 10px rgba(90,125,159,0.4))" }}><EnergyOrb size={28} /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Obitra</div>
              <div style={{ fontSize: 8, color: T.textDim }}>{t("proTerminal")}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "10px 7px", flex: 1, overflow: "auto" }}>
          {sideItems.map((item, idx) => item.type === "divider" ? (
            <div key={`d${idx}`} style={{ height: 1, background: T.glassBorder, margin: "6px 10px" }} />
          ) : (
            <div key={item.id} onClick={() => { setTab(item.id); if (isMobile) setSidebarOpen(false); }}
              className="ob-side-item ob-fade"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2, background: tab === item.id ? `${T.accent}18` : "transparent", color: tab === item.id ? T.accentLight : T.textDim, fontSize: 11, fontWeight: tab === item.id ? 600 : 400, borderLeft: tab === item.id ? `3px solid ${T.accent}` : "3px solid transparent", position: "relative", boxShadow: tab === item.id ? `inset 0 0 12px ${T.accent}08` : "none" }}>
              <Icon name={item.icon} color={tab === item.id ? T.accentLight : T.textDim} />
              {item.label}
              {item.id === "news" && NEWS_EVENTS.some(e => e.date === new Date().toISOString().slice(0, 10)) && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.red, marginLeft: "auto", boxShadow: `0 0 6px ${T.red}80`, animation: "pulse 2s infinite" }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: "10px 15px", borderTop: `1px solid ${T.glassBorder}` }}>
          <div style={{ fontSize: 8, color: T.textDim, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{t("sessions")}</div>
          {sessions.map(s => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.open ? T.green : T.red, boxShadow: s.open ? `0 0 6px ${T.green}60` : "none" }} />
              <span style={{ color: s.open ? T.text : T.textMuted }}>{s.name}</span>
              <span style={{ marginLeft: "auto", fontSize: 8, color: s.open ? T.green : T.textMuted }}>{s.open ? t("open") : t("closed")}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: "8px 15px", borderTop: `1px solid ${T.glassBorder}`, textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 700 }}>{clock.toLocaleTimeString(lang === "de" ? "de-DE" : "en-GB")}</div>
          <div style={{ fontSize: 8, color: T.textDim, marginTop: 1 }}>{clock.toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { weekday: "short", day: "numeric", month: "short" })}</div>
        </div>

        {/* User indicator */}
        <div style={{ padding: "8px 15px", borderTop: `1px solid ${T.glassBorder}`, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", boxShadow: `0 2px 10px ${T.accent}30` }}>{userId?.[0]?.toUpperCase()}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 10, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userId}</div>
          </div>
          <span onClick={handleSwitchUser} style={{ fontSize: 8, color: T.textDim, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>{t("switchUser")}</span>
        </div>

        {/* Settings toggles */}
        <div style={{ padding: "8px 15px", borderTop: `1px solid ${T.glassBorder}`, display: "flex", alignItems: "center", gap: 5 }}>
          {/* Theme */}
          <div onClick={toggleTheme} title={theme === "dark" ? "Light mode" : "Dark mode"}
            style={{ width: 28, height: 28, borderRadius: 8, background: T.glass, border: `1px solid ${T.glassBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur }}>
            {theme === "dark" ? <Icon name="sun" color={T.accent} size={12} /> : <Icon name="moon" color={T.accent} size={12} />}
          </div>
          {/* Lang */}
          <div onClick={toggleLang} title="DE / EN"
            style={{ width: 28, height: 28, borderRadius: 8, background: T.glass, border: `1px solid ${T.glassBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 9, fontWeight: 700, fontFamily: "'Space Grotesk'", color: T.accent, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur }}>
            {lang === "en" ? "DE" : "EN"}
          </div>
          {/* Text size */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2, background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: 2, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur }}>
            {["small", "medium", "large"].map(s => (
              <span key={s} onClick={() => { setTextSize(s); sSet("hub-textsize", s); }}
                style={{ padding: "4px 7px", borderRadius: 8, fontSize: 8, fontWeight: 700, cursor: "pointer", background: textSize === s ? T.accent : "transparent", color: textSize === s ? "#fff" : T.textDim, fontFamily: "'Space Grotesk'", transition: "all 0.15s" }}>
                {t(s)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="ob-content" style={{ flex: 1, overflow: tab === "chat" ? "hidden" : "auto", padding: isMobile ? "6px 10px 16px" : 20, position: "relative", fontSize: baseFontSize, display: tab === "chat" ? "flex" : "block", flexDirection: "column", WebkitOverflowScrolling: "touch" }}>
        <StarField theme={theme} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: tab === "chat" ? 6 : 10, position: "relative", zIndex: 1, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isMobile && (
              <div onClick={() => setSidebarOpen(true)}
                style={{ width: 32, height: 32, borderRadius: 8, background: T.glass, border: `1px solid ${T.glassBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </div>
            )}
            <div>
              <h1 style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, margin: 0 }}>{tabTitles[tab]}</h1>
              {tab === "journal" && <p style={{ fontSize: 10, color: T.textDim, margin: "2px 0 0" }}>{filteredTrades.length} {t("trades")} — {capitalMode === "private" ? t("private") : t("funded")} — Bal: ${currentBalance.toLocaleString()}</p>}
            </div>
          </div>
        </div>

        {/* ═══ DASHBOARD ═══ */}
        {tab === "dashboard" && (
          <div style={{ position: "relative", zIndex: 1 }}>

            {/* Red Folder — Today + Tomorrow */}
            <div className="ob-card" style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{t("redFolder")}</span>
                <span onClick={() => setTab("news")} style={{ fontSize: 9, color: T.accent, cursor: "pointer" }}>{t("seeAll")}</span>
              </div>
              {(() => {
                const today = new Date().toISOString().slice(0, 10);
                const tmr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
                const relevant = NEWS_EVENTS.filter(e => e.date === today || e.date === tmr);
                if (relevant.length === 0) return <div style={{ fontSize: 10, color: T.textMuted, textAlign: "center", padding: 8 }}>{lang === "de" ? "Keine Red-Folder Events heute/morgen" : "No red folder events today/tomorrow"}</div>;
                let lastDate = "";
                return relevant.map((e, i) => {
                  const showDate = e.date !== lastDate;
                  lastDate = e.date;
                  const isToday = e.date === today;
                  return (
                    <div key={i}>
                      {showDate && (
                        <div style={{ fontSize: 9, fontWeight: 700, color: T.accent, marginTop: i > 0 ? 6 : 0, marginBottom: 4, padding: "2px 6px", background: `${T.accent}10`, borderRadius: 4, display: "inline-block" }}>
                          {isToday ? (lang === "de" ? "Heute" : "Today") : (lang === "de" ? "Morgen" : "Tomorrow")} — {e.date}
                        </div>
                      )}
                      <div style={{ display: "grid", gridTemplateColumns: "44px 32px 1fr 50px 50px", alignItems: "center", padding: "4px 6px", borderRadius: 4, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", gap: 4, fontSize: 10 }}>
                        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 9, color: T.textDim }}>{e.time}</span>
                        <span style={{ fontSize: 7, fontWeight: 700, padding: "1px 4px", borderRadius: 4, background: e.currency === "USD" ? `${T.green}20` : `${T.accent}20`, color: e.currency === "USD" ? T.green : T.accentLight, textAlign: "center" }}>{e.currency}</span>
                        <span style={{ fontWeight: 500, fontSize: 10 }}>{e.event}</span>
                        <span style={{ textAlign: "right", fontFamily: "'Space Grotesk'", fontSize: 8, color: T.textDim }}>{e.forecast || "—"}</span>
                        <span style={{ textAlign: "right", fontFamily: "'Space Grotesk'", fontSize: 8, color: T.textDim }}>{e.previous || "—"}</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Compound Forecast + Session Performance */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: 12, marginBottom: 18 }}>
              {/* Compound Forecast */}
              <div className="ob-card" style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{lang === "de" ? "12-Monats Prognose" : "12-Month Forecast"}</span>
                  <span onClick={() => setTab("journal")} style={{ fontSize: 9, color: T.accent, cursor: "pointer", fontWeight: 600 }}>{t("openArrow")}</span>
                </div>
                <CompoundForecast stats={stats} currentBalance={currentBalance} T={T} />
              </div>

              {/* Performance by Session */}
              <div className="ob-card" style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 14 }}>{lang === "de" ? "Performance / Session" : "Performance by Session"}</div>
                {(() => {
                  const sessions = { London: { pnl: 0, count: 0, wins: 0 }, "New York": { pnl: 0, count: 0, wins: 0 }, "Off-Session": { pnl: 0, count: 0, wins: 0 } };
                  filteredTrades.forEach(t => {
                    const s = t.session === "London" ? "London" : t.session === "New York" ? "New York" : "Off-Session";
                    sessions[s].pnl += t.pnl; sessions[s].count++; if (t.pnl > 0) sessions[s].wins++;
                  });
                  const maxPnl = Math.max(...Object.values(sessions).map(s => Math.abs(s.pnl)), 1);
                  return Object.entries(sessions).map(([name, data]) => {
                    const pct = data.count > 0 ? (data.wins / data.count * 100) : 0;
                    const barW = Math.abs(data.pnl) / maxPnl * 100;
                    return (
                      <div key={name} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 600 }}>{name}</span>
                          <div style={{ display: "flex", gap: 8 }}>
                            <span style={{ fontSize: 9, color: T.textDim }}>{data.count}t</span>
                            <span style={{ fontSize: 9, color: T.textDim }}>{pct.toFixed(0)}% WR</span>
                            <span style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Space Grotesk'", color: T.text }}>{data.pnl >= 0 ? "+" : ""}${data.pnl.toFixed(0)}</span>
                          </div>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${barW}%`, background: data.pnl >= 0 ? T.journalAccent : "rgba(255,255,255,0.25)", borderRadius: 4, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Goals + Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {/* Goals */}
              <div className="ob-card" style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{lang === "de" ? "Ziele" : "Goals"}</span>
                  {!editGoals ? (
                    <span onClick={() => { setEditGoals(true); setGoalInputs({ q1: goals.q1 || "", q2: goals.q2 || "", q3: goals.q3 || "", q4: goals.q4 || "", year: goals.year || "" }); }}
                      style={{ fontSize: 8, color: T.accent, cursor: "pointer", fontWeight: 600 }}>{lang === "de" ? "Bearbeiten" : "Edit"}</span>
                  ) : (
                    <div style={{ display: "flex", gap: 4 }}>
                      <span onClick={() => {
                        const g = { q1: parseFloat(goalInputs.q1) || 0, q2: parseFloat(goalInputs.q2) || 0, q3: parseFloat(goalInputs.q3) || 0, q4: parseFloat(goalInputs.q4) || 0, year: parseFloat(goalInputs.year) || 0 };
                        setGoals(g); sSet(uKey("goals"), g); setEditGoals(false);
                      }} style={{ fontSize: 8, color: T.green, cursor: "pointer", fontWeight: 700 }}>{lang === "de" ? "Speichern" : "Save"}</span>
                      <span onClick={() => setEditGoals(false)} style={{ fontSize: 8, color: T.textDim, cursor: "pointer", fontWeight: 600 }}>{lang === "de" ? "Abbrechen" : "Cancel"}</span>
                    </div>
                  )}
                </div>
                {editGoals ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {["q1", "q2", "q3", "q4", "year"].map(k => (
                      <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, minWidth: 30, color: T.textDim }}>{k === "year" ? (new Date().getFullYear()) : k.toUpperCase()}</span>
                        <input type="number" value={goalInputs[k]} onChange={e => setGoalInputs({ ...goalInputs, [k]: e.target.value })} placeholder="$"
                          style={{ flex: 1, background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "5px 8px", color: T.text, fontSize: 10, outline: "none", fontFamily: "'Space Grotesk'" }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  (() => {
                    const now = new Date();
                    const currentQ = Math.floor(now.getMonth() / 3) + 1;
                    const year = now.getFullYear();
                    const qPnl = { 1: 0, 2: 0, 3: 0, 4: 0 };
                    let yearPnl = 0;
                    filteredTrades.forEach(t => {
                      const d = new Date(t.date);
                      if (d.getFullYear() === year) {
                        const q = Math.floor(d.getMonth() / 3) + 1;
                        qPnl[q] += t.pnl;
                        yearPnl += t.pnl;
                      }
                    });
                    const items = [
                      { label: "Q1", goal: goals.q1, actual: qPnl[1], active: currentQ === 1 },
                      { label: "Q2", goal: goals.q2, actual: qPnl[2], active: currentQ === 2 },
                      { label: "Q3", goal: goals.q3, actual: qPnl[3], active: currentQ === 3 },
                      { label: "Q4", goal: goals.q4, actual: qPnl[4], active: currentQ === 4 },
                      { label: year.toString(), goal: goals.year, actual: yearPnl, active: true },
                    ];
                    return items.map(it => {
                      const pct = it.goal > 0 ? Math.min((it.actual / it.goal) * 100, 100) : 0;
                      const over = it.goal > 0 && it.actual > it.goal;
                      return (
                        <div key={it.label} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: it.active ? 700 : 500, color: it.active ? T.text : T.textDim }}>
                              {it.label} {it.active && it.label.startsWith("Q") && <span style={{ fontSize: 7, color: T.accent }}> ACTIVE</span>}
                            </span>
                            <span style={{ fontSize: 9, fontFamily: "'Space Grotesk'", fontWeight: 600, color: T.text }}>
                              ${it.actual.toFixed(0)} <span style={{ color: T.textDim, fontWeight: 400 }}>/ ${it.goal > 0 ? it.goal.toFixed(0) : "—"}</span>
                            </span>
                          </div>
                          <div style={{ height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: over ? T.green : T.journalAccent, borderRadius: 4, transition: "width 0.5s" }} />
                          </div>
                        </div>
                      );
                    });
                  })()
                )}
              </div>

              {/* Quick Journal Stats */}
              <div className="ob-card" style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{t("journal")}</span>
                  <span onClick={() => setTab("journal")} style={{ fontSize: 9, color: T.accent, cursor: "pointer" }}>{t("openArrow")}</span>
                </div>
                {/* Streak Badge */}
                {stats.streak >= 3 && (
                  <div style={{ textAlign: "center", marginBottom: 10, padding: "6px 0" }}>
                    <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: stats.streakType === "W" ? `${T.green}18` : `${T.red}18`, color: stats.streakType === "W" ? T.green : T.red, border: `1px solid ${stats.streakType === "W" ? T.green : T.red}30`, animation: "glowPulse 2s infinite" }}>
                      {stats.streakType === "W" ? "🔥" : "❄️"} {stats.streak}{stats.streakType} Streak
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 12 }}>
                  <DonutChart value={Math.round(stats.winRate)} label={t("winRate")} color={stats.winRate >= 50 ? T.green : stats.totalTrades ? T.red : T.glassBorder} T={T} />
                  <DonutChart value={Math.min(Math.round(stats.pf * 25), 100)} label="PF" color={T.accent} T={T} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  <div style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.025)" }}>
                    <div style={{ fontSize: 8, color: T.textDim }}>P&L</div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13, color: stats.totalPnl >= 0 ? T.green : T.red }}>${stats.totalPnl.toFixed(0)}</div>
                  </div>
                  <div style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.025)" }}>
                    <div style={{ fontSize: 8, color: T.textDim }}>{t("trades")}</div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13 }}>{stats.totalTrades}</div>
                  </div>
                  <div style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.025)" }}>
                    <div style={{ fontSize: 8, color: T.textDim }}>R:R</div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13 }}>{stats.avgRR.toFixed(2)}</div>
                  </div>
                  <div style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.025)" }}>
                    <div style={{ fontSize: 7, color: T.textDim }}>{lang === "de" ? "Ø Gewinn" : "Avg Win"}</div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 11, color: T.green }}>${stats.avgWin.toFixed(0)}</div>
                  </div>
                  <div style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.025)" }}>
                    <div style={{ fontSize: 7, color: T.textDim }}>{lang === "de" ? "Ø Verlust" : "Avg Loss"}</div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 11, color: T.red }}>${stats.avgLoss.toFixed(0)}</div>
                  </div>
                  <div style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.025)" }}>
                    <div style={{ fontSize: 7, color: T.textDim }}>{lang === "de" ? "Erwartung" : "Expectancy"}</div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 11, color: stats.expectancy >= 0 ? T.green : T.red }}>${stats.expectancy.toFixed(0)}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
        {/* ═══ TRADINGVIEW ═══ */}
        {tab === "chart" && (
          <ChartHub T={T} lang={lang} isMobile={isMobile} />
        )}

        {/* ═══ JOURNAL ═══ */}
        {tab === "journal" && (
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Sub-nav */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              {[{ id: "stats", l: t("statistics"), ic: "stats" }, { id: "log", l: t("tradeLog"), ic: "list" }, { id: "add", l: editing ? t("editTrade") : t("newTrade"), ic: editing ? "edit" : "plus" }, { id: "import", l: lang === "de" ? "Import" : "Import", ic: "trendUp" }, { id: "risk", l: lang === "de" ? "Risiko" : "Risk Calc", ic: "target" }].map(v => (
                <span key={v.id} onClick={() => { setJView(v.id); if (v.id === "add" && !editing) setForm(emptyForm); }}
                  style={{ padding: "6px 13px", borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: "pointer", background: jView === v.id ? T.accent : T.glass, border: `1px solid ${jView === v.id ? T.accent : T.glassBorder}`, color: jView === v.id ? "#fff" : T.textDim, display: "flex", alignItems: "center", gap: 5, backdropFilter: jView !== v.id ? T.glassBlur : "none", WebkitBackdropFilter: jView !== v.id ? T.glassBlur : "none" }}>
                  <Icon name={v.ic} color={jView === v.id ? "#fff" : T.textDim} size={12} />{v.l}
                </span>
              ))}
              <span onClick={() => setShowSettings(!showSettings)}
                style={{ padding: "6px 13px", borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: "pointer", background: showSettings ? T.accent : T.glass, border: `1px solid ${showSettings ? T.accent : T.glassBorder}`, color: showSettings ? "#fff" : T.textDim, display: "flex", alignItems: "center", gap: 5, backdropFilter: !showSettings ? T.glassBlur : "none", WebkitBackdropFilter: !showSettings ? T.glassBlur : "none" }}>
                <Icon name="settings" color={showSettings ? "#fff" : T.textDim} size={12} /> {t("settings")}
              </span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 2, background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: 2, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur }}>
                {["private", "funded"].map(m => (
                  <span key={m} onClick={() => setCapitalMode(m)}
                    style={{ padding: "5px 11px", borderRadius: 8, fontSize: 9, fontWeight: 600, cursor: "pointer", background: capitalMode === m ? T.accent : "transparent", color: capitalMode === m ? "#fff" : T.textDim }}>
                    {t(m)}
                  </span>
                ))}
              </div>
            </div>

            {/* Funded selector */}
            {capitalMode === "funded" && (
              <div style={{ display: "flex", gap: 3, marginBottom: 12, flexWrap: "wrap" }}>
                <span onClick={() => setSelectedFunded("all")}
                  style={{ padding: "5px 10px", borderRadius: 8, fontSize: 9, fontWeight: 600, cursor: "pointer", background: selectedFunded === "all" ? T.accent : T.glassBorder, color: selectedFunded === "all" ? "#fff" : T.textDim }}>
                  {t("all")} (${totalFundedBal.toLocaleString()})
                </span>
                {fundedAccounts.map(a => (
                  <span key={a.id} onClick={() => setSelectedFunded(a.id)}
                    style={{ padding: "5px 10px", borderRadius: 8, fontSize: 9, fontWeight: 600, cursor: "pointer", background: selectedFunded === a.id ? T.accent : T.glassBorder, color: selectedFunded === a.id ? "#fff" : T.textDim }}>
                    {a.name} (${a.balance.toLocaleString()})
                  </span>
                ))}
              </div>
            )}

            {/* Settings */}
            {showSettings && (
              <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 18, marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{t("accountSettings")}</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: T.accent }}>{t("privateAccount")}</div>
                    <InputField label={t("accountBalance")} type="number" value={String(privateBalance)} onChange={v => updatePrivBal(v)} T={T} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: T.accent }}>{t("fundedAccounts")}</div>
                    {fundedAccounts.map(a => (
                      <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: 8, marginBottom: 3, background: "rgba(255,255,255,0.025)" }}>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 600 }}>{a.name}</span>
                          <span style={{ fontSize: 9, color: T.textDim, marginLeft: 6 }}>{a.provider} — ${a.balance.toLocaleString()}</span>
                        </div>
                        <span onClick={() => removeFundedAccount(a.id)}
                          style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: `${T.red}15`, color: T.red, cursor: "pointer", fontWeight: 600 }}>×</span>
                      </div>
                    ))}
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr auto", gap: 4, marginTop: 8, alignItems: "flex-end" }}>
                      <InputField label={t("name")} value={newAccName} onChange={setNewAccName} placeholder="FTMO #2" T={T} />
                      <InputField label={t("provider")} options={["FTMO", "MyFundedFX", "The5ers", "Topstep", "True Forex", "E8", "Other"]} value={newAccProvider} onChange={setNewAccProvider} T={T} />
                      <InputField label={t("balance")} type="number" value={newAccBalance} onChange={setNewAccBalance} T={T} />
                      <button onClick={addFundedAccount}
                        style={{ padding: "7px 12px", borderRadius: 8, background: T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        {t("add")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats View */}
            {jView === "stats" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                  <StatCard icon="target" label={t("winRate")} value={`${stats.winRate.toFixed(1)}%`} sub={`${stats.wins}W / ${stats.losses}L`} T={T} />
                  <StatCard icon="dollar" label={t("totalPnl")} value={`$${stats.totalPnl.toFixed(2)}`} sub={`Bal: $${stats.balance.toLocaleString()}`} T={T} />
                  <StatCard icon="ratio" label={t("profitFactor")} value={stats.pf === Infinity ? "∞" : stats.pf.toFixed(2)} sub={`RR: ${stats.avgRR.toFixed(2)}`} T={T} />
                  <StatCard icon="barChart" label={t("expectancy")} value={`$${stats.expectancy.toFixed(2)}`} sub={`${t("perTrade")} | ${stats.streak > 0 ? stats.streak + stats.streakType : "—"} Streak`} T={T} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                  <StatCard icon="trendUp" label={t("avgWin")} value={`$${stats.avgWin.toFixed(2)}`} T={T} />
                  <StatCard icon="trendDown" label={t("avgLoss")} value={`$${stats.avgLoss.toFixed(2)}`} T={T} />
                  <StatCard icon="arrowUp" label={t("longWR")} value={`${stats.longWR.toFixed(1)}%`} T={T} />
                  <StatCard icon="arrowDown" label={t("shortWR")} value={`${stats.shortWR.toFixed(1)}%`} T={T} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t("equityCurve")}</div>
                    <EquityCurve data={stats.balHist} T={T} />
                  </div>
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>P&L</span>
                      <div style={{ display: "flex", gap: 2 }}>
                        {["daily", "weekly", "monthly", "yearly"].map(p => (
                          <span key={p} onClick={() => setPnlPeriod(p)}
                            style={{ padding: "3px 7px", borderRadius: 4, fontSize: 8, fontWeight: 600, cursor: "pointer", background: pnlPeriod === p ? T.accent : "transparent", color: pnlPeriod === p ? "#fff" : T.textDim }}>
                            {p[0].toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <PnlBars data={pnlDataMap[pnlPeriod]} T={T} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t("byPair")}</div>
                    {Object.entries(stats.pairStats).length === 0
                      ? <div style={{ color: T.textMuted, fontSize: 11, textAlign: "center", padding: 16 }}>{t("noData")}</div>
                      : Object.entries(stats.pairStats).sort((a, b) => b[1].pnl - a[1].pnl).map(([p, s]) => (
                        <div key={p} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 8px", borderRadius: 8, marginBottom: 1, background: "rgba(255,255,255,0.02)" }}>
                          <span style={{ fontWeight: 600, fontSize: 11 }}>{p}</span>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <span style={{ fontSize: 9, color: T.textDim }}>{s.trades}t</span>
                            <span style={{ fontSize: 9, color: T.textDim }}>{((s.wins / s.trades) * 100).toFixed(0)}%</span>
                            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: T.text, minWidth: 60, textAlign: "right" }}>{s.pnl >= 0 ? "+" : ""}${s.pnl.toFixed(2)}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t("byDay")}</div>
                    {Object.entries(stats.dayStats).length === 0
                      ? <div style={{ color: T.textMuted, fontSize: 11, textAlign: "center", padding: 16 }}>{t("noData")}</div>
                      : ["Mon", "Tue", "Wed", "Thu", "Fri"].filter(d => stats.dayStats[d]).map(d => {
                        const s = stats.dayStats[d];
                        return (
                          <div key={d} style={{ display: "flex", alignItems: "center", padding: "7px 8px", borderRadius: 8, marginBottom: 1, background: "rgba(255,255,255,0.02)", gap: 8 }}>
                            <span style={{ fontWeight: 600, fontSize: 11, minWidth: 28 }}>{d}</span>
                            <div style={{ flex: 1, height: 4, background: T.glassBorder, borderRadius: 4, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${(s.wins / s.trades) * 100}%`, background: T.journalAccent, borderRadius: 4 }} />
                            </div>
                            <span style={{ fontSize: 9, color: T.textDim }}>{s.trades}t</span>
                            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: T.text, minWidth: 55, textAlign: "right" }}>{s.pnl >= 0 ? "+" : ""}${s.pnl.toFixed(2)}</span>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
                {/* Calendar + Forecast */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginTop: 14 }}>
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{lang === "de" ? "Handelskalender" : "Trade Calendar"}</div>
                    <TradeCalendar trades={filteredTrades} T={T} />
                  </div>
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{lang === "de" ? "12-Monats Prognose (Compound)" : "12-Month Compound Forecast"}</div>
                    <CompoundForecast stats={stats} currentBalance={currentBalance} T={T} />
                  </div>
                </div>
              </div>
            )}

            {/* Trade Log */}
            {jView === "log" && (
              <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16 }}>
                {filteredTrades.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                    <button onClick={() => {
                      const headers = "date,pair,direction,session,entry,sl,exit,lots,pnl,rr,setup,emotion,notes";
                      const rows = filteredTrades.map(t => `${t.date},${t.pair},${t.direction},${t.session},${t.entryPrice || ""},${t.slPrice || ""},${t.exitPrice || ""},${t.lotSize},${t.pnl},${t.rr},${(t.setup || "").replace(/,/g, ";")},${t.emotion || ""},${(t.notes || "").replace(/,/g, ";").replace(/\n/g, " ")}`);
                      const csv = [headers, ...rows].join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `obitra-trades-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
                    }} style={{ padding: "5px 12px", borderRadius: 8, background: T.glass, border: `1px solid ${T.glassBorder}`, color: T.textDim, fontSize: 9, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="trendUp" color={T.textDim} size={10} /> {lang === "de" ? "CSV Export" : "CSV Export"}
                    </button>
                  </div>
                )}
                {filteredTrades.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 36, color: T.textMuted }}>
                    <div style={{ marginBottom: 8, opacity: 0.4 }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="16" y2="7"/><line x1="9" y1="11" x2="14" y2="11"/></svg></div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{t("noTrades")} {t(capitalMode)} {t("account")}</div>
                    <span onClick={() => { setJView("add"); setForm(emptyForm); }}
                      style={{ padding: "8px 16px", borderRadius: 8, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                      {t("logFirst")}
                    </span>
                  </div>
                ) : (
                  <div style={{ overflowX: isMobile ? "auto" : "visible" }}>
                    <div style={{ minWidth: isMobile ? 600 : "auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "72px 68px 40px 52px 52px 68px 40px 1fr 56px", padding: "7px 8px", borderRadius: 8, background: "rgba(255,255,255,0.035)", fontSize: 8, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3, gap: 4 }}>
                      <span>{t("date")}</span><span>{t("pair")}</span><span>Dir</span><span>{t("entry")}</span><span>{t("exit")}</span><span>P&L</span><span>R:R</span><span>{t("setup")}</span><span>Act</span>
                    </div>
                    {[...filteredTrades].sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => (
                      <div key={t.id} style={{ display: "grid", gridTemplateColumns: "72px 68px 40px 52px 52px 68px 40px 1fr 56px", padding: "8px 8px", borderRadius: 8, alignItems: "center", gap: 4, borderLeft: `2px solid ${T.journalAccent}`, marginBottom: 1, background: confirmDel === t.id ? `${T.red}10` : "transparent" }}>
                        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 9, color: T.textDim }}>{t.date}</span>
                        <span style={{ fontSize: 10, fontWeight: 600 }}>{t.pair}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: t.direction === "Long" ? T.journalAccent : T.textDim }}>{t.direction === "Long" ? "▲L" : "▼S"}</span>
                        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 9, color: T.textDim }}>{t.entryPrice || "—"}</span>
                        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 9, color: T.textDim }}>{t.exitPrice || "—"}</span>
                        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: T.text }}>{t.pnl > 0 ? "+" : ""}{t.pnl.toFixed(2)}</span>
                        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 9, color: T.textDim }}>{t.rr ? `${t.rr}R` : "—"}</span>
                        <span style={{ fontSize: 9, color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.setup || t.notes || "—"}{t.screenshot ? " 📷" : ""}</span>
                        <div style={{ display: "flex", gap: 2 }}>
                          {confirmDel === t.id ? (
                            <>
                              <span onClick={() => delTrade(t.id)} style={{ fontSize: 8, padding: "2px 5px", borderRadius: 4, background: T.red, color: "#fff", cursor: "pointer", fontWeight: 600 }}>Del</span>
                              <span onClick={() => setConfirmDel(null)} style={{ fontSize: 8, padding: "2px 5px", borderRadius: 4, background: T.glassBorder, color: T.textDim, cursor: "pointer" }}>No</span>
                            </>
                          ) : (
                            <>
                              <span onClick={() => editTrade(t)} style={{ fontSize: 8, padding: "2px 5px", borderRadius: 4, background: `${T.accent}20`, color: T.accent, cursor: "pointer", fontWeight: 600 }}>Edit</span>
                              <span onClick={() => setConfirmDel(t.id)} style={{ fontSize: 8, padding: "2px 5px", borderRadius: 4, background: `${T.red}15`, color: T.red, cursor: "pointer" }}>×</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add/Edit Trade */}
            {jView === "add" && (
              <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                  {editing ? t("editTradeTitle") : t("logNewTrade")}{" "}
                  <span style={{ fontSize: 10, color: T.accent }}>({t(capitalMode)})</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
                  <InputField label={t("date")} type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} T={T} />
                  <InputField label={t("pair")} options={PAIRS_LIST} value={form.pair} onChange={v => setForm(f => ({ ...f, pair: v }))} T={T} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("direction")}</label>
                    <div style={{ padding: "7px 9px", borderRadius: 8, background: T.inputBg, border: `1px solid ${T.glassBorder}`, fontSize: 11, fontWeight: 600, color: form.direction === "Long" ? T.green : form.direction === "Short" ? T.red : T.textMuted, fontFamily: "'Space Grotesk'" }}>
                      {form.direction || (lang === "de" ? "Auto-Erkennung" : "Auto-detect")}
                    </div>
                  </div>
                  <InputField label={t("session")} options={["Asian", "London", "New York", "Overlap"]} value={form.session} onChange={v => setForm(f => ({ ...f, session: v }))} T={T} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
                  <InputField label={t("entry")} type="number" step="0.00001" value={form.entryPrice} onChange={v => setForm(f => updateFormAuto({ ...f, entryPrice: v }))} placeholder="1.08420" T={T} />
                  <InputField label="SL" type="number" step="0.00001" value={form.slPrice} onChange={v => setForm(f => updateFormAuto({ ...f, slPrice: v }))} placeholder="1.08200" T={T} />
                  <InputField label={t("exit")} type="number" step="0.00001" value={form.exitPrice} onChange={v => setForm(f => updateFormAuto({ ...f, exitPrice: v }))} T={T} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 12 }}>
                  <InputField label={t("lots")} type="number" step="0.01" value={form.lotSize} onChange={v => setForm(f => ({ ...f, lotSize: v }))} T={T} />
                  <InputField label={t("pnl")} type="number" step="0.01" value={form.pnl} onChange={v => setForm(f => ({ ...f, pnl: v }))} placeholder="+125.50" T={T} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>R:R</label>
                    <div style={{ padding: "7px 9px", borderRadius: 8, background: T.inputBg, border: `1px solid ${T.glassBorder}`, fontSize: 11, fontWeight: 600, fontFamily: "'Space Grotesk'", color: parseFloat(form.rr) >= 2 ? T.green : parseFloat(form.rr) >= 1 ? T.yellow : T.textMuted }}>
                      {form.rr ? `1:${parseFloat(form.rr).toFixed(1)}` : (lang === "de" ? "Entry + SL + Exit eingeben" : "Fill Entry + SL + Exit")}
                    </div>
                  </div>
                  <InputField label={t("setup")} value={form.setup} onChange={v => setForm(f => ({ ...f, setup: v }))} placeholder="OB + FVG" T={T} />
                  <InputField label={t("emotion")} options={["Confident", "Neutral", "Anxious", "FOMO", "Revenge", "Disciplined"]} value={form.emotion} onChange={v => setForm(f => ({ ...f, emotion: v }))} T={T} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>{t("notes")}</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder={t("analysis")}
                    style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "7px 9px", color: T.text, fontSize: 11, outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <ImageUpload value={form.screenshot || ""} onChange={v => setForm(f => ({ ...f, screenshot: v }))} label={lang === "de" ? "Chart Screenshot" : "Chart Screenshot"} T={T} />
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={saveTrade} className="ob-btn" style={{ padding: "8px 18px", borderRadius: 8, background: T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{editing ? t("save") : t("logTrade")}</button>
                  <button onClick={() => { setJView("log"); setEditing(null); setForm(emptyForm); }} style={{ padding: "8px 14px", borderRadius: 8, background: T.glassBorder, border: "none", color: T.textDim, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t("cancel")}</button>
                </div>
              </div>
            )}

            {/* CSV Import */}
            {jView === "import" && (
              <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{lang === "de" ? "Trades importieren" : "Import Trades"}</div>
                <div style={{ fontSize: 10, color: T.textDim, marginBottom: 16, lineHeight: 1.5 }}>
                  {lang === "de"
                    ? "CSV-Datei mit Spalten: date, pair, direction (long/short), session, entry, exit, lots, pnl, rr, setup, emotion, notes. Trennzeichen: Komma oder Semikolon."
                    : "CSV file with columns: date, pair, direction (long/short), session, entry, exit, lots, pnl, rr, setup, emotion, notes. Delimiter: comma or semicolon."}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <textarea value={csvInput} onChange={e => setCsvInput(e.target.value)} rows={8}
                    placeholder={`date,pair,direction,session,entry,exit,lots,pnl,rr,setup,emotion,notes\n2025-03-20,EUR/USD,long,London,1.0820,1.0855,0.5,87.50,2.5,BPR,confident,Clean displacement`}
                    style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "10px 12px", color: T.text, fontSize: 10, outline: "none", fontFamily: "'Space Grotesk'", resize: "vertical", lineHeight: 1.6 }} />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => {
                    if (!csvInput.trim()) return;
                    const lines = csvInput.trim().split("\n").filter(l => l.trim());
                    const delim = lines[0].includes(";") ? ";" : ",";
                    const header = lines[0].toLowerCase().split(delim).map(h => h.trim());
                    const newTrades = [];
                    for (let i = 1; i < lines.length; i++) {
                      const vals = lines[i].split(delim).map(v => v.trim());
                      if (vals.length < 4) continue;
                      const obj = {};
                      header.forEach((h, idx) => { obj[h] = vals[idx] || ""; });
                      newTrades.push({
                        id: Date.now() + i,
                        date: obj.date || new Date().toISOString().slice(0, 10),
                        pair: obj.pair || "EUR/USD",
                        direction: (obj.direction || "long").toLowerCase(),
                        session: obj.session || "London",
                        entry: parseFloat(obj.entry) || 0,
                        exit: parseFloat(obj.exit) || 0,
                        lots: parseFloat(obj.lots) || 0.01,
                        pnl: parseFloat(obj.pnl) || 0,
                        rr: parseFloat(obj.rr) || 0,
                        setup: obj.setup || "",
                        emotion: obj.emotion || "",
                        notes: obj.notes || "",
                        capital: capitalMode,
                        fundedAccount: capitalMode === "funded" ? selFunded : null,
                      });
                    }
                    if (newTrades.length > 0) {
                      const merged = [...trades, ...newTrades];
                      setTrades(merged);
                      sSet(uKey("journal-trades"), merged);
                      setCsvImportResult(`${newTrades.length} ${lang === "de" ? "Trades importiert" : "trades imported"}`);
                      setCsvInput("");
                    }
                  }}
                    className="ob-btn" style={{ padding: "8px 20px", borderRadius: 8, background: T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {lang === "de" ? "Importieren" : "Import"}
                  </button>
                  {csvImportResult && <span style={{ fontSize: 10, color: T.green, fontWeight: 600 }}>{csvImportResult}</span>}
                </div>
                <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)", fontSize: 9, color: T.textDim, lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{lang === "de" ? "MT4/MT5 Export:" : "MT4/MT5 Export:"}</div>
                  {lang === "de"
                    ? "MT4: Account History Tab -> Rechtsklick -> Als Detaillierter Bericht speichern. Dann relevante Spalten in das CSV-Format konvertieren. MT5: History Tab -> Deal auswählen -> Export."
                    : "MT4: Account History tab -> Right click -> Save as Detailed Report. Then convert relevant columns to CSV format. MT5: History tab -> Select deals -> Export."}
                </div>
              </div>
            )}

            {/* Risk Calculator */}
            {jView === "risk" && (
              <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{lang === "de" ? "Risiko-Rechner" : "Risk Management Calculator"}</div>
                <div style={{ fontSize: 10, color: T.textDim, marginBottom: 16 }}>{lang === "de" ? "Berechne deine Lot-Size basierend auf Risiko" : "Calculate lot size based on your risk parameters"}</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>{lang === "de" ? "Kontostand ($)" : "Account Balance ($)"}</label>
                        <input type="number" value={riskBalance} onChange={e => setRiskBalance(parseFloat(e.target.value) || 0)}
                          style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "7px 9px", color: T.text, fontSize: 12, fontWeight: 600, outline: "none", fontFamily: "'Space Grotesk'" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>{lang === "de" ? "Risiko (%)" : "Risk (%)"}</label>
                        <input type="number" value={riskPct} onChange={e => setRiskPct(parseFloat(e.target.value) || 0)} step="0.1"
                          style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "7px 9px", color: T.text, fontSize: 12, fontWeight: 600, outline: "none", fontFamily: "'Space Grotesk'" }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>SL (Pips)</label>
                        <input type="number" value={riskSL} onChange={e => setRiskSL(parseFloat(e.target.value) || 0)} step="0.1"
                          style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "7px 9px", color: T.text, fontSize: 12, fontWeight: 600, outline: "none", fontFamily: "'Space Grotesk'" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>{lang === "de" ? "Paar" : "Pair"}</label>
                        <select value={riskPair} onChange={e => setRiskPair(e.target.value)}
                          style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "7px 9px", color: T.text, fontSize: 11, outline: "none" }}>
                          <option value="standard">EUR/USD, GBP/USD</option>
                          <option value="jpy">USD/JPY, EUR/JPY</option>
                          <option value="gold">XAU/USD (Gold)</option>
                          <option value="indices">NAS100, US30</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>TP (Pips) — {lang === "de" ? "optional" : "optional"}</label>
                      <input type="number" value={riskTP} onChange={e => setRiskTP(parseFloat(e.target.value) || 0)} step="0.1"
                        style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "7px 9px", color: T.text, fontSize: 12, fontWeight: 600, outline: "none", fontFamily: "'Space Grotesk'" }} />
                    </div>
                  </div>
                  <div>
                    {(() => {
                      const riskAmt = riskBalance * (riskPct / 100);
                      const pipVal = riskPair === "jpy" ? 0.01 : riskPair === "gold" ? 0.1 : riskPair === "indices" ? 1 : 0.0001;
                      const pipValDollar = riskPair === "jpy" ? 1000 * pipVal : riskPair === "gold" ? 100 * 0.01 : riskPair === "indices" ? 1 : 100000 * pipVal;
                      const lotSize = riskSL > 0 ? riskAmt / (riskSL * pipValDollar) : 0;
                      const rr = riskSL > 0 && riskTP > 0 ? riskTP / riskSL : 0;
                      const potentialProfit = rr * riskAmt;
                      return (
                        <div>
                          <div style={{ padding: 16, borderRadius: 14, background: `${T.accent}10`, border: `1px solid ${T.accent}30`, marginBottom: 12 }}>
                            <div style={{ fontSize: 9, color: T.textDim, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>LOT SIZE</div>
                            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk'", color: T.accentLight }}>{lotSize.toFixed(2)}</div>
                            <div style={{ fontSize: 9, color: T.textDim, marginTop: 4 }}>Micro: {(lotSize * 100).toFixed(0)} | Mini: {(lotSize * 10).toFixed(1)} | Units: {(lotSize * 100000).toFixed(0)}</div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.025)" }}>
                              <div style={{ fontSize: 8, color: T.textDim, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{lang === "de" ? "Risiko $" : "Risk $"}</div>
                              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk'", color: T.red }}>${riskAmt.toFixed(2)}</div>
                            </div>
                            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.025)" }}>
                              <div style={{ fontSize: 8, color: T.textDim, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>R:R</div>
                              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk'", color: rr >= 2 ? T.green : rr >= 1 ? T.yellow : T.textDim }}>{rr > 0 ? `1:${rr.toFixed(1)}` : "—"}</div>
                            </div>
                            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.025)" }}>
                              <div style={{ fontSize: 8, color: T.textDim, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{lang === "de" ? "Pot. Gewinn" : "Pot. Profit"}</div>
                              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk'", color: T.green }}>{potentialProfit > 0 ? `$${potentialProfit.toFixed(2)}` : "—"}</div>
                            </div>
                            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.025)" }}>
                              <div style={{ fontSize: 8, color: T.textDim, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{lang === "de" ? "% vom Konto" : "% of Account"}</div>
                              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk'" }}>{riskPct.toFixed(1)}%</div>
                            </div>
                          </div>
                          {/* Quick risk buttons */}
                          <div style={{ marginTop: 10, display: "flex", gap: 4 }}>
                            {[0.5, 1, 1.5, 2, 3].map(p => (
                              <span key={p} onClick={() => setRiskPct(p)}
                                style={{ padding: "4px 10px", borderRadius: 8, fontSize: 9, fontWeight: 600, cursor: "pointer", background: riskPct === p ? T.accent : T.glassBorder, color: riskPct === p ? "#fff" : T.textDim }}>
                                {p}%
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ NEWS ═══ */}
        {tab === "news" && (
          <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t("econCalendar")}</div>
                <div style={{ fontSize: 9, color: T.textDim, marginTop: 2 }}>{t("highImpactEvents")}</div>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {[{ id: "all", l: t("all") }, { id: "usd", l: "USD" }, { id: "eur", l: "EUR" }].map(f => (
                  <span key={f.id} onClick={() => setNewsFilter(f.id)}
                    style={{ padding: "4px 10px", borderRadius: 8, fontSize: 9, fontWeight: 600, cursor: "pointer", background: newsFilter === f.id ? T.accent : T.glassBorder, color: newsFilter === f.id ? "#fff" : T.textDim }}>
                    {f.l}
                  </span>
                ))}
              </div>
            </div>
            {Object.entries(groupedEvents).map(([date, events]) => (
              <div key={date} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, marginBottom: 6, padding: "3px 8px", background: `${T.accent}10`, borderRadius: 4, display: "inline-block" }}>
                  {getDateLabel(date)} — {date}
                </div>
                {events.map((e, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 36px 1fr 58px 58px 58px", padding: "8px 8px", borderRadius: 4, alignItems: "center", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", gap: 5, borderLeft: e.actual && e.surprise === "positive" ? `2px solid ${T.green}` : e.actual && e.surprise === "negative" ? `2px solid ${T.red}` : "2px solid transparent" }}>
                    <span style={{ fontFamily: "'Space Grotesk'", fontSize: 9, color: T.textDim }}>{e.time}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 4px", borderRadius: 4, background: e.currency === "USD" ? `${T.green}15` : `${T.accent}15`, color: e.currency === "USD" ? T.green : T.accentLight, textAlign: "center" }}>{e.currency}</span>
                    <span style={{ fontSize: 10, fontWeight: 500 }}>{e.event}</span>
                    <span style={{ textAlign: "right", fontFamily: "'Space Grotesk'", fontSize: 9, color: T.textDim }}>{e.forecast || "—"}</span>
                    <span style={{ textAlign: "right", fontFamily: "'Space Grotesk'", fontSize: 9, color: T.textDim }}>{e.previous || "—"}</span>
                    <span style={{ textAlign: "right", fontFamily: "'Space Grotesk'", fontSize: 9, fontWeight: 700, color: e.surprise === "positive" ? T.green : e.surprise === "negative" ? T.red : e.actual ? T.text : T.textMuted }}>{e.actual || "—"}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ═══ SOCIAL ═══ */}
        {tab === "social" && (
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* What to Watch */}
            <div style={{ background: T.glass, border: `1px solid ${T.accent}20`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{lang === "de" ? "Worauf achten" : "What to Watch"}</div>
              {[
                ...HIGH_IMPACT_NEWS.slice(0, 3).map(n => ({ text: n.headline, tag: n.sentiment, currency: n.currency })),
                ...NEWS_EVENTS.filter(e => e.date === new Date().toISOString().slice(0, 10)).slice(0, 3).map(e => ({ text: `${e.time} — ${e.event}`, tag: "event", currency: e.currency })),
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < 5 ? `1px solid ${T.glassBorder}` : "none" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, lineHeight: 1.4, flex: 1 }}>{item.text}</span>
                  <span style={{ fontSize: 7, fontWeight: 700, color: item.currency === "USD" ? T.green : T.accent, flexShrink: 0 }}>{item.currency}</span>
                  <span style={{ fontSize: 7, fontWeight: 600, padding: "1px 5px", borderRadius: 4, flexShrink: 0, background: item.tag === "dovish" || item.tag === "bullish" ? `${T.green}15` : item.tag === "event" ? `${T.accent}15` : `${T.red}15`, color: item.tag === "dovish" || item.tag === "bullish" ? T.green : item.tag === "event" ? T.accentLight : T.red }}>{item.tag}</span>
                </div>
              ))}
            </div>

            {/* High Impact News */}
            <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t("highImpactNews")}</div>
              {HIGH_IMPACT_NEWS.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "8px 8px", borderRadius: 8, marginBottom: 2, background: "rgba(255,255,255,0.02)", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 8, color: T.textDim, minWidth: 48, paddingTop: 2 }}>{n.time}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, lineHeight: 1.4 }}>{n.headline}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                      <span style={{ fontSize: 8, color: T.textDim }}>{n.source}</span>
                      <span style={{ fontSize: 7, fontWeight: 700, color: n.currency === "USD" ? T.green : T.accent }}>{n.currency}</span>
                      <span style={{ fontSize: 7, fontWeight: 600, padding: "0 4px", borderRadius: 4, background: n.sentiment === "dovish" || n.sentiment === "bullish" ? `${T.green}15` : n.sentiment === "neutral" ? `${T.accent}15` : `${T.red}15`, color: n.sentiment === "dovish" || n.sentiment === "bullish" ? T.green : n.sentiment === "neutral" ? T.accentLight : T.red }}>{n.sentiment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {/* Currency Strength */}
              <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 10 }}>{lang === "de" ? "Währungsstärke" : "Currency Strength"}</div>
                {(() => {
                  const currencies = [
                    { name: "USD", pairs: [{ sym: "EUR/USD", inv: true }, { sym: "GBP/USD", inv: true }, { sym: "USD/JPY", inv: false }] },
                    { name: "EUR", pairs: [{ sym: "EUR/USD", inv: false }] },
                    { name: "GBP", pairs: [{ sym: "GBP/USD", inv: false }] },
                    { name: "JPY", pairs: [{ sym: "USD/JPY", inv: true }] },
                  ];
                  return currencies.map(c => {
                    const changes = c.pairs.map(p => {
                      const pr = prices.find(x => x.symbol === p.sym);
                      return pr ? (p.inv ? -pr.change : pr.change) : 0;
                    });
                    const avg = changes.reduce((s, v) => s + v, 0) / changes.length;
                    const strength = Math.min(Math.max((avg + 0.1) / 0.2 * 100, 0), 100);
                    return (
                      <div key={c.name} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 10, fontWeight: 600 }}>{c.name}</span>
                          <span style={{ fontSize: 9, fontFamily: "'Space Grotesk'", fontWeight: 600, color: T.accentLight }}>{avg >= 0 ? "+" : ""}{avg.toFixed(3)}%</span>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${strength}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accentLight})`, borderRadius: 4, transition: "width 0.5s", opacity: strength > 50 ? 1 : 0.5 }} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Week Ahead */}
              <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 10 }}>{lang === "de" ? "Diese Woche" : "Week Ahead"}</div>
                {(() => {
                  const days = {};
                  NEWS_EVENTS.forEach(e => {
                    if (!days[e.date]) days[e.date] = [];
                    days[e.date].push(e);
                  });
                  return Object.entries(days).slice(0, 5).map(([date, events]) => {
                    const d = new Date(date);
                    const dayName = d.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "short" });
                    const dateStr = d.toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "short" });
                    const isToday = date === new Date().toISOString().slice(0, 10);
                    return (
                      <div key={date} style={{ marginBottom: 8, padding: "6px 8px", borderRadius: 8, background: isToday ? `${T.accent}08` : "transparent", borderLeft: isToday ? `2px solid ${T.accent}` : "2px solid transparent" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: isToday ? T.accent : T.textDim, marginBottom: 3 }}>
                          {dayName} {dateStr} {isToday && <span style={{ fontSize: 7, color: T.accent }}>TODAY</span>}
                        </div>
                        {events.slice(0, 3).map((e, i) => (
                          <div key={i} style={{ fontSize: 9, color: T.text, lineHeight: 1.6, display: "flex", gap: 6 }}>
                            <span style={{ color: T.textDim, minWidth: 32 }}>{e.time}</span>
                            <span style={{ fontSize: 7, fontWeight: 700, color: e.currency === "USD" ? T.green : T.accent, minWidth: 22 }}>{e.currency}</span>
                            <span>{e.event}</span>
                          </div>
                        ))}
                        {events.length > 3 && <div style={{ fontSize: 8, color: T.textMuted, marginTop: 2 }}>+{events.length - 3} more</div>}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Active Sessions */}
            <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 14, marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 10 }}>{lang === "de" ? "Sessions" : "Active Sessions"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {sessions.map(s => (
                  <div key={s.name} style={{ textAlign: "center", padding: "10px 6px", borderRadius: 8, background: s.open ? `${T.accent}10` : "rgba(255,255,255,0.02)", border: `1px solid ${s.open ? T.accent + "30" : T.glassBorder}` }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.open ? T.accent : T.textMuted, margin: "0 auto 6px", boxShadow: s.open ? `0 0 8px ${T.accent}60` : "none" }} />
                    <div style={{ fontSize: 10, fontWeight: 600, color: s.open ? T.text : T.textDim }}>{s.name}</div>
                    <div style={{ fontSize: 8, fontWeight: 600, color: s.open ? T.accentLight : T.textMuted, marginTop: 2 }}>{s.open ? (lang === "de" ? "AKTIV" : "OPEN") : (lang === "de" ? "ZU" : "CLOSED")}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ EDUCATION ═══ */}
        {tab === "edu" && (
          <div style={{ position: "relative", zIndex: 1 }}>
            {!activeGallery ? (
              <>
                {/* Gallery Overview */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Lab</div>
                    <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>{lang === "de" ? "Wissens-Galerien für dein Team" : "Knowledge galleries for your team"}</div>
                  </div>
                  <button onClick={() => setShowGalleryForm(!showGalleryForm)}
                    style={{ padding: "7px 14px", borderRadius: 8, background: showGalleryForm ? T.glassBorder : T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name={showGalleryForm ? "list" : "plus"} color="#fff" size={11} /> {showGalleryForm ? (lang === "de" ? "Abbrechen" : "Cancel") : (lang === "de" ? "Neue Galerie" : "New Gallery")}
                  </button>
                </div>
                {showGalleryForm && (
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16, marginBottom: 14 }}>
                    <input value={galleryName} onChange={e => setGalleryName(e.target.value)} placeholder={lang === "de" ? "Galerie-Name (z.B. Strategie, Mindset, Reviews)..." : "Gallery name (e.g. Strategy, Mindset, Reviews)..."}
                      style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 12, fontWeight: 600, outline: "none", marginBottom: 8 }} />
                    <input value={galleryDesc} onChange={e => setGalleryDesc(e.target.value)} placeholder={lang === "de" ? "Beschreibung (optional)..." : "Description (optional)..."}
                      style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "6px 12px", color: T.text, fontSize: 10, outline: "none", marginBottom: 8 }} />
                    <div style={{ marginBottom: 10 }}>
                      <ImageUpload value={galleryThumb} onChange={setGalleryThumb} label={lang === "de" ? "Thumbnail" : "Thumbnail"} T={T} />
                    </div>
                    <button onClick={saveGallery} className="ob-btn"
                      className="ob-btn" style={{ padding: "8px 20px", borderRadius: 8, background: T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                      {lang === "de" ? "Erstellen" : "Create"}
                    </button>
                  </div>
                )}
                {labGalleries.length === 0 && !showGalleryForm && (
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 40, textAlign: "center" }}>
                    <Icon name="journal" color={T.textDim} size={28} />
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 10, color: T.textMuted }}>{lang === "de" ? "Noch keine Galerien" : "No galleries yet"}</div>
                    <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>{lang === "de" ? "Erstelle eine Galerie wie \"Strategie\" oder \"Mindset\"" : "Create a gallery like \"Strategy\" or \"Mindset\""}</div>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
                  {labGalleries.map(g => (
                    <div key={g.id} onClick={() => setActiveGallery(g.id)}
                      className="ob-gallery"
                      style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
                      {g.thumb && (
                        <div style={{ width: "100%", height: 100, overflow: "hidden", background: "#0e0e0e" }}>
                          <img src={g.thumb} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} onError={e => { e.target.style.display = "none"; }} />
                        </div>
                      )}
                      {!g.thumb && (
                        <div style={{ width: "100%", height: 60, background: `linear-gradient(135deg, ${T.accent}15, ${T.accentLight}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name="journal" color={T.accent} size={20} />
                        </div>
                      )}
                      <div style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{g.name}</div>
                          {g.author === userId && (
                            <span onClick={(e) => { e.stopPropagation(); deleteGallery(g.id); }} style={{ fontSize: 8, color: T.red, cursor: "pointer", padding: "2px 6px" }}>x</span>
                          )}
                        </div>
                        {g.desc && <div style={{ fontSize: 9, color: T.textDim, marginBottom: 6, lineHeight: 1.4 }}>{g.desc}</div>}
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 9, fontWeight: 600, color: T.accent }}>{g.posts.length} {lang === "de" ? "Beiträge" : "posts"}</span>
                          <span style={{ fontSize: 8, color: T.textMuted }}>{g.author}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Inside a Gallery */}
                {(() => {
                  const gallery = labGalleries.find(g => g.id === activeGallery);
                  if (!gallery) { setActiveGallery(null); return null; }
                  return (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span onClick={() => { setActiveGallery(null); setShowEduForm(false); }}
                            style={{ fontSize: 11, color: T.accent, cursor: "pointer", fontWeight: 600 }}>← {lang === "de" ? "Zurück" : "Back"}</span>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>{gallery.name}</div>
                            {gallery.desc && <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>{gallery.desc}</div>}
                          </div>
                        </div>
                        <button onClick={() => setShowEduForm(!showEduForm)}
                          style={{ padding: "7px 14px", borderRadius: 8, background: showEduForm ? T.glassBorder : T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          <Icon name={showEduForm ? "list" : "plus"} color="#fff" size={11} /> {showEduForm ? (lang === "de" ? "Abbrechen" : "Cancel") : (lang === "de" ? "Neuer Beitrag" : "New Post")}
                        </button>
                      </div>
                      {showEduForm && (
                        <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16, marginBottom: 14 }}>
                          <input value={eduTitle} onChange={e => setEduTitle(e.target.value)} placeholder={lang === "de" ? "Titel..." : "Title..."}
                            style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 12, fontWeight: 600, outline: "none", marginBottom: 8 }} />
                          <select value={eduTag} onChange={e => setEduTag(e.target.value)}
                            style={{ background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "6px 10px", color: T.text, fontSize: 10, outline: "none", marginBottom: 8 }}>
                            <option value="concept">Concept</option>
                            <option value="setup">Setup</option>
                            <option value="review">Review</option>
                            <option value="mindset">Mindset</option>
                            <option value="tip">Tip</option>
                          </select>
                          <textarea value={eduBody} onChange={e => setEduBody(e.target.value)} placeholder={lang === "de" ? "Inhalt..." : "Content..."} rows={5}
                            style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 11, outline: "none", fontFamily: "inherit", resize: "vertical", marginBottom: 8 }} />
                          <div style={{ marginBottom: 10 }}>
                            <ImageUpload value={eduImage} onChange={setEduImage} label={lang === "de" ? "Bild" : "Image"} T={T} />
                          </div>
                          <button onClick={saveEduPost}
                            className="ob-btn" style={{ padding: "8px 20px", borderRadius: 8, background: T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                            {lang === "de" ? "Veröffentlichen" : "Publish"}
                          </button>
                        </div>
                      )}
                      {gallery.posts.length === 0 && !showEduForm && (
                        <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 30, textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: T.textMuted }}>{lang === "de" ? "Noch keine Beiträge in dieser Galerie" : "No posts in this gallery yet"}</div>
                        </div>
                      )}
                      {gallery.posts.map(p => (
                        <div key={p.id} style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, padding: 16, marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{p.title}</div>
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <span style={{ fontSize: 8, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: `${T.accent}15`, color: T.accent }}>{p.tag}</span>
                                <span style={{ fontSize: 8, color: T.textDim }}>{p.author} — {p.date}</span>
                              </div>
                            </div>
                            {p.author === userId && <span onClick={() => deleteEduPost(gallery.id, p.id)} style={{ fontSize: 8, color: T.red, cursor: "pointer", padding: "2px 6px" }}>x</span>}
                          </div>
                          <div style={{ fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{p.body}</div>
                          {p.image && <img src={p.image} style={{ maxWidth: "100%", borderRadius: 8, marginTop: 10 }} onError={e => { e.target.style.display = "none"; }} />}
                        </div>
                      ))}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        )}
        {tab === "chat" && (
          <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 14, backdropFilter: T.glassBlur, WebkitBackdropFilter: T.glassBlur, display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden", position: "relative", zIndex: 1 }}>
            {!chatNameSet ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 8 }}>
                <Icon name="chat" color={T.textDim} size={24} />
                <div style={{ fontSize: 12, fontWeight: 700 }}>{t("joinChat")}</div>
                <div style={{ fontSize: 9, color: T.textDim }}>{t("chatShared")}</div>
                <div style={{ display: "flex", gap: 4 }}>
                  <input value={chatName || userId || ""} onChange={e => setChatName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { const n = (chatName || userId || "").trim(); if (n) { setChatName(n); setChatNameSet(true); sSet(uKey("chat-name"), n); } } }}
                    placeholder={t("yourName")}
                    style={{ background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "6px 10px", color: T.text, fontSize: 11, outline: "none", width: 160 }} />
                  <button onClick={() => { const n = (chatName || userId || "").trim(); if (n) { setChatName(n); setChatNameSet(true); sSet(uKey("chat-name"), n); } }}
                    style={{ padding: "6px 12px", borderRadius: 8, background: T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>
                    {t("join")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ padding: "6px 12px", borderBottom: `1px solid ${T.glassBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{t("tradeChat")}</span>
                  <span style={{ fontSize: 8, color: T.textDim }}>{t("asLabel")} <span style={{ color: T.accent, fontWeight: 600 }}>{chatName}</span></span>
                </div>
                <div style={{ flex: 1, overflow: "auto", padding: "8px 10px", minHeight: 0 }}>
                  {chatMsgs.length === 0 && <div style={{ textAlign: "center", color: T.textMuted, fontSize: 10, padding: 20 }}>{t("noMessages")}</div>}
                  {chatMsgs.map(m => {
                    const isMe = m.name === chatName;
                    const nameColor = `hsl(${m.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 50%, 65%)`;
                    return (
                      <div key={m.id} style={{ display: "flex", gap: 6, marginBottom: 8, flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-start" }}>
                        {!isMe && (
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: nameColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0, marginTop: 2 }}>
                            {m.name[0].toUpperCase()}
                          </div>
                        )}
                        <div style={{ maxWidth: "70%" }}>
                          {!isMe && (
                            <div style={{ fontSize: 9, fontWeight: 700, color: nameColor, marginBottom: 2 }}>{m.name} <span style={{ fontSize: 7, color: T.textDim, fontWeight: 400 }}>{m.time}</span></div>
                          )}
                          {isMe && <div style={{ fontSize: 7, color: T.textDim, textAlign: "right", marginBottom: 2 }}>{m.time}</div>}
                          <div style={{ padding: "6px 10px", borderRadius: isMe ? "10px 10px 2px 10px" : "10px 10px 10px 2px", background: isMe ? T.accent : "rgba(255,255,255,0.06)", color: isMe ? "#fff" : T.text, fontSize: 10, lineHeight: 1.5, border: isMe ? "none" : `1px solid ${T.glassBorder}` }}>
                            {m.text && <div>{m.text}</div>}
                            {m.image && <img src={m.image} style={{ maxWidth: "100%", borderRadius: 4, marginTop: m.text ? 4 : 0 }} onError={e => { e.target.style.display = "none"; }} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
                <div className="ob-chat-bar" style={{ padding: "6px 10px", borderTop: `1px solid ${T.glassBorder}`, flexShrink: 0 }}>
                  {chatImgUrl && (
                    <div style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                      <img src={chatImgUrl} style={{ maxHeight: 36, borderRadius: 4 }} />
                      <span onClick={() => setChatImgUrl("")} style={{ fontSize: 8, color: T.red, cursor: "pointer" }}>x</span>
                      <button onClick={() => { sendChat(chatImgUrl); setChatImgUrl(""); }}
                        style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: 8, background: T.accent, border: "none", color: "#fff", fontSize: 8, fontWeight: 600, cursor: "pointer" }}>{t("sendImg")}</button>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 3 }}>
                    <ImageUpload value="" onChange={v => setChatImgUrl(v)} T={T} compact />
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") sendChat(); }}
                      placeholder={t("typeMessage")}
                      style={{ flex: 1, background: T.inputBg, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "6px 10px", color: T.text, fontSize: 10, outline: "none" }} />
                    <button onClick={() => sendChat()}
                      style={{ padding: "6px 12px", borderRadius: 8, background: T.accent, border: "none", boxShadow: `0 2px 12px ${T.accent}35`, color: "#fff", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>
                      {t("send")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes orbPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 2px 10px rgba(90,125,159,0.4)); } 50% { transform: scale(1.06); filter: drop-shadow(0 4px 20px rgba(90,125,159,0.6)); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 0 0 ${T.accent}00; } 50% { box-shadow: 0 0 12px 2px ${T.accent}30; } }
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        html, body { height: 100%; overflow: hidden; overscroll-behavior: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme === "dark" ? "rgba(255,255,255,0.08)" : T.glassBorder}; border-radius: 4px; }
        select option { background: ${theme === "dark" ? "#1a1a1a" : "#fff"}; color: ${T.text}; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: ${theme === "dark" ? "invert(0.7)" : "none"}; }
        /* iOS: prevent auto-zoom on input focus */
        @media screen and (max-width: 768px) {
          input, select, textarea { font-size: 16px !important; }
          input[type="number"] { font-size: 16px !important; }
        }
        /* iOS safe areas via CSS classes */
        @supports (padding: env(safe-area-inset-top)) {
          .ob-safe { padding-top: env(safe-area-inset-top); }
          .ob-content { padding-bottom: env(safe-area-inset-bottom) !important; }
          .ob-chat-bar { padding-bottom: calc(6px + env(safe-area-inset-bottom)) !important; }
        }
        .ob-card { transition: all 0.2s ease; }
        .ob-card:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px ${T.accent}15; }
        .ob-btn { transition: all 0.15s ease; }
        .ob-btn:hover { transform: translateY(-1px); filter: brightness(1.1); box-shadow: 0 4px 16px ${T.accent}40; }
        .ob-btn:active { transform: scale(0.97); }
        .ob-link:hover { color: ${T.accentLight} !important; }
        .ob-gallery:hover { border-color: ${T.accent}40 !important; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }
        .ob-side-item { transition: all 0.15s ease; }
        .ob-side-item:hover { background: ${T.accent}12 !important; }
        .ob-orb { animation: orbPulse 3s ease-in-out infinite; }
        .ob-fade { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
