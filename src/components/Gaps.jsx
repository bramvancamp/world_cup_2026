import { useState, useMemo } from 'react'
import { fmtVal, normalise } from '../utils'
import SearchBar from './SearchBar'

function getMatchups(teams, groupName) {
  const gTeams = teams.filter(t => t.group === groupName)
  const pairs = []
  for (let i = 0; i < gTeams.length; i++) {
    for (let j = i + 1; j < gTeams.length; j++) {
      const a = gTeams[i].value >= gTeams[j].value ? gTeams[i] : gTeams[j]
      const b = gTeams[i].value >= gTeams[j].value ? gTeams[j] : gTeams[i]
      pairs.push({ group: groupName, a, b, delta: a.value - b.value, ratio: a.value / b.value })
    }
  }
  return pairs
}

export default function Gaps({ teams, groupNames, onTeamLink }) {
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const allMatchups = useMemo(() => {
    const m = []
    groupNames.forEach(g => m.push(...getMatchups(teams, g)))
    return m.sort((a, b) => b.ratio - a.ratio)
  }, [teams, groupNames])

  const typeFiltered = useMemo(() => {
    if (filterType === 'top20') return allMatchups.slice(0, 20)
    if (filterType === 'mega') return allMatchups.filter(m => m.ratio > 20)
    if (filterType === 'closest') return [...allMatchups].sort((a, b) => a.ratio - b.ratio).slice(0, 20)
    return allMatchups
  }, [allMatchups, filterType])

  const n = normalise(query)
  const visible = n
    ? typeFiltered.filter(m => normalise(m.a.name).includes(n) || normalise(m.b.name).includes(n))
    : typeFiltered

  const FILTERS = [
    { id: 'all',     label: 'All (72)' },
    { id: 'top20',   label: 'Top 20 mismatches' },
    { id: 'mega',    label: 'Extreme ratio (>20×)' },
    { id: 'closest', label: 'Most even games' },
  ]

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Group Stage Matchups by Value Gap</div>
        <div className="section-note">All 72 group-stage fixtures, sorted by squad value ratio</div>
      </div>
      <SearchBar id="search-gaps" placeholder="Search country…" onSearch={setQuery} />
      <div className="matchup-filters">
        <span className="filter-label">Filter:</span>
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-btn${filterType === f.id ? ' active' : ''}`}
            onClick={() => setFilterType(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {visible.length === 0 && query && <div className="search-no-results">No matches found.</div>}
      <div className="matchup-list">
        {visible.map((m, i) => {
          const totalVal = m.a.value + m.b.value
          const pctA = (m.a.value / totalVal * 100).toFixed(1)
          const cardClass = m.ratio > 20 ? 'mega-gap' : m.ratio > 8 ? 'big-gap' : ''
          const badgeClass = m.ratio > 20 ? 'mega' : m.ratio > 8 ? 'big' : ''
          return (
            <div key={i} className={`matchup-card ${cardClass}`}>
              <div className="matchup-meta">
                <span className="matchup-group-tag">Group {m.group}</span>
                <span className={`matchup-delta-badge ${badgeClass}`}>{m.ratio.toFixed(1)}× · gap {fmtVal(m.delta)}</span>
              </div>
              <div className="matchup-teams">
                <div className="matchup-team">
                  <span className="matchup-team-flag">{m.a.flag}</span>
                  <div>
                    <div className="matchup-team-name team-link" onClick={() => onTeamLink(m.a.name)}>{m.a.name}</div>
                    <div className="matchup-team-val">{fmtVal(m.a.value)} · FIFA #{m.a.fifa}</div>
                  </div>
                </div>
                <div className="matchup-vs">VS</div>
                <div className="matchup-team right">
                  <span className="matchup-team-flag">{m.b.flag}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div className="matchup-team-name team-link" onClick={() => onTeamLink(m.b.name)}>{m.b.name}</div>
                    <div className="matchup-team-val">{fmtVal(m.b.value)} · FIFA #{m.b.fifa}</div>
                  </div>
                </div>
              </div>
              <div className="matchup-bar-section">
                <div className="matchup-bar-dual">
                  <div className="matchup-bar-a" style={{ width: `${pctA}%` }} />
                  <div className="matchup-bar-b" style={{ width: `${100 - parseFloat(pctA)}%` }} />
                </div>
                <div className="matchup-bar-labels">
                  <span>{m.a.name}: {pctA}% of combined value</span>
                  <span>{m.b.name}: {(100 - parseFloat(pctA)).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
