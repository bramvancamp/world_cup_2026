import { useState } from 'react'
import { confColors } from '../data/teams'
import { fmtVal, normalise } from '../utils'
import SearchBar from './SearchBar'

export default function Groups({ teams, groupNames, onTeamLink }) {
  const [query, setQuery] = useState('')
  const n = normalise(query)

  const groupsData = groupNames.map(g => {
    const gTeams = teams.filter(t => t.group === g).sort((a, b) => b.value - a.value)
    const total = gTeams.reduce((s, t) => s + t.value, 0)
    return { name: g, teams: gTeams, total }
  }).sort((a, b) => b.total - a.total)

  const visible = groupsData.map(g => ({
    ...g,
    visibleTeams: n ? g.teams.filter(t => normalise(t.name).includes(n)) : g.teams,
  })).filter(g => !n || g.visibleTeams.length > 0)

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Groups by Combined Squad Value</div>
        <div className="section-note">Sorted highest to lowest total group value</div>
      </div>
      <SearchBar id="search-groups" placeholder="Search country…" onSearch={setQuery} />
      {visible.length === 0 && query && (
        <div className="search-no-results">No countries match your search.</div>
      )}
      <div className="groups-grid">
        {visible.map(g => (
          <div key={g.name} className="group-card">
            <div className="group-card-header">
              <span className="group-card-name">Group {g.name}</span>
              <span className="group-card-total">{fmtVal(g.total)}</span>
            </div>
            {g.visibleTeams.map(t => {
              const pct = (t.value / g.teams[0].value * 100).toFixed(0)
              const confColor = confColors[t.conf] || '#64748b'
              return (
                <div key={t.name} className="group-team">
                  <span className="group-team-flag">{t.flag}</span>
                  <span className="group-team-name team-link" onClick={() => onTeamLink(t.name)}>{t.name}</span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '12px', color: 'var(--muted)', minWidth: '32px' }}>#{t.fifa}</span>
                  <div className="group-team-bar">
                    <div className="group-team-bar-fill" style={{ width: `${pct}%`, background: confColor }} />
                  </div>
                  <span className="group-team-val">{fmtVal(t.value)}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
