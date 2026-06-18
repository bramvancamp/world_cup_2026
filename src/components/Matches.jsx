import { useState, useRef } from 'react'
import { fmtVal, normalise } from '../utils'
import SearchBar from './SearchBar'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const _d = new Date()
const TODAY = `${MONTHS[_d.getMonth()]} ${_d.getDate()}`

function oddsToProb(odds) {
  if (!odds) return 50
  const n = parseInt(odds, 10)
  if (isNaN(n)) return 50
  return n > 0 ? (100 / (n + 100)) * 100 : ((-n) / (-n + 100)) * 100
}

function formatDateLabel(dateStr) {
  const day = parseInt(dateStr.split(' ')[1])
  const d = new Date(2026, 5, day)
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
  return `${weekday} · ${dateStr}`
}

function MatchRow({ fixture, T }) {
  const [group, , , homeName, awayName, venue] = fixture
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
        <span className="match-group-pill">Group {group}</span>
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
  const todayRef = useRef(null)
  const n = normalise(query)

  const todayExists = fixtures.some(f => f[2] === TODAY)

  const filtered = fixtures.filter(f => {
    if (groupFilter !== 'all' && f[0] !== groupFilter) return false
    if (!n) return true
    return normalise(f[3]).includes(n) || normalise(f[4]).includes(n)
  })

  // Group by date, sorted chronologically
  const dateMap = new Map()
  for (const f of filtered) {
    if (!dateMap.has(f[2])) dateMap.set(f[2], [])
    dateMap.get(f[2]).push(f)
  }
  const sections = [...dateMap.entries()]
    .sort((a, b) => parseInt(a[0].split(' ')[1]) - parseInt(b[0].split(' ')[1]))

  function goToToday() {
    setGroupFilter('all')
    setTimeout(() => {
      todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Group Stage Fixtures</div>
        <div className="section-note">
          72 matches · June 11–27, 2026 · Win prob. from BetMGM/FanDuel (June 2026) · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Green</span> = higher squad value
        </div>
      </div>
      {todayExists && (
        <button className="match-today-btn" onClick={goToToday}>
          ▶ Today · {TODAY}
        </button>
      )}
      <SearchBar id="search-matches" placeholder="Search country…" onSearch={setQuery} />
      <div className="match-group-filters">
        <button className={`mg-btn all${groupFilter === 'all' ? ' active' : ''}`} onClick={() => setGroupFilter('all')}>All</button>
        {groupNames.map(g => (
          <button key={g} className={`mg-btn${groupFilter === g ? ' active' : ''}`} onClick={() => setGroupFilter(g)}>{g}</button>
        ))}
      </div>
      {filtered.length === 0 && query && <div className="search-no-results">No matches found.</div>}
      {sections.map(([date, dayFix]) => (
        <div
          key={date}
          className={`match-date-block${date === TODAY ? ' is-today' : ''}`}
          ref={date === TODAY ? todayRef : null}
        >
          <div className="match-date-heading">
            {formatDateLabel(date)}
            {date === TODAY && <span className="match-today-badge">Today</span>}
          </div>
          {dayFix.map(f => (
            <MatchRow key={`${f[0]}-${f[1]}-${f[3]}-${f[4]}`} fixture={f} T={T} />
          ))}
        </div>
      ))}
    </div>
  )
}
