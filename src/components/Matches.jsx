import { useState } from 'react'
import { fmtVal, normalise } from '../utils'
import SearchBar from './SearchBar'

function oddsToProb(odds) {
  if (!odds) return 50
  const n = parseInt(odds, 10)
  if (isNaN(n)) return 50
  return n > 0 ? (100 / (n + 100)) * 100 : ((-n) / (-n + 100)) * 100
}

function MatchRow({ fixture, T }) {
  const [, , , homeName, awayName, venue] = fixture
  const h = T(homeName)
  const a = T(awayName)
  if (!h || !a) return null

  const rawH = oddsToProb(h.odds)
  const rawA = oddsToProb(a.odds)
  const sum = rawH + rawA
  const pctH = Math.round(rawH / sum * 100)
  const hIsRicher = h.value >= a.value

  return (
    <div className="match-row">
      <div className="match-side home">
        <span className="match-side-flag">{h.flag}</span>
        <div className="match-side-info">
          <span className="match-side-name" style={hIsRicher ? { color: 'var(--accent)', fontWeight: 600 } : {}}>{h.name}</span>
          <span className="match-side-meta">{fmtVal(h.value)} · FIFA #{h.fifa}</span>
        </div>
      </div>
      <div className="match-center">
        <span className="match-vs">VS</span>
        <div className="match-venue">{venue}</div>
        <div className="matchup-bar-section" style={{ marginTop: '6px', width: '100%' }}>
          <div className="matchup-bar-dual" style={{ height: '8px' }}>
            <div className="matchup-bar-a" style={{ width: `${pctH}%` }} />
            <div className="matchup-bar-b" style={{ width: `${100 - pctH}%` }} />
          </div>
          <div className="matchup-bar-labels">
            <span>{pctH}%</span>
            <span>{100 - pctH}%</span>
          </div>
        </div>
      </div>
      <div className="match-side away">
        <span className="match-side-flag">{a.flag}</span>
        <div className="match-side-info">
          <span className="match-side-name" style={!hIsRicher ? { color: 'var(--accent)', fontWeight: 600 } : {}}>{a.name}</span>
          <span className="match-side-meta">{fmtVal(a.value)} · FIFA #{a.fifa}</span>
        </div>
      </div>
    </div>
  )
}

export default function Matches({ fixtures, T, groupNames }) {
  const [query, setQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const n = normalise(query)

  const groupsToShow = groupFilter === 'all' ? groupNames : [groupFilter]

  const sections = groupsToShow.map(g => {
    const gFix = fixtures.filter(f => {
      if (f[0] !== g) return false
      if (!n) return true
      return normalise(f[3]).includes(n) || normalise(f[4]).includes(n)
    })
    return { g, fixtures: gFix }
  }).filter(x => x.fixtures.length > 0)

  const totalShown = sections.reduce((s, x) => s + x.fixtures.length, 0)

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Group Stage Fixtures</div>
        <div className="section-note">
          72 matches · June 11–27, 2026 · Win prob. from BetMGM/FanDuel (June 2026) · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Green</span> = higher squad value
        </div>
      </div>
      <SearchBar id="search-matches" placeholder="Search country…" onSearch={setQuery} />
      <div className="match-group-filters">
        <button className={`mg-btn all${groupFilter === 'all' ? ' active' : ''}`} onClick={() => setGroupFilter('all')}>All</button>
        {groupNames.map(g => (
          <button key={g} className={`mg-btn${groupFilter === g ? ' active' : ''}`} onClick={() => setGroupFilter(g)}>{g}</button>
        ))}
      </div>
      {totalShown === 0 && query && <div className="search-no-results">No matches found.</div>}
      {sections.map(({ g, fixtures: gFix }) => (
        <div key={g} className="match-group-block">
          <div className="match-group-heading">Group {g}</div>
          {[1, 2, 3].map(md => {
            const dayFix = gFix.filter(f => f[1] === md)
            if (!dayFix.length) return null
            return (
              <div key={md}>
                <div className="match-day-label">Matchday {md} · {dayFix[0][2]}</div>
                {dayFix.map((f) => <MatchRow key={`${f[0]}-${f[1]}-${f[3]}-${f[4]}`} fixture={f} T={T} />)}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
