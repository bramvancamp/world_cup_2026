import { useEffect } from 'react'
import { SQUADS } from '../data/squads'
import { LEGENDS } from '../data/legends'
import { fmtVal } from '../utils'

const POSGROUP_LABEL = { GK: 'Goalkeepers', DEF: 'Defenders', MID: 'Midfielders', ATT: 'Attackers' }
const ORDER = ['GK', 'DEF', 'MID', 'ATT']

export default function SquadPanel({ teamName, teams, onClose }) {
  const t = teams.find(x => x.name === teamName)
  const rows = SQUADS[teamName] || []
  const leg = LEGENDS[teamName]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!t) return null

  return (
    <>
      <div className="squad-overlay open" onClick={onClose} />
      <div className="squad-panel open">
        <div className="squad-panel-header">
          <div className="squad-panel-title">{t.flag}{'  '}{t.name}</div>
          <button type="button" className="squad-close" aria-label="Close squad panel" onClick={onClose}>✕</button>
        </div>
        <div className="squad-panel-meta">
          <div className="squad-meta-item">
            <span className="squad-meta-val">{fmtVal(t.value)}</span>
            <span className="squad-meta-lbl">Squad value</span>
          </div>
          <div className="squad-meta-item">
            <span className="squad-meta-val">#{t.fifa}</span>
            <span className="squad-meta-lbl">FIFA rank</span>
          </div>
          <div className="squad-meta-item">
            <span className="squad-meta-val">Group {t.group}</span>
            <span className="squad-meta-lbl">WC Group</span>
          </div>
        </div>
        <div className="squad-panel-body">
          {leg && (
            <div className="squad-legend">
              <span className="squad-legend-quote">{leg.quote}</span>
              <span className="squad-legend-attr">{leg.player}</span>
            </div>
          )}
          {rows.length === 0 ? (
            <div className="squad-error" style={{ color: 'var(--muted)' }}>Squad data not available for this team.</div>
          ) : (
            <>
              {ORDER.map(g => {
                const players = rows.filter(p => p[4] === g).sort((a, b) => a[0] - b[0])
                if (!players.length) return null
                return (
                  <div key={g} className="squad-pos-group">
                    <div className="squad-pos-label">{POSGROUP_LABEL[g]}</div>
                    {players.map(p => {
                      const [num, name, club, pos, , val] = p
                      return (
                        <div key={`${num}-${name}`} className="squad-player">
                          <span className="squad-player-num">{num}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="squad-player-name">{name}</div>
                            <div className="squad-player-club">{club}</div>
                          </div>
                          <span className="squad-player-pos">{pos}</span>
                          <span className="squad-player-val">{val}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              <div className="squad-note">
                ⚠ Squad lists and individual values are compiled from squad announcements and Transfermarkt estimates (mid-2025). Final 26-man lists and exact values may differ.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
