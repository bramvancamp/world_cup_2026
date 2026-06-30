import { useMemo, useState } from 'react'
import { simulateTournament, buildR32Predictions, modelMeta, predictWin } from '../ml/predictor'
import { teams } from '../data/teams'
import { championOdds } from '../data/knockout'
import { fmtVal } from '../utils'

const teamMap = Object.fromEntries(teams.map(t => [t.name, t]))
function T(name) { return teamMap[name] }

function oddsToImplied(odds) {
  if (!odds) return null
  return odds > 0 ? (100 / (odds + 100) * 100) : (Math.abs(odds) / (Math.abs(odds) + 100) * 100)
}

function ProbBar({ value, max = 100, color = 'accent' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="ml-probbar-bg">
      <div className="ml-probbar-fill" style={{ width: `${pct}%`, background: color === 'gold' ? 'var(--accent2)' : 'var(--bar-gradient)' }} />
    </div>
  )
}

// ── Match prediction card ─────────────────────────────────────────────────────
function MatchPredCard({ m }) {
  const ta = T(m.home)
  const tb = T(m.away)
  if (!ta || !tb || m.status === 'final') return null

  const probH = m.predictedWinProbHome
  const probA = 1 - probH
  const pctH = Math.round(probH * 100)
  const pctA = 100 - pctH
  const vp = +(100 * (ta.value / (ta.value + tb.value))).toFixed(0)
  const rankFav = ta.fifa <= tb.fifa ? m.home : m.away

  return (
    <div className={`ml-match-card${m.status === 'today' ? ' ml-match-today' : ''}`}>
      <div className="ml-match-meta">
        <span className={`bk-badge ${m.status === 'today' ? 'bs-today' : 'bs-upcoming'}`}>
          {m.status === 'today' ? 'TODAY' : 'UPCOMING'}
        </span>
        <span className="ml-match-date">{m.date}</span>
        <span className="ml-match-venue">{m.venue}</span>
      </div>

      <div className="ml-teams">
        {/* Home */}
        <div className={`ml-team${probH >= 0.5 ? ' ml-team--fav' : ''}`}>
          <span className="ml-flag">{ta.flag}</span>
          <div className="ml-team-info">
            <div className="ml-team-name">{m.home}</div>
            <div className="ml-team-sub">{fmtVal(ta.value)} · FIFA #{ta.fifa}</div>
          </div>
          <div className="ml-pct-block">
            <div className={`ml-pct${probH >= 0.5 ? ' ml-pct--fav' : ''}`}>{pctH}%</div>
            <div className="ml-pct-label">ML win</div>
          </div>
        </div>

        <div className="ml-vs-block">
          <div className="ml-vs">VS</div>
          {m.oddsHome !== null && (
            <div className="ml-odds-row">
              <span className="ml-odds">{m.oddsHome > 0 ? '+' : ''}{m.oddsHome}</span>
              <span className="ml-odds-lbl">odds</span>
              <span className="ml-odds">{m.oddsAway > 0 ? '+' : ''}{m.oddsAway}</span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className={`ml-team ml-team-right${probA >= 0.5 ? ' ml-team--fav' : ''}`}>
          <span className="ml-flag">{tb.flag}</span>
          <div className="ml-team-info ml-team-info-right">
            <div className="ml-team-name">{m.away}</div>
            <div className="ml-team-sub">{fmtVal(tb.value)} · FIFA #{tb.fifa}</div>
          </div>
          <div className="ml-pct-block">
            <div className={`ml-pct${probA >= 0.5 ? ' ml-pct--fav' : ''}`}>{pctA}%</div>
            <div className="ml-pct-label">ML win</div>
          </div>
        </div>
      </div>

      {/* Full probability bar */}
      <div className="ml-fullbar-wrap">
        <div className="ml-fullbar-dual">
          <div className="ml-fullbar-home" style={{ width: `${pctH}%` }} />
          <div className="ml-fullbar-away" style={{ width: `${pctA}%` }} />
        </div>
        <div className="ml-fullbar-labels">
          <span>{m.home}: {pctH}%</span>
          <span>Squad value: {m.home} {vp}% · {m.away} {100-vp}%</span>
          <span>{m.away}: {pctA}%</span>
        </div>
      </div>

      {/* Signal breakdown */}
      <div className="ml-signals">
        <div className="ml-signal">
          <span className="ml-signal-key">Value edge:</span>
          <span className="ml-signal-val">
            {Math.round(predictWin(m.home, m.away, null) * 100)}% (value+rank only)
          </span>
        </div>
        {m.impliedHome && (
          <div className="ml-signal">
            <span className="ml-signal-key">Bookmaker:</span>
            <span className="ml-signal-val">{Math.round(m.impliedHome * 100)}% {m.home}</span>
          </div>
        )}
        <div className="ml-signal">
          <span className="ml-signal-key">Predicted winner:</span>
          <span className="ml-signal-val ml-signal-winner">
            {m.predictedWinner} {T(m.predictedWinner)?.flag}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Tournament simulation table ───────────────────────────────────────────────
const ROUNDS = [
  { key: 'r32',      label: 'R32',  short: 'R32' },
  { key: 'r16',      label: 'R16',  short: 'R16' },
  { key: 'qf',       label: 'QF',   short: 'QF' },
  { key: 'sf',       label: 'SF',   short: 'SF' },
  { key: 'final',    label: 'Final', short: 'Final' },
  { key: 'champion', label: '🏆 Champion', short: '🏆' },
]

function SimTable({ simResults }) {
  // Sort by champion probability
  const sorted = Object.entries(simResults)
    .map(([name, probs]) => ({ name, ...probs }))
    .sort((a, b) => b.champion - a.champion)

  const maxChamp = sorted[0]?.champion || 1

  return (
    <div className="ml-sim-table-wrap">
      <table className="ml-sim-table">
        <thead>
          <tr>
            <th className="ml-sim-th ml-sim-rank">#</th>
            <th className="ml-sim-th ml-sim-team-col">Team</th>
            {ROUNDS.map(r => (
              <th key={r.key} className="ml-sim-th">{r.short}</th>
            ))}
            <th className="ml-sim-th">Book odds</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const t = T(row.name)
            const champOdds = championOdds[row.name]
            const bookImplied = champOdds ? oddsToImplied(champOdds) : null
            return (
              <tr key={row.name} className={`ml-sim-row${i < 3 ? ' ml-sim-top' : ''}`}>
                <td className="ml-sim-td ml-sim-rank-cell">{i + 1}</td>
                <td className="ml-sim-td ml-sim-team-cell">
                  <span className="ml-sim-flag">{t?.flag}</span>
                  <span className="ml-sim-name">{row.name}</span>
                  <span className="ml-sim-val">{t && fmtVal(t.value)}</span>
                </td>
                {ROUNDS.map(r => (
                  <td key={r.key} className={`ml-sim-td ml-sim-prob-cell${r.key === 'champion' ? ' ml-sim-champ-cell' : ''}`}>
                    <div className="ml-sim-prob-inner">
                      <span className={`ml-sim-prob${r.key === 'champion' ? ' ml-sim-prob--champ' : ''}`}>
                        {row[r.key]}%
                      </span>
                      {r.key === 'champion' && (
                        <ProbBar value={row.champion} max={maxChamp} color="gold" />
                      )}
                    </div>
                  </td>
                ))}
                <td className="ml-sim-td ml-sim-book-cell">
                  {champOdds ? (
                    <span className="ml-sim-book-odds">
                      +{champOdds}
                      {bookImplied && <span className="ml-sim-book-implied">({bookImplied.toFixed(1)}%)</span>}
                    </span>
                  ) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Model info card ────────────────────────────────────────────────────────────
function ModelInfo() {
  return (
    <div className="ml-model-card">
      <div className="ml-model-title">Model Methodology</div>
      <div className="ml-model-body">
        <div className="ml-model-row">
          <span className="ml-model-key">Algorithm</span>
          <span className="ml-model-val">{modelMeta.name}</span>
        </div>
        <div className="ml-model-row">
          <span className="ml-model-key">Simulations</span>
          <span className="ml-model-val">{modelMeta.sims.toLocaleString()} Monte Carlo</span>
        </div>
        <div className="ml-model-row">
          <span className="ml-model-key">With odds (R32)</span>
          <span className="ml-model-val">
            {Object.entries(modelMeta.weights.withOdds).map(([k,v]) => `${k} ${v}%`).join(' · ')}
          </span>
        </div>
        <div className="ml-model-row">
          <span className="ml-model-key">Without odds (R16+)</span>
          <span className="ml-model-val">
            {Object.entries(modelMeta.weights.withoutOdds).map(([k,v]) => `${k} ${v}%`).join(' · ')}
          </span>
        </div>
        <div className="ml-model-row">
          <span className="ml-model-key">Calibration</span>
          <span className="ml-model-val">{modelMeta.calibration}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main MLPredictor component ────────────────────────────────────────────────
export default function MLPredictor() {
  const [view, setView] = useState('matches') // 'matches' | 'simulation'
  const [simDone, setSimDone] = useState(false)
  const [simResults, setSimResults] = useState(null)

  const r32Preds = useMemo(() => buildR32Predictions(), [])
  const pendingMatches = r32Preds.filter(m => m.status !== 'final')

  function runSim() {
    const results = simulateTournament()
    setSimResults(results)
    setSimDone(true)
  }

  return (
    <div className="ml-root">
      <div className="section-header">
        <div>
          <div className="section-title">ML Predictions</div>
          <div className="section-note">
            Blended model: squad values · FIFA rankings · DraftKings odds · {modelMeta.sims.toLocaleString()} Monte Carlo sims
          </div>
        </div>
        <div className="bk-view-toggle">
          <button className={`bk-toggle-btn${view === 'matches' ? ' active' : ''}`} onClick={() => setView('matches')}>
            Match Predictions
          </button>
          <button className={`bk-toggle-btn${view === 'simulation' ? ' active' : ''}`} onClick={() => {
            setView('simulation')
            if (!simDone) runSim()
          }}>
            Tournament Sim
          </button>
        </div>
      </div>

      {view === 'matches' && (
        <div>
          <div className="ml-section-label">
            Round of 32 — {pendingMatches.length} matches remaining &nbsp;·&nbsp;
            Win probability = 40% bookmaker + 35% squad value + 25% FIFA ranking
          </div>
          {pendingMatches.map(m => <MatchPredCard key={m.id} m={m} />)}
          <ModelInfo />
        </div>
      )}

      {view === 'simulation' && (
        <div>
          {!simDone && (
            <div className="ml-sim-loading">
              <div className="squad-spinner" />
              <span>Running {modelMeta.sims.toLocaleString()} tournament simulations…</span>
            </div>
          )}
          {simDone && simResults && (
            <>
              <div className="ml-section-label">
                Tournament win probability for all 32 remaining teams · {modelMeta.sims.toLocaleString()} Monte Carlo simulations
              </div>
              <SimTable simResults={simResults} />
              <ModelInfo />
            </>
          )}
        </div>
      )}
    </div>
  )
}
