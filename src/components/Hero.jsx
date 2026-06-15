import { fmtVal } from '../utils'

export default function Hero({ teams }) {
  const total = teams.reduce((s, t) => s + t.value, 0)
  const highest = teams.reduce((a, b) => a.value > b.value ? a : b)
  const lowest = teams.reduce((a, b) => a.value < b.value ? a : b)
  const ratio = Math.round(highest.value / lowest.value)

  return (
    <div className="hero">
      <div className="hero-label">Data: Transfermarkt · June 2026</div>
      <h1 className="hero-title">World Cup 2026<br /><span>Squad Values</span></h1>
      <p className="hero-sub">All 48 national teams ranked by Transfermarkt squad value. Group matchup analysis shows where the biggest financial gaps — and biggest mismatches — occur.</p>
      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-val">{fmtVal(total)}</span>
          <span className="hero-stat-lbl">Total tournament value</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-val">{fmtVal(highest.value)}</span>
          <span className="hero-stat-lbl">Highest squad ({highest.name})</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-val">{fmtVal(lowest.value)}</span>
          <span className="hero-stat-lbl">Lowest squad ({lowest.name})</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-val">{ratio}×</span>
          <span className="hero-stat-lbl">{highest.name} vs {lowest.name} ratio</span>
        </div>
      </div>
    </div>
  )
}
