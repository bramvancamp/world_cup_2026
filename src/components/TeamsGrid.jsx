import { useState } from 'react'
import { fmtVal, normalise } from '../utils'
import SearchBar from './SearchBar'

export default function TeamsGrid({ sorted, onTeamClick }) {
  const [query, setQuery] = useState('')
  const n = normalise(query)
  const visible = sorted.filter(t => !n || normalise(t.name).includes(n))

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Select a Team</div>
        <div className="section-note">Tap a team to see full squad · player values · positions</div>
      </div>
      <SearchBar id="search-teams" placeholder="Search country…" onSearch={setQuery} />
      {visible.length === 0 && query && (
        <div className="search-no-results">No countries match your search.</div>
      )}
      <div className="team-grid">
        {visible.map(t => (
          <div key={t.name} className="team-card" onClick={() => onTeamClick(t.name)}>
            <span className="team-card-flag">{t.flag}</span>
            <span className="team-card-name">{t.name}</span>
            <span className="team-card-group">Group {t.group}</span>
            <span className="team-card-val">{fmtVal(t.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
