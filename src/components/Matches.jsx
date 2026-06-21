import { useState, useRef } from 'react'
import { fmtVal, normalise } from '../utils'
import { fetchLiveScores } from '../utils/liveScores'
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

function MatchRow({ fixture, T, liveScores }) {
  const [group, , , homeName, awayName, venue] = fixture
  const h = T(homeName)
  const a = T(awayName)
  if (!h || !a) return null

  const rawH = oddsToProb(h.odds)
  const rawA = oddsToProb(a.odds)
  const sum = rawH + rawA
  const pctH = Math.round(rawH / sum * 100)
  const hIsRicher = h.value >= a.value
  const score = liveScores?.[`${h.name}|${a.name}`]
  const hasScore = score?.final || score?.live

  return (
    <div className={`match-row${score?.live ? ' match-row--live' : ''}`}>
      <div className="match-side home">
        <span className="match-side-flag">{h.flag}</span>
        <div className="match-side-info">
          <span className="match-side-name" style={hIsRicher ? { color: 'var(--accent)', fontWeight: 600 } : {}}>{h.name}</span>
          <span className="match-side-meta">{fmtVal(h.value)} · FIFA #{h.fifa}</span>
        </div>
      </div>
      <div className="match-center">
        {hasScore ? (
          <div className="match-score">
            <span className="match-score-nums">{score.home}<span className="score-dash"> – </span>{score.away}</span>
            {score.live && <span className="match-status-badge live"><span className="live-dot">●</span>{score.detail}</span>}
            {score.final && <span className="match-status-badge ft">FT</span>}
          </div>
        ) : (
          <span className="match-vs">VS</span>
        )}
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
  const [liveScores, setLiveScores] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const todayRef = useRef(null)
  const n = normalise(query)

  const todayExists = fixtures.some(f => f[2] === TODAY)

  async function handleRefresh() {
    setRefreshing(true)
    setFetchError(null)
    try {
      const scores = await fetchLiveScores()
      setLiveScores(scores)
      setLastRefresh(new Date())
    } catch {
      setFetchError('Could not load scores. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  const filtered = fixtures.filter(f => {
    if (!n) return true
    return normalise(f[3]).includes(n) || normalise(f[4]).includes(n)
  })

  const dateMap = new Map()
  for (const f of filtered) {
    if (!dateMap.has(f[2])) dateMap.set(f[2], [])
    dateMap.get(f[2]).push(f)
  }
  const sections = [...dateMap.entries()]
    .sort((a, b) => parseInt(a[0].split(' ')[1]) - parseInt(b[0].split(' ')[1]))

  function goToToday() {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const liveCount = Object.values(liveScores).filter(s => s.live).length
  const finalCount = Object.values(liveScores).filter(s => s.final).length

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Group Stage Fixtures</div>
          <div className="section-note">
            72 matches · June 11–27, 2026 · Win prob. from BetMGM/FanDuel · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Green</span> = higher squad value
          </div>
        </div>
        <div className="refresh-controls">
          <button
            className={`refresh-btn${refreshing ? ' refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <span className="refresh-icon">↻</span>
            {refreshing ? 'Loading…' : 'Live Scores'}
          </button>
          {lastRefresh && !fetchError && (
            <div className="refresh-meta">
              {liveCount > 0 && <span className="refresh-live-pill"><span className="live-dot">●</span>{liveCount} live</span>}
              {finalCount > 0 && <span className="refresh-final-pill">{finalCount} finished</span>}
              <span className="refresh-time">{lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
          {fetchError && <div className="refresh-error">{fetchError}</div>}
        </div>
      </div>
      {todayExists && (
        <button className="match-today-btn" onClick={goToToday}>
          ▶ Today · {TODAY}
        </button>
      )}
      <SearchBar id="search-matches" placeholder="Search country…" onSearch={setQuery} />
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
            <MatchRow key={`${f[0]}-${f[1]}-${f[3]}-${f[4]}`} fixture={f} T={T} liveScores={liveScores} />
          ))}
        </div>
      ))}
    </div>
  )
}
