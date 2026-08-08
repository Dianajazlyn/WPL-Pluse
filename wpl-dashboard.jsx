import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from "recharts";
import { Trophy, TrendingUp, Target, Users, Flame, Circle } from "lucide-react";

// ---------- Sample / demo data (illustrative WPL-style season) ----------

const TEAMS = [
  { code: "MI", name: "Mumbai Indians", color: "#0F5FA6", played: 8, won: 6, lost: 2, nrr: 1.24, points: 12 },
  { code: "DC", name: "Delhi Capitals", color: "#B8172E", played: 8, won: 5, lost: 3, nrr: 0.61, points: 10 },
  { code: "RCB", name: "RCB", color: "#C8102E", played: 8, won: 5, lost: 3, nrr: 0.18, points: 10 },
  { code: "GG", name: "Gujarat Giants", color: "#8B5CF6", played: 8, won: 4, lost: 4, nrr: -0.22, points: 8 },
  { code: "UPW", name: "UP Warriorz", color: "#EA7B1A", played: 8, won: 3, lost: 5, nrr: -0.35, points: 6 },
];

const STANDINGS = [...TEAMS].sort((a, b) => b.points - a.points || b.nrr - a.nrr);

const RUN_SCORERS = [
  { name: "S. Mandhana", team: "RCB", runs: 412, sr: 138.2, avg: 51.5, hs: 87 },
  { name: "N. Sciver-Brunt", team: "MI", runs: 386, sr: 142.1, avg: 55.1, hs: 91 },
  { name: "H. Kaur", team: "GG", runs: 351, sr: 121.4, avg: 43.9, hs: 78 },
  { name: "M. Kapp", team: "DC", runs: 329, sr: 130.6, avg: 47.0, hs: 80 },
  { name: "S. Rana", team: "UPW", runs: 298, sr: 148.7, avg: 37.3, hs: 62 },
  { name: "R. Verma", team: "DC", runs: 276, sr: 126.9, avg: 34.5, hs: 55 },
];

const WICKET_TAKERS = [
  { name: "S. Ecclestone", team: "MI", wkts: 17, econ: 6.1, avg: 15.2, best: "4/18" },
  { name: "A. Sharma", team: "DC", wkts: 15, econ: 7.0, avg: 17.8, best: "3/21" },
  { name: "H. Matthews", team: "UPW", wkts: 14, econ: 6.8, avg: 18.4, best: "4/24" },
  { name: "S. Ismail", team: "GG", wkts: 13, econ: 7.4, avg: 19.1, best: "3/19" },
  { name: "R. Gayakwad", team: "RCB", wkts: 12, econ: 7.9, avg: 21.3, best: "3/28" },
];

const MATCH_TREND = [
  { match: "M1", MI: 4, DC: 4, RCB: 2, GG: 0, UPW: 2 },
  { match: "M4", MI: 6, DC: 6, RCB: 4, GG: 2, UPW: 2 },
  { match: "M7", MI: 8, DC: 6, RCB: 6, GG: 4, UPW: 4 },
  { match: "M10", MI: 10, DC: 8, RCB: 8, GG: 4, UPW: 4 },
  { match: "M13", MI: 10, DC: 10, RCB: 8, GG: 6, UPW: 6 },
  { match: "M16", MI: 12, DC: 10, RCB: 10, GG: 8, UPW: 6 },
];

const RECENT_MATCHES = [
  { home: "MI", away: "UPW", result: "MI won by 6 wkts", margin: "6 wkts" },
  { home: "RCB", away: "GG", result: "RCB won by 22 runs", margin: "22 runs" },
  { home: "DC", away: "MI", result: "DC won by 4 wkts", margin: "4 wkts" },
  { home: "GG", away: "UPW", result: "GG won by 15 runs", margin: "15 runs" },
];

const teamColor = (code) => TEAMS.find((t) => t.code === code)?.color || "#999";
const teamName = (code) => TEAMS.find((t) => t.code === code)?.name || code;

// ---------- UI ----------

const TABS = [
  { id: "standings", label: "Standings", icon: Trophy },
  { id: "batting", label: "Run Scorers", icon: TrendingUp },
  { id: "bowling", label: "Wicket Takers", icon: Target },
  { id: "form", label: "Points Progression", icon: Flame },
];

export default function WPLDashboard() {
  const [tab, setTab] = useState("standings");
  const maxPoints = 12;

  const radarData = useMemo(
    () =>
      ["played", "won", "points"].map((key) => {
        const row = { metric: key === "played" ? "Matches" : key === "won" ? "Wins" : "Points" };
        TEAMS.forEach((t) => (row[t.code] = t[key]));
        return row;
      }),
    []
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "linear-gradient(180deg, #0A1A2F 0%, #0D2340 45%, #0A1A2F 100%)",
        color: "#F4EFE6",
        minHeight: "100%",
        padding: "0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        .wpl-title { font-family: 'Archivo Black', sans-serif; }
        .wpl-mono { font-family: 'JetBrains Mono', monospace; }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn:hover { background: rgba(244,239,230,0.08) !important; }
        .row-hover:hover { background: rgba(244,239,230,0.04); }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-thumb { background: #E8B84B; border-radius: 3px; }
      `}</style>

      {/* Header / floodlight strip */}
      <div style={{ padding: "28px 24px 20px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,184,75,0.25) 0%, transparent 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Circle size={10} fill="#E8B84B" color="#E8B84B" />
          <span className="wpl-mono" style={{ fontSize: 11, letterSpacing: 2, color: "#E8B84B", textTransform: "uppercase" }}>
            Live Season Tracker · Sample Data
          </span>
        </div>
        <h1 className="wpl-title" style={{ fontSize: "clamp(28px, 5vw, 42px)", margin: 0, lineHeight: 1.05 }}>
          WOMEN'S PREMIER LEAGUE
        </h1>
        <p style={{ color: "#9FB0C3", marginTop: 8, fontSize: 14, maxWidth: 520 }}>
          Standings, top performers, and form across the season. Swap in your own CSV to make this live.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, padding: "0 24px 20px", overflowX: "auto" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className="tab-btn"
            onClick={() => setTab(id)}
            style={{
              display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
              padding: "10px 16px", borderRadius: 999, border: "1px solid rgba(244,239,230,0.15)",
              background: tab === id ? "#E8B84B" : "transparent",
              color: tab === id ? "#0A1A2F" : "#F4EFE6",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 24px 40px" }}>
        {tab === "standings" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
            <div style={{ background: "rgba(244,239,230,0.04)", borderRadius: 16, border: "1px solid rgba(244,239,230,0.1)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(244,239,230,0.15)" }}>
                    {["#", "Team", "P", "W", "L", "NRR", "Pts"].map((h, i) => (
                      <th key={h} className="wpl-mono" style={{ textAlign: i > 1 ? "center" : "left", padding: "14px 12px", color: "#9FB0C3", fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STANDINGS.map((t, i) => (
                    <tr key={t.code} className="row-hover" style={{ borderBottom: "1px solid rgba(244,239,230,0.06)" }}>
                      <td style={{ padding: "14px 12px", color: i < 3 ? "#E8B84B" : "#9FB0C3", fontWeight: 800 }}>{i + 1}</td>
                      <td style={{ padding: "14px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, display: "inline-block" }} />
                          <span style={{ fontWeight: 700 }}>{t.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "center", color: "#D5DDE6" }}>{t.played}</td>
                      <td style={{ padding: "14px 12px", textAlign: "center", color: "#7FD68F" }}>{t.won}</td>
                      <td style={{ padding: "14px 12px", textAlign: "center", color: "#E58A8A" }}>{t.lost}</td>
                      <td className="wpl-mono" style={{ padding: "14px 12px", textAlign: "center", color: t.nrr >= 0 ? "#7FD68F" : "#E58A8A" }}>
                        {t.nrr > 0 ? "+" : ""}{t.nrr.toFixed(2)}
                      </td>
                      <td className="wpl-mono" style={{ padding: "14px 12px", textAlign: "center", fontWeight: 800, fontSize: 15 }}>{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: "rgba(244,239,230,0.04)", borderRadius: 16, border: "1px solid rgba(244,239,230,0.1)", padding: 20 }}>
              <h3 className="wpl-mono" style={{ fontSize: 12, letterSpacing: 1, color: "#9FB0C3", textTransform: "uppercase", margin: "0 0 16px" }}>Recent Results</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {RECENT_MATCHES.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "rgba(244,239,230,0.03)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: teamColor(m.home) }} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{m.home}</span>
                      <span style={{ color: "#6B7B8D", fontSize: 12 }}>vs</span>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: teamColor(m.away) }} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{m.away}</span>
                    </div>
                    <span className="wpl-mono" style={{ fontSize: 12, color: "#E8B84B" }}>{m.result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "batting" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ background: "rgba(244,239,230,0.04)", borderRadius: 16, border: "1px solid rgba(244,239,230,0.1)", padding: "20px 20px 8px" }}>
              <h3 className="wpl-mono" style={{ fontSize: 12, letterSpacing: 1, color: "#9FB0C3", textTransform: "uppercase", margin: "0 0 16px" }}>Runs This Season</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={RUN_SCORERS} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,239,230,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#9FB0C3", fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "#9FB0C3", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0D2340", border: "1px solid rgba(244,239,230,0.2)", borderRadius: 8, color: "#F4EFE6" }} />
                  <Bar dataKey="runs" radius={[6, 6, 0, 0]}>
                    {RUN_SCORERS.map((entry, i) => (
                      <Cell key={i} fill={teamColor(entry.team)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "rgba(244,239,230,0.04)", borderRadius: 16, border: "1px solid rgba(244,239,230,0.1)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(244,239,230,0.15)" }}>
                    {["Player", "Team", "Runs", "Avg", "SR", "HS"].map((h) => (
                      <th key={h} className="wpl-mono" style={{ textAlign: "left", padding: "12px", color: "#9FB0C3", fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RUN_SCORERS.map((p) => (
                    <tr key={p.name} className="row-hover" style={{ borderBottom: "1px solid rgba(244,239,230,0.06)" }}>
                      <td style={{ padding: "12px", fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${teamColor(p.team)}30`, color: teamColor(p.team) }}>{p.team}</span>
                      </td>
                      <td className="wpl-mono" style={{ padding: "12px", fontWeight: 800, color: "#E8B84B" }}>{p.runs}</td>
                      <td className="wpl-mono" style={{ padding: "12px", color: "#D5DDE6" }}>{p.avg}</td>
                      <td className="wpl-mono" style={{ padding: "12px", color: "#D5DDE6" }}>{p.sr}</td>
                      <td className="wpl-mono" style={{ padding: "12px", color: "#D5DDE6" }}>{p.hs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "bowling" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ background: "rgba(244,239,230,0.04)", borderRadius: 16, border: "1px solid rgba(244,239,230,0.1)", padding: "20px 20px 8px" }}>
              <h3 className="wpl-mono" style={{ fontSize: 12, letterSpacing: 1, color: "#9FB0C3", textTransform: "uppercase", margin: "0 0 16px" }}>Wickets This Season</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={WICKET_TAKERS} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,239,230,0.08)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#9FB0C3", fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#F4EFE6", fontSize: 12 }} width={110} />
                  <Tooltip contentStyle={{ background: "#0D2340", border: "1px solid rgba(244,239,230,0.2)", borderRadius: 8, color: "#F4EFE6" }} />
                  <Bar dataKey="wkts" fill="#E8B84B" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "rgba(244,239,230,0.04)", borderRadius: 16, border: "1px solid rgba(244,239,230,0.1)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(244,239,230,0.15)" }}>
                    {["Player", "Team", "Wkts", "Econ", "Avg", "Best"].map((h) => (
                      <th key={h} className="wpl-mono" style={{ textAlign: "left", padding: "12px", color: "#9FB0C3", fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WICKET_TAKERS.map((p) => (
                    <tr key={p.name} className="row-hover" style={{ borderBottom: "1px solid rgba(244,239,230,0.06)" }}>
                      <td style={{ padding: "12px", fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${teamColor(p.team)}30`, color: teamColor(p.team) }}>{p.team}</span>
                      </td>
                      <td className="wpl-mono" style={{ padding: "12px", fontWeight: 800, color: "#E8B84B" }}>{p.wkts}</td>
                      <td className="wpl-mono" style={{ padding: "12px", color: "#D5DDE6" }}>{p.econ}</td>
                      <td className="wpl-mono" style={{ padding: "12px", color: "#D5DDE6" }}>{p.avg}</td>
                      <td className="wpl-mono" style={{ padding: "12px", color: "#D5DDE6" }}>{p.best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "form" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ background: "rgba(244,239,230,0.04)", borderRadius: 16, border: "1px solid rgba(244,239,230,0.1)", padding: "20px 20px 8px" }}>
              <h3 className="wpl-mono" style={{ fontSize: 12, letterSpacing: 1, color: "#9FB0C3", textTransform: "uppercase", margin: "0 0 16px" }}>Points Progression</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={MATCH_TREND} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,239,230,0.08)" />
                  <XAxis dataKey="match" tick={{ fill: "#9FB0C3", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#9FB0C3", fontSize: 11 }} domain={[0, maxPoints]} />
                  <Tooltip contentStyle={{ background: "#0D2340", border: "1px solid rgba(244,239,230,0.2)", borderRadius: 8, color: "#F4EFE6" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {TEAMS.map((t) => (
                    <Line key={t.code} type="monotone" dataKey={t.code} stroke={t.color} strokeWidth={2.5} dot={{ r: 3 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "rgba(244,239,230,0.04)", borderRadius: 16, border: "1px solid rgba(244,239,230,0.1)", padding: "20px 20px 8px" }}>
              <h3 className="wpl-mono" style={{ fontSize: 12, letterSpacing: 1, color: "#9FB0C3", textTransform: "uppercase", margin: "0 0 16px" }}>Team Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(244,239,230,0.15)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#F4EFE6", fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: "#9FB0C3", fontSize: 10 }} />
                  {TEAMS.map((t) => (
                    <Radar key={t.code} name={t.name} dataKey={t.code} stroke={t.color} fill={t.color} fillOpacity={0.15} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 24px 28px", borderTop: "1px solid rgba(244,239,230,0.08)" }}>
        <p className="wpl-mono" style={{ fontSize: 11, color: "#6B7B8D", margin: 0 }}>
          ★ Sample data for demonstration — upload your own WPL CSV and I'll wire this dashboard to it.
        </p>
      </div>
    </div>
  );
}
