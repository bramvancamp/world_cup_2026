export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-label">Data: Transfermarkt · June 2026</div>
      <h1 className="hero-title">World Cup 2026<br /><span>Squad Values</span></h1>
      <p className="hero-sub">All 48 national teams ranked by Transfermarkt squad value. Group matchup analysis shows where the biggest financial gaps — and biggest mismatches — occur.</p>
      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-val">€17.57B</span>
          <span className="hero-stat-lbl">Total tournament value</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-val">€1.53B</span>
          <span className="hero-stat-lbl">Highest squad (France)</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-val">€19.8M</span>
          <span className="hero-stat-lbl">Lowest squad (Jordan)</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-val">77×</span>
          <span className="hero-stat-lbl">France vs Jordan ratio</span>
        </div>
      </div>
    </div>
  )
}
