import { useMemo, useState } from 'react'
import { r32Matches, bracketStructure, roundDates } from '../data/knockout'
import { buildR32Predictions, predictWin } from '../ml/predictor'
import { teams } from '../data/teams'
import { fmtVal } from '../utils'

const teamMap = Object.fromEntries(teams.map(t => [t.name, t]))
function T(name) { return teamMap[name] }

const STATUS_LABEL = { final: 'FT', today: 'TODAY', upcoming: 'UPCOMING' }
const STATUS_CLASS = { final: 'bs-final', today: 'bs-today', upcoming: 'bs-upcoming' }

// ── Small match card used throughout the bracket ──────────────────────────────
function MatchCard({ m, compact = false }) {
  const ta = T(m.home)
  const tb = T(m.away)
  if (!ta || !tb) return null

  const prob = m.predictedWinProbHome
  const pctH = prob !== null ? Math.round(prob * 100) : null
  const pctA = pctH !== null ? 100 - pctH : null
  const homeWon = m.status === 'final' && m.winner === m.home
  const awayWon = m.status === 'final' && m.winner === m.away

  return (
    <div className={`bk-card${m.status === 'today' ? ' bk-card--today' : ''}${m.upset ? ' bk-card--upset' : ''}${compact ? ' bk-card--compact' : ''}`}>
      <div className="bk-card-header">
        <span className={`bk-badge ${STATUS_CLASS[m.status]}`}>{STATUS_LABEL[m.status]}</span>
        <span className="bk-venue">{m.date} · {m.venue}</span>
        {m.upset && <span className="bk-upset-badge">UPSET</span>}
      </div>

      {/* Home team row */}
      <div className={`bk-team${homeWon ? ' bk-team--winner' : ''}${awayWon ? ' bk-team--loser' : ''}`}>
        <span className="bk-flag">{ta.flag}</span>
        <span className="bk-name">{m.home}</span>
        <span className="bk-seed">{m.seedHome}</span>
        <span className="bk-val">{fmtVal(ta.value)}</span>
        {m.status === 'final'
          ? <span className={`bk-score${homeWon ? ' bk-score--win' : ''}`}>{m.homeScore}</span>
          : pctH !== null && <span className="bk-prob">{pctH}%</span>
        }
      </div>

      {/* Away team row */}
      <div className={`bk-team${awayWon ? ' bk-team--winner' : ''}${homeWon ? ' bk-team--loser' : ''}`}>
        <span className="bk-flag">{tb.flag}</span>
        <span className="bk-name">{m.away}</span>
        <span className="bk-seed">{m.seedAway}</span>
        <span className="bk-val">{fmtVal(tb.value)}</span>
        {m.status === 'final'
          ? <span className={`bk-score${awayWon ? ' bk-score--win' : ''}`}>{m.awayScore}</span>
          : pctA !== null && <span className="bk-prob">{pctA}%</span>
        }
      </div>

      {/* Shootout */}
      {m.penHome !== null && (
        <div className="bk-pens">Penalties: {m.penHome} – {m.penAway}</div>
      )}

      {/* Probability bar */}
      {m.status !== 'final' && pctH !== null && (
        <div className="bk-bar-wrap">
          <div className="bk-bar-fill" style={{ width: `${pctH}%` }} />
        </div>
      )}

      {/* Bookmaker odds */}
      {m.oddsHome !== null && (
        <div className="bk-odds">
          <span className="bk-odds-label">DraftKings:</span>
          <span className="bk-odds-val">{m.oddsHome > 0 ? '+' : ''}{m.oddsHome}</span>
          <span className="bk-odds-sep">·</span>
          <span className="bk-odds-val">{m.oddsAway > 0 ? '+' : ''}{m.oddsAway}</span>
        </div>
      )}
    </div>
  )
}

// ── Future round slot (predicted winner shown) ────────────────────────────────
function FutureSlot({ label, teamName, isFinal = false }) {
  const t = teamName ? T(teamName) : null
  return (
    <div className={`bk-future-slot${isFinal ? ' bk-future-slot--final' : ''}`}>
      {t ? (
        <>
          <span className="bk-flag">{t.flag}</span>
          <span className="bk-name">{teamName}</span>
          <span className="bk-val bk-val--muted">{fmtVal(t.value)}</span>
        </>
      ) : (
        <span className="bk-tbd">{label}</span>
      )}
    </div>
  )
}

// ── Build predicted winners for the full bracket from simulation ─────────────
function buildBracketPredictions(r32Preds) {
  // Work out predicted winners top-down using the highest win-prob team at each stage
  const slotWinner = {}

  for (const m of r32Preds) {
    slotWinner[m.id] = m.predictedWinner || m.winner
  }

  const predict = (slotA, slotB) => {
    const a = slotWinner[slotA]
    const b = slotWinner[slotB]
    if (!a || !b) return null
    const p = predictWin(a, b, null)
    return p >= 0.5 ? a : b
  }

  // R16
  for (const key of ['r16_1','r16_2','r16_3','r16_4','r16_5','r16_6','r16_7','r16_8']) {
    const [s1, s2] = bracketStructure[key]
    slotWinner[key] = predict(s1, s2)
  }
  // QF
  for (const key of ['qf_1','qf_2','qf_3','qf_4']) {
    const [s1, s2] = bracketStructure[key]
    slotWinner[key] = predict(s1, s2)
  }
  // SF
  for (const key of ['sf_1','sf_2']) {
    const [s1, s2] = bracketStructure[key]
    slotWinner[key] = predict(s1, s2)
  }
  // Final
  const [fa, fb] = bracketStructure.final
  slotWinner['final'] = predict(fa, fb)

  return slotWinner
}

// ── Main Bracket component ────────────────────────────────────────────────────
export default function Bracket() {
  const [view, setView] = useState('r32') // 'r32' | 'tree'

  const r32Preds = useMemo(() => buildR32Predictions(), [])
  const bracket  = useMemo(() => buildBracketPredictions(r32Preds), [r32Preds])

  const completedCount = r32Matches.filter(m => m.status === 'final').length
  const todayCount     = r32Matches.filter(m => m.status === 'today').length
  const upcomingCount  = r32Matches.filter(m => m.status === 'upcoming').length

  // Group R32 matches by quadrant for the tree view
  const byQuadrant = [1,2,3,4].map(q => r32Preds.filter(m => m.quadrant === q))

  return (
    <div className="bracket-root">
      {/* Header */}
      <div className="section-header">
        <div>
          <div className="section-title">Tournament Bracket</div>
          <div className="section-note">
            Round of 32 · {roundDates.r32} &nbsp;·&nbsp;
            <span className="bk-stat done">{completedCount} completed</span>
            {todayCount > 0 && <span className="bk-stat today">{todayCount} today</span>}
            <span className="bk-stat upcoming">{upcomingCount} upcoming</span>
          </div>
        </div>
        <div className="bk-view-toggle">
          <button className={`bk-toggle-btn${view === 'r32' ? ' active' : ''}`} onClick={() => setView('r32')}>Round of 32</button>
          <button className={`bk-toggle-btn${view === 'tree' ? ' active' : ''}`} onClick={() => setView('tree')}>Full Tree</button>
        </div>
      </div>

      {view === 'r32' && (
        <div className="bk-r32-grid">
          {r32Preds.map(m => <MatchCard key={m.id} m={m} />)}
        </div>
      )}

      {view === 'tree' && (
        <div className="bk-tree-root">
          <div className="bk-tree-legend">
            <span className="bk-legend-item"><span className="bk-badge bs-final">FT</span> Final result</span>
            <span className="bk-legend-item"><span className="bk-badge bs-today">TODAY</span> Live today</span>
            <span className="bk-legend-item"><span className="bk-badge bs-upcoming">UPCOMING</span> ML predicted winner shown →</span>
          </div>

          {/* 4 quadrants side by side, each showing the path R32→R16→QF */}
          <div className="bk-tree-grid">
            {byQuadrant.map((matches, qi) => {
              const q = qi + 1
              const r16a = bracket[`r16_${q * 2 - 1}`]
              const r16b = bracket[`r16_${q * 2}`]
              const qfW  = bracket[`qf_${q}`]
              const sfKey = q <= 2 ? 'sf_1' : 'sf_2'
              const sfW  = bracket[sfKey]
              const finalW = bracket['final']

              return (
                <div key={q} className="bk-tree-quadrant">
                  <div className="bk-tree-quad-label">Quadrant {q}</div>

                  {/* R32 matches in pairs */}
                  <div className="bk-tree-r32-pair">
                    <MatchCard m={matches[0]} compact />
                    <MatchCard m={matches[1]} compact />
                  </div>
                  <div className="bk-tree-connector bk-conn-r16" />
                  <div className="bk-tree-r16-slot">
                    <div className="bk-tree-round-label">R16</div>
                    <FutureSlot label="TBD" teamName={r16a} />
                  </div>

                  <div className="bk-tree-r32-pair">
                    <MatchCard m={matches[2]} compact />
                    <MatchCard m={matches[3]} compact />
                  </div>
                  <div className="bk-tree-connector bk-conn-r16" />
                  <div className="bk-tree-r16-slot">
                    <div className="bk-tree-round-label">R16</div>
                    <FutureSlot label="TBD" teamName={r16b} />
                  </div>

                  {/* QF */}
                  <div className="bk-tree-connector bk-conn-qf" />
                  <div className="bk-tree-qf-slot">
                    <div className="bk-tree-round-label accent">Quarter-Final</div>
                    <FutureSlot label="TBD" teamName={qfW} />
                  </div>

                  {/* SF (only show in quadrants 2 and 4 to avoid duplication) */}
                  {(q === 2 || q === 4) && (
                    <>
                      <div className="bk-tree-connector bk-conn-sf" />
                      <div className="bk-tree-sf-slot">
                        <div className="bk-tree-round-label accent2">Semi-Final</div>
                        <FutureSlot label="TBD" teamName={sfW} />
                      </div>
                    </>
                  )}

                  {/* Final champion - show only in Q4 */}
                  {q === 4 && (
                    <>
                      <div className="bk-tree-connector bk-conn-final" />
                      <div className="bk-tree-final-slot">
                        <div className="bk-tree-round-label gold">⚽ PREDICTED CHAMPION</div>
                        <FutureSlot label="TBD" teamName={finalW} isFinal />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Full champion bar */}
          {bracket['final'] && (
            <div className="bk-champion-bar">
              <span className="bk-champion-label">ML PREDICTED WORLD CUP CHAMPION</span>
              <div className="bk-champion-team">
                <span className="bk-champion-flag">{T(bracket['final'])?.flag}</span>
                <span className="bk-champion-name">{bracket['final']}</span>
                <span className="bk-champion-val">{T(bracket['final']) && fmtVal(T(bracket['final']).value)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
