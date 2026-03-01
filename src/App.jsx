import { useState, useMemo, Fragment } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar } from "recharts";

const logistic = (elo, mean = 1500, spread = 220) =>
  100 / (1 + Math.exp(-(elo - mean) / spread));

const exponential = (elo, scale = 600) =>
  50 * Math.exp((elo - 1500) / scale);

const ALL_TEAMS = [
  { name: "Arsenal", elo: 1834, league: "EPL", price: 82.01 },
  { name: "Bayern München", elo: 1813, league: "BUN", price: 80.58 },
  { name: "Inter", elo: 1790, league: "ITA", price: 78.90 },
  { name: "Manchester City", elo: 1779, league: "EPL", price: 78.07 },
  { name: "Barcelona", elo: 1777, league: "ESP", price: 77.90 },
  { name: "Manchester United", elo: 1722, league: "EPL", price: 73.29 },
  { name: "Paris Saint Germain", elo: 1704, league: "FRA", price: 71.68 },
  { name: "Liverpool", elo: 1684, league: "EPL", price: 69.78 },
  { name: "Aston Villa", elo: 1665, league: "EPL", price: 67.94 },
  { name: "Napoli", elo: 1643, league: "ITA", price: 65.72 },
  { name: "Chelsea", elo: 1641, league: "EPL", price: 65.46 },
  { name: "AC Milan", elo: 1639, league: "ITA", price: 65.30 },
  { name: "Atalanta", elo: 1634, league: "ITA", price: 64.80 },
  { name: "Juventus", elo: 1634, league: "ITA", price: 64.76 },
  { name: "Real Madrid", elo: 1620, league: "ESP", price: 63.29 },
  { name: "Bournemouth", elo: 1619, league: "EPL", price: 63.23 },
  { name: "Borussia Dortmund", elo: 1618, league: "BUN", price: 63.07 },
  { name: "AS Roma", elo: 1615, league: "ITA", price: 62.77 },
  { name: "Brentford", elo: 1607, league: "EPL", price: 61.96 },
  { name: "Como", elo: 1603, league: "ITA", price: 61.50 },
  { name: "Atletico Madrid", elo: 1600, league: "ESP", price: 61.22 },
  { name: "Hoffenheim", elo: 1594, league: "BUN", price: 60.50 },
  { name: "Lens", elo: 1585, league: "FRA", price: 59.56 },
  { name: "Brighton", elo: 1584, league: "EPL", price: 59.44 },
  { name: "Newcastle", elo: 1580, league: "EPL", price: 59.01 },
  { name: "Stuttgart", elo: 1576, league: "BUN", price: 58.54 },
  { name: "Fulham", elo: 1575, league: "EPL", price: 58.49 },
  { name: "Everton", elo: 1565, league: "EPL", price: 57.36 },
  { name: "Leeds", elo: 1564, league: "EPL", price: 57.26 },
  { name: "Real Betis", elo: 1564, league: "ESP", price: 57.17 },
  { name: "Villarreal", elo: 1559, league: "ESP", price: 56.67 },
  { name: "Leverkusen", elo: 1550, league: "BUN", price: 55.70 },
  { name: "RB Leipzig", elo: 1530, league: "BUN", price: 53.38 },
  { name: "Fiorentina", elo: 1521, league: "ITA", price: 52.34 },
  { name: "Osasuna", elo: 1517, league: "ESP", price: 51.94 },
  { name: "Real Sociedad", elo: 1517, league: "ESP", price: 51.93 },
  { name: "Marseille", elo: 1514, league: "FRA", price: 51.57 },
  { name: "Crystal Palace", elo: 1513, league: "EPL", price: 51.49 },
  { name: "Lyon", elo: 1509, league: "FRA", price: 50.99 },
  { name: "Rennes", elo: 1499, league: "FRA", price: 49.84 },
  { name: "Strasbourg", elo: 1499, league: "FRA", price: 49.83 },
  { name: "Celta Vigo", elo: 1492, league: "ESP", price: 49.13 },
  { name: "West Ham", elo: 1490, league: "EPL", price: 48.82 },
  { name: "Athletic Club", elo: 1489, league: "ESP", price: 48.79 },
  { name: "Monaco", elo: 1487, league: "FRA", price: 48.50 },
  { name: "Nottm Forest", elo: 1485, league: "EPL", price: 48.25 },
  { name: "Sunderland", elo: 1483, league: "EPL", price: 48.03 },
  { name: "Frankfurt", elo: 1482, league: "BUN", price: 47.96 },
  { name: "Sassuolo", elo: 1471, league: "ITA", price: 46.65 },
  { name: "Tottenham", elo: 1470, league: "EPL", price: 46.57 },
  { name: "Lille", elo: 1469, league: "FRA", price: 46.48 },
  { name: "Valencia", elo: 1456, league: "ESP", price: 45.03 },
  { name: "Freiburg", elo: 1454, league: "BUN", price: 44.75 },
  { name: "Parma", elo: 1453, league: "ITA", price: 44.73 },
  { name: "Getafe", elo: 1453, league: "ESP", price: 44.72 },
  { name: "Lazio", elo: 1453, league: "ITA", price: 44.71 },
  { name: "Brest", elo: 1448, league: "FRA", price: 44.14 },
  { name: "Hamburger SV", elo: 1435, league: "BUN", price: 42.62 },
  { name: "Girona", elo: 1434, league: "ESP", price: 42.53 },
  { name: "Augsburg", elo: 1433, league: "BUN", price: 42.45 },
  { name: "Rayo Vallecano", elo: 1430, league: "ESP", price: 42.15 },
  { name: "Udinese", elo: 1429, league: "ITA", price: 42.00 },
  { name: "Mainz", elo: 1429, league: "BUN", price: 41.99 },
  { name: "Espanyol", elo: 1427, league: "ESP", price: 41.83 },
  { name: "Alaves", elo: 1427, league: "ESP", price: 41.75 },
  { name: "Lorient", elo: 1425, league: "FRA", price: 41.56 },
  { name: "Toulouse", elo: 1420, league: "FRA", price: 41.03 },
  { name: "Genoa", elo: 1418, league: "ITA", price: 40.77 },
  { name: "Burnley", elo: 1417, league: "EPL", price: 40.69 },
  { name: "Mallorca", elo: 1413, league: "ESP", price: 40.23 },
  { name: "Sevilla", elo: 1412, league: "ESP", price: 40.17 },
  { name: "Bologna", elo: 1411, league: "ITA", price: 40.05 },
  { name: "Levante", elo: 1408, league: "ESP", price: 39.66 },
  { name: "Wolves", elo: 1396, league: "EPL", price: 38.40 },
  { name: "Cagliari", elo: 1393, league: "ITA", price: 38.04 },
  { name: "Mönchengladbach", elo: 1392, league: "BUN", price: 37.96 },
  { name: "Elche", elo: 1391, league: "ESP", price: 37.81 },
  { name: "Köln", elo: 1389, league: "BUN", price: 37.64 },
  { name: "Lecce", elo: 1385, league: "ITA", price: 37.20 },
  { name: "Cremonese", elo: 1384, league: "ITA", price: 37.11 },
  { name: "Nice", elo: 1382, league: "FRA", price: 36.90 },
  { name: "Werder Bremen", elo: 1376, league: "BUN", price: 36.22 },
  { name: "Torino", elo: 1372, league: "ITA", price: 35.86 },
  { name: "Union Berlin", elo: 1370, league: "BUN", price: 35.63 },
  { name: "Oviedo", elo: 1363, league: "ESP", price: 34.92 },
  { name: "Paris FC", elo: 1360, league: "FRA", price: 34.59 },
  { name: "Le Havre", elo: 1358, league: "FRA", price: 34.39 },
  { name: "St. Pauli", elo: 1356, league: "BUN", price: 34.22 },
  { name: "Wolfsburg", elo: 1355, league: "BUN", price: 34.07 },
  { name: "Auxerre", elo: 1351, league: "FRA", price: 33.71 },
  { name: "Pisa", elo: 1334, league: "ITA", price: 31.96 },
  { name: "Angers", elo: 1320, league: "FRA", price: 30.56 },
  { name: "Montpellier", elo: 1310, league: "FRA", price: 29.56 },
  { name: "Nantes", elo: 1300, league: "FRA", price: 28.60 },
  { name: "Heidenheim", elo: 1298, league: "BUN", price: 28.37 },
  { name: "Monza", elo: 1283, league: "ITA", price: 26.99 },
];

const LC = { EPL: "#3b1f8c", BUN: "#dc052d", ESP: "#ff6b00", ITA: "#008fd5", FRA: "#1e3a5f" };
const ts = { background: "#111118", border: "1px solid #333", borderRadius: 6, fontSize: 12 };

export default function App() {
  const [expScale, setExpScale] = useState(600);
  const [shockElo, setShockElo] = useState(25);
  const [view, setView] = useState("curves");
  const [lf, setLf] = useState("ALL");
  const [mH, setMH] = useState("Wolves");
  const [mA, setMA] = useState("Aston Villa");

  const ft = useMemo(() => lf === "ALL" ? ALL_TEAMS : ALL_TEAMS.filter(t => t.league === lf), [lf]);

  const curveData = useMemo(() => {
    const pts = [];
    for (let e = 1200; e <= 1900; e += 5)
      pts.push({ elo: e, logistic: Math.round(logistic(e) * 100) / 100, exponential: Math.round(exponential(e, expScale) * 100) / 100 });
    return pts;
  }, [expScale]);

  const sensitivityData = useMemo(() => {
    const pts = [];
    for (let e = 1250; e <= 1870; e += 10) {
      const ld = (logistic(e + 1) - logistic(e - 1)) / 2;
      const ed = (exponential(e + 1, expScale) - exponential(e - 1, expScale)) / 2;
      pts.push({ elo: e, logistic_pct: Math.round((ld / logistic(e)) * 100000) / 1000, exponential_pct: Math.round((ed / exponential(e, expScale)) * 100000) / 1000 });
    }
    return pts;
  }, [expScale]);

  const shockData = useMemo(() => {
    const sub = ft.filter((_, i) => ft.length > 28 ? i % Math.ceil(ft.length / 28) === 0 || i === ft.length - 1 : true);
    return sub.map(t => {
      const lB = logistic(t.elo), lA = logistic(t.elo + shockElo);
      const eB = exponential(t.elo, expScale), eA = exponential(t.elo + shockElo, expScale);
      return { name: t.name.length > 13 ? t.name.slice(0, 12) + "…" : t.name, elo: t.elo, league: t.league, logPctMove: Math.round(((lA - lB) / lB) * 10000) / 100, expPctMove: Math.round(((eA - eB) / eB) * 10000) / 100 };
    });
  }, [shockElo, expScale, ft]);

  const matchSim = useMemo(() => {
    const h = ALL_TEAMS.find(t => t.name === mH), a = ALL_TEAMS.find(t => t.name === mA);
    if (!h || !a) return null;
    const diff = h.elo - a.elo;
    const hE = 1 / (1 + Math.pow(10, -diff / 400));
    const dp = Math.max(0.08, 0.26 - 0.04 * Math.abs(hE - 0.5));
    const hp = hE * (1 - dp), ap = 1 - hp - dp;
    const sc = [
      { l: `${h.name} Win`, p: hp, hs: Math.round((1 - hp) * 40), as: Math.round(-(1 - ap) * 25) },
      { l: "Draw", p: dp, hs: hp > 0.5 ? -5 : 8, as: ap > 0.5 ? -5 : 8 },
      { l: `${a.name} Win`, p: ap, hs: Math.round(-(1 - hp) * 25), as: Math.round((1 - ap) * 40) },
    ];
    return { h, a, hp: Math.round(hp * 100), dp: Math.round(dp * 100), ap: Math.round(ap * 100),
      sc: sc.map(s => {
        const hlB = logistic(h.elo), hlA = logistic(h.elo + s.hs);
        const alB = logistic(a.elo), alA = logistic(a.elo + s.as);
        const heB = exponential(h.elo, expScale), heA = exponential(h.elo + s.hs, expScale);
        const aeB = exponential(a.elo, expScale), aeA = exponential(a.elo + s.as, expScale);
        return { l: s.l, p: Math.round(s.p * 100),
          hlP: Math.round(((hlA - hlB) / hlB) * 10000) / 100, alP: Math.round(((alA - alB) / alB) * 10000) / 100,
          heP: Math.round(((heA - heB) / heB) * 10000) / 100, aeP: Math.round(((aeA - aeB) / aeB) * 10000) / 100,
          hlD: Math.round((hlA - hlB) * 100) / 100, alD: Math.round((alA - alB) * 100) / 100,
          heD: Math.round((heA - heB) * 100) / 100, aeD: Math.round((aeA - aeB) * 100) / 100,
        };
      })
    };
  }, [mH, mA, expScale]);

  const Btn = ({ id, label }) => (
    <button onClick={() => setView(id)} style={{
      padding: "7px 14px", fontSize: 11, fontFamily: "inherit",
      background: view === id ? "#1a1a2e" : "transparent",
      color: view === id ? "#fff" : "#555",
      border: view === id ? "1px solid #333" : "1px solid transparent",
      borderRadius: 6, cursor: "pointer",
    }}>{label}</button>
  );

  const LBtn = ({ l }) => (
    <button onClick={() => setLf(l)} style={{
      padding: "2px 8px", fontSize: 10, fontFamily: "inherit",
      background: lf === l ? "#1a1a2e" : "transparent", color: lf === l ? "#fff" : "#555",
      border: lf === l ? "1px solid #333" : "1px solid transparent", borderRadius: 4, cursor: "pointer",
    }}>{l}</button>
  );

  return (
    <div style={{ background: "#08080d", color: "#e0e0e0", minHeight: "100vh", padding: "24px 16px", fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>MSI 2026 — Price Mapping</h1>
        <p style={{ color: "#555", fontSize: 11, margin: "0 0 6px" }}>96 teams · msi-2026.vercel.app · Mar 1, 2026</p>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 20 }}>
          <span style={{ color: "#f97316" }}>Current:</span> 100/(1+e<sup>-(elo-1500)/220</sup>) <span style={{ color: "#333", margin: "0 6px" }}>|</span>
          <span style={{ color: "#22d3ee" }}>Proposed:</span> 50×e<sup>(elo-1500)/{expScale}</sup>
        </div>

        <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
          <Btn id="curves" label="Elo → $" /><Btn id="sensitivity" label="% / Elo pt" /><Btn id="shocks" label="Shock test" /><Btn id="match" label="Match sim" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "10px 14px", background: "#0e0e16", borderRadius: 8, border: "1px solid #1a1a2e", flexWrap: "wrap" }}>
          <label style={{ fontSize: 10, color: "#666" }}>Exp scale</label>
          <input type="range" min={300} max={1000} value={expScale} onChange={e => setExpScale(+e.target.value)} style={{ width: 120, accentColor: "#22d3ee" }} />
          <span style={{ fontSize: 12, color: "#22d3ee", minWidth: 28 }}>{expScale}</span>
          {view === "shocks" && (<>
            <div style={{ width: 1, height: 16, background: "#222" }} />
            <label style={{ fontSize: 10, color: "#666" }}>Shock</label>
            <input type="range" min={5} max={60} value={shockElo} onChange={e => setShockElo(+e.target.value)} style={{ width: 100, accentColor: "#f97316" }} />
            <span style={{ fontSize: 12, color: "#f97316" }}>+{shockElo}</span>
          </>)}
        </div>

        {view === "curves" && (<div>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={curveData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#151520" />
              <XAxis dataKey="elo" stroke="#333" fontSize={10} />
              <YAxis stroke="#333" fontSize={10} domain={[0, "auto"]} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={ts} formatter={(v, n) => [`$${v.toFixed(2)}`, n === "logistic" ? "Current" : "Proposed"]} labelFormatter={v => `Elo ${v}`} />
              <Line type="monotone" dataKey="logistic" stroke="#f97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="exponential" stroke="#22d3ee" strokeWidth={2} dot={false} />
              <ReferenceLine y={100} stroke="#f9731633" strokeDasharray="3 3" />
              <ReferenceLine x={1500} stroke="#222" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 16, background: "#0e0e16", borderRadius: 8, border: "1px solid #1a1a2e", padding: 14 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {["ALL", "EPL", "BUN", "ESP", "ITA", "FRA"].map(l => <LBtn key={l} l={l} />)}
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ color: "#555", borderBottom: "1px solid #1a1a2e" }}>
                  <th style={{ textAlign: "left", padding: "4px 6px", fontWeight: 500 }}>#</th>
                  <th style={{ textAlign: "left", padding: "4px 6px", fontWeight: 500 }}>Team</th>
                  <th style={{ textAlign: "right", padding: "4px 6px", fontWeight: 500 }}>Elo</th>
                  <th style={{ textAlign: "right", padding: "4px 6px", fontWeight: 500, color: "#f97316" }}>Now</th>
                  <th style={{ textAlign: "right", padding: "4px 6px", fontWeight: 500, color: "#22d3ee" }}>Exp</th>
                  <th style={{ textAlign: "right", padding: "4px 6px", fontWeight: 500 }}>Δ</th>
                </tr></thead>
                <tbody>{ft.map(t => {
                  const ep = exponential(t.elo, expScale), d = ep - t.price;
                  return (<tr key={t.name} style={{ borderBottom: "1px solid #0e0e16" }}>
                    <td style={{ padding: "3px 6px", color: "#333" }}>{ALL_TEAMS.indexOf(t) + 1}</td>
                    <td style={{ padding: "3px 6px", color: LC[t.league] || "#888" }}>{t.name}</td>
                    <td style={{ padding: "3px 6px", textAlign: "right", color: "#666" }}>{t.elo}</td>
                    <td style={{ padding: "3px 6px", textAlign: "right", color: "#f97316" }}>${t.price.toFixed(2)}</td>
                    <td style={{ padding: "3px 6px", textAlign: "right", color: "#22d3ee" }}>${ep.toFixed(2)}</td>
                    <td style={{ padding: "3px 6px", textAlign: "right", color: d > 0 ? "#4ade80" : "#ef4444" }}>{d > 0 ? "+" : ""}{d.toFixed(2)}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
          </div>
        </div>)}

        {view === "sensitivity" && (<div>
          <p style={{ fontSize: 11, color: "#666", marginBottom: 12 }}>% price change per 1 Elo point — logistic compresses extremes, exponential is constant</p>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={sensitivityData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#151520" />
              <XAxis dataKey="elo" stroke="#333" fontSize={10} />
              <YAxis stroke="#333" fontSize={10} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={ts} formatter={(v, n) => [`${v}%/pt`, n === "logistic_pct" ? "Current" : "Proposed"]} labelFormatter={v => `Elo ${v}`} />
              <Line type="monotone" dataKey="logistic_pct" stroke="#f97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="exponential_pct" stroke="#22d3ee" strokeWidth={2} dot={false} />
              <ReferenceLine x={1500} stroke="#222" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 14, padding: 14, background: "#0e0e16", borderRadius: 8, border: "1px solid #1a1a2e", fontSize: 12, lineHeight: 1.8 }}>
            <span style={{ color: "#f97316" }}>Problem:</span> Arsenal gets {sensitivityData.find(d => d.elo === 1830)?.logistic_pct}%/pt. Mid-table gets {sensitivityData.find(d => d.elo === 1500)?.logistic_pct}%/pt. That's {((sensitivityData.find(d => d.elo === 1500)?.logistic_pct || 1) / (sensitivityData.find(d => d.elo === 1830)?.logistic_pct || 1)).toFixed(1)}x difference for the same result.
            <br /><span style={{ color: "#22d3ee" }}>Fix:</span> Flat {sensitivityData[0]?.exponential_pct}%/pt for all 96 teams.
          </div>
        </div>)}

        {view === "shocks" && (<div>
          <p style={{ fontSize: 11, color: "#666", marginBottom: 12 }}>+{shockElo} Elo shock — orange varies by team, cyan is uniform</p>
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {["ALL", "EPL", "BUN", "ESP", "ITA", "FRA"].map(l => <LBtn key={l} l={l} />)}
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={shockData} margin={{ top: 10, right: 20, left: 10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#151520" />
              <XAxis dataKey="name" stroke="#333" fontSize={9} angle={-40} textAnchor="end" height={60} interval={0} />
              <YAxis stroke="#333" fontSize={10} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={ts} formatter={(v, n) => [`${v}%`, n === "logPctMove" ? "Current" : "Proposed"]} />
              <Bar dataKey="logPctMove" fill="#f97316" radius={[2, 2, 0, 0]} barSize={12} />
              <Bar dataKey="expPctMove" fill="#22d3ee" radius={[2, 2, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>)}

        {view === "match" && matchSim && (<div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "center" }}>
            <div>
              <label style={{ fontSize: 10, color: "#666", display: "block", marginBottom: 3 }}>Home</label>
              <select value={mH} onChange={e => setMH(e.target.value)} style={{ background: "#111118", color: "#fff", border: "1px solid #333", borderRadius: 6, padding: "5px 8px", fontSize: 11, fontFamily: "inherit" }}>
                {ALL_TEAMS.map(t => <option key={t.name} value={t.name}>{t.name} ({t.elo})</option>)}
              </select>
            </div>
            <span style={{ color: "#333", fontSize: 13, marginTop: 14 }}>vs</span>
            <div>
              <label style={{ fontSize: 10, color: "#666", display: "block", marginBottom: 3 }}>Away</label>
              <select value={mA} onChange={e => setMA(e.target.value)} style={{ background: "#111118", color: "#fff", border: "1px solid #333", borderRadius: 6, padding: "5px 8px", fontSize: 11, fontFamily: "inherit" }}>
                {ALL_TEAMS.map(t => <option key={t.name} value={t.name}>{t.name} ({t.elo})</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: `${matchSim.hp}%`, background: "#4ade80" }} />
            <div style={{ width: `${matchSim.dp}%`, background: "#eab308" }} />
            <div style={{ width: `${matchSim.ap}%`, background: "#ef4444" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 16 }}>
            <span style={{ color: "#4ade80" }}>{matchSim.hp}%</span>
            <span style={{ color: "#eab308" }}>{matchSim.dp}%</span>
            <span style={{ color: "#ef4444" }}>{matchSim.ap}%</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ t: "Current (Logistic)", c: "#f97316", b: "#f9731644", k: "l" }, { t: "Proposed (Exponential)", c: "#22d3ee", b: "#22d3ee44", k: "e" }].map(({ t, c, b, k }) => (
              <div key={k} style={{ background: "#0e0e16", borderRadius: 8, border: `1px solid ${b}`, padding: 14 }}>
                <div style={{ fontSize: 12, color: c, fontWeight: 700, marginBottom: 10 }}>{t}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "5px 10px", fontSize: 11 }}>
                  <div style={{ color: "#444" }}>Outcome</div>
                  <div style={{ color: "#888", textAlign: "right" }}>{matchSim.h.name}</div>
                  <div style={{ color: "#888", textAlign: "right" }}>{matchSim.a.name}</div>
                  {matchSim.sc.map(s => {
                    const hP = k === "l" ? s.hlP : s.heP, aP = k === "l" ? s.alP : s.aeP;
                    const hD = k === "l" ? s.hlD : s.heD, aD = k === "l" ? s.alD : s.aeD;
                    return (<Fragment key={s.l + k}>
                      <div style={{ color: "#aaa" }}>{s.l} <span style={{ color: "#444" }}>({s.p}%)</span></div>
                      <div style={{ textAlign: "right", color: hP >= 0 ? "#4ade80" : "#ef4444", fontWeight: 600 }}>
                        {hP >= 0 ? "+" : ""}{hP}% <span style={{ color: "#333", fontWeight: 400 }}>${hD >= 0 ? "+" : ""}{hD}</span>
                      </div>
                      <div style={{ textAlign: "right", color: aP >= 0 ? "#4ade80" : "#ef4444", fontWeight: 600 }}>
                        {aP >= 0 ? "+" : ""}{aP}% <span style={{ color: "#333", fontWeight: 400 }}>${aD >= 0 ? "+" : ""}{aD}</span>
                      </div>
                    </Fragment>);
                  })}
                  <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #1a1a2e", margin: "3px 0" }} />
                  <div style={{ color: "#444" }}>Price</div>
                  <div style={{ textAlign: "right", color: c }}>${k === "l" ? logistic(matchSim.h.elo).toFixed(2) : exponential(matchSim.h.elo, expScale).toFixed(2)}</div>
                  <div style={{ textAlign: "right", color: c }}>${k === "l" ? logistic(matchSim.a.elo).toFixed(2) : exponential(matchSim.a.elo, expScale).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>)}
      </div>
    </div>
  );
}
