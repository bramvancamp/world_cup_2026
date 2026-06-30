const TABS = [
  { id: 'bracket',   label: '⚽ Bracket' },
  { id: 'predict',   label: '🤖 Predictions' },
  { id: 'standings', label: 'Standings' },
  { id: 'rankings',  label: 'Ranking' },
  { id: 'teams',     label: 'Teams' },
  { id: 'groups',    label: 'Groups' },
  { id: 'matches',   label: 'Matches' },
  { id: 'matchups',  label: 'Gaps' },
]

export default function Tabs({ active, onSelect }) {
  return (
    <div className="tabs" role="navigation" aria-label="Sections">
      {TABS.map(t => (
        <div
          key={t.id}
          role="button"
          tabIndex={0}
          aria-pressed={active === t.id}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => onSelect(t.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect(t.id)
            }
          }}
        >
          {t.label}
        </div>
      ))}
    </div>
  )
}
