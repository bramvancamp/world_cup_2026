import { groupStandings } from '../data/knockout'
import { teams } from '../data/teams'
import { fmtVal } from '../utils'

const teamMap = Object.fromEntries(teams.map(t => [t.name, t]))
function T(name) { return teamMap[name] }

const QUAL_LABEL = {
  '1st':      { label: '1st', cls: 'gs-q1' },
  '2nd':      { label: '2nd', cls: 'gs-q2' },
  '3rd-best': { label: '3rd ★', cls: 'gs-q3' },
}

export default function GroupStandings() {
  const groupKeys = Object.keys(groupStandings)

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Group Stage Final Standings</div>
          <div className="section-note">
            All 12 groups · Top 2 per group + 8 best 3rd-place → 32 teams advance
          </div>
        </div>
      </div>
      <div className="gs-legend">
        <span className="gs-legend-item gs-q1-dot">1st place — qualified</span>
        <span className="gs-legend-item gs-q2-dot">2nd place — qualified</span>
        <span className="gs-legend-item gs-q3-dot">3rd place (best 8) — qualified</span>
        <span className="gs-legend-item gs-elim-dot">Eliminated</span>
      </div>

      <div className="gs-grid">
        {groupKeys.map(g => {
          const gTeams = groupStandings[g]
          return (
            <div key={g} className="gs-group-card">
              <div className="gs-group-header">
                <span className="gs-group-name">Group {g}</span>
                <span className="gs-group-sub">{gTeams.filter(t => t.qualified).length} advance</span>
              </div>
              <table className="gs-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="gs-th-team">Team</th>
                    <th className="gs-th">P</th>
                    <th className="gs-th">W</th>
                    <th className="gs-th">D</th>
                    <th className="gs-th">L</th>
                    <th className="gs-th">GD</th>
                    <th className="gs-th">Pts</th>
                    <th className="gs-th">€</th>
                  </tr>
                </thead>
                <tbody>
                  {gTeams.map((row, i) => {
                    const t = T(row.name)
                    const q = QUAL_LABEL[row.qualified]
                    const gd = row.gf - row.ga
                    return (
                      <tr key={row.name} className={`gs-row${!row.qualified ? ' gs-row--elim' : ''}`}>
                        <td className="gs-td gs-td-qual">
                          {q && <span className={`gs-qual-badge ${q.cls}`}>{q.label}</span>}
                          {!row.qualified && <span className="gs-qual-badge gs-elim">—</span>}
                        </td>
                        <td className="gs-td gs-td-team">
                          <span className="gs-flag">{t?.flag}</span>
                          <span className="gs-name">{row.name}</span>
                        </td>
                        <td className="gs-td gs-td-num">{row.w + row.d + row.l}</td>
                        <td className="gs-td gs-td-num">{row.w}</td>
                        <td className="gs-td gs-td-num">{row.d}</td>
                        <td className="gs-td gs-td-num">{row.l}</td>
                        <td className={`gs-td gs-td-num${gd > 0 ? ' gs-gd-pos' : gd < 0 ? ' gs-gd-neg' : ''}`}>
                          {gd > 0 ? '+' : ''}{gd}
                        </td>
                        <td className="gs-td gs-td-pts">{row.pts}</td>
                        <td className="gs-td gs-td-val">{t && fmtVal(t.value)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
}
