const TABS = [
  { id: 'rankings', label: 'Ranking' },
  { id: 'teams',    label: 'Teams' },
  { id: 'groups',   label: 'Groups' },
  { id: 'matches',  label: 'Matches' },
  { id: 'matchups', label: 'Gaps' },
]

export default function Tabs({ active, onSelect }) {
  return (
    <div className="tabs">
      {TABS.map(t => (
        <div
          key={t.id}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </div>
      ))}
    </div>
  )
}
