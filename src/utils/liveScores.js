const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/FIFA.WORLD/scoreboard'

// Maps ESPN display names (accent-stripped, lowercased) → canonical names used in teams.js
const NAME_MAP = {
  'usa': 'United States',
  'south korea': 'South Korea',
  'republic of korea': 'South Korea',
  'korea republic': 'South Korea',
  "cote d'ivoire": "Côte d'Ivoire",
  'ivory coast': "Côte d'Ivoire",
  'cape verde': 'Cabo Verde',
  'cape verde islands': 'Cabo Verde',
  'dr congo': 'Congo DR',
  'democratic republic of congo': 'Congo DR',
  'bosnia and herzegovina': 'Bosnia & Herz.',
  'bosnia & herzegovina': 'Bosnia & Herz.',
  'curacao': 'Curaçao',
  'turkiye': 'Turkey',
  'ir iran': 'Iran',
}

function norm(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function resolveTeam(espnName) {
  return NAME_MAP[norm(espnName)] || espnName
}

function toDateStr(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

export async function fetchLiveScores() {
  const today = new Date()
  const start = new Date(2026, 5, 11) // June 11, 2026

  const dates = []
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    dates.push(toDateStr(d))
  }

  const results = await Promise.allSettled(
    dates.map(date =>
      fetch(`${ESPN_BASE}?dates=${date}`)
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
    )
  )

  const scores = {}
  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    for (const event of result.value.events || []) {
      const comp = event.competitions?.[0]
      if (!comp) continue

      const homeComp = comp.competitors.find(c => c.homeAway === 'home')
      const awayComp = comp.competitors.find(c => c.homeAway === 'away')
      if (!homeComp || !awayComp) continue

      const homeName = resolveTeam(homeComp.team.displayName)
      const awayName = resolveTeam(awayComp.team.displayName)
      const statusType = comp.status.type

      scores[`${homeName}|${awayName}`] = {
        home: homeComp.score ?? null,
        away: awayComp.score ?? null,
        status: statusType.name,
        detail: statusType.shortDetail,
        live: statusType.name === 'STATUS_IN_PROGRESS',
        final: statusType.name === 'STATUS_FINAL',
      }
    }
  }

  return scores
}
