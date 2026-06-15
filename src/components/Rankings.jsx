import { useState } from 'react'
import { confColors } from '../data/teams'
import { fmtVal, normalise } from '../utils'
import SearchBar from './SearchBar'

export default function Rankings({ sorted, onTeamLink }) {
  const [query, setQuery] = useState('')
  const maxVal = sorted[0].value
  const n = normalise(query)
  const visible = sorted.filter(t => !n || normalise(t.name).includes(n))

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Squad Value Ranking</div>
        <div className="section-note">Source: Transfermarkt, June 2026</div>
      </div>
      <SearchBar id="search-rankings" placeholder="Search country…" onSearch={setQuery} />
      {visible.length === 0 && query && (
        <div className="search-no-results">No countries match your search.</div>
      )}
      <table className="rank-table" id="ranking-table">
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Country</th>
            <th className="col-conf">Conf</th>
            <th>Group</th>
            <th className="col-fifa">FIFA</th>
            <th className="rank-bar-cell">Relative</th>
            <th style={{ textAlign: 'right' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(t => {
            const rank = sorted.indexOf(t)
            const pct = (t.value / maxVal * 100).toFixed(1)
            const rowClass = rank < 3 ? 'top3' : rank >= 43 ? 'bottom5' : ''
            const confColor = confColors[t.conf] || '#64748b'
            return (
              <tr key={t.name} className={rowClass}>
                <td className="rank-num">{rank + 1}</td>
                <td className="rank-flag">{t.flag}</td>
                <td className="rank-country team-link" onClick={() => onTeamLink(t.name)}>{t.name}</td>
                <td className="rank-conf">
                  <span style={{ color: confColor, fontSize: '10px', fontWeight: 600, letterSpacing: '1px' }}>{t.conf}</span>
                </td>
                <td><span className="rank-group">{t.group}</span></td>
                <td className="col-fifa"><span className="fifa-rank">#{t.fifa}</span></td>
                <td className="rank-bar-cell">
                  <div className="rank-bar-wrap">
                    <div className="rank-bar-bg">
                      <div className="rank-bar-fill" style={{ width: `${pct}%`, background: confColor }} />
                    </div>
                  </div>
                </td>
                <td className="rank-val">{fmtVal(t.value)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
