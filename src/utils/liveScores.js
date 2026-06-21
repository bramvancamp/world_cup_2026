// Slugs to try in order — ESPN sometimes uses year-specific identifiers for major tournaments
const SLUGS = ['FIFA.WORLD', 'FIFA.WORLD.2026', 'FIFA.WORLDCUP.2026']
const ESPN_BASE = slug => `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard`

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

async function fetchEventsForSlug(slug, dates) {
  const results = await Promise.allSettled(
    dates.map(date =>
      fetch(`${ESPN_BASE(slug)}?dates=${date}`)
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
    )
  )

  const succeeded = results.filter(r => r.status === 'fulfilled')
  if (succeeded.length === 0) {
    const reason = results[0]?.reason?.message || 'Request failed'
    throw new Error(reason)
  }

  const events = []
  for (const r of succeeded) {
    events.push(...(r.value.events || []))
  }
  return events
}

function parseScores(events) {
  const scores = {}
  for (const event of events) {
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
  return scores
}

export async function fetchLiveScores() {
  const today = new Date()
  const start = new Date(2026, 5, 11)

  const dates = []
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    dates.push(toDateStr(d))
  }

  let lastError = null

  for (const slug of SLUGS) {
    try {
      const events = await fetchEventsForSlug(slug, dates)
      if (events.length > 0) {
        return parseScores(events)
      }
      // Slug worked but returned no events — try next slug
    } catch (e) {
      lastError = e
    }
  }

  // All slugs either failed or returned zero events
  throw new Error(
    lastError
      ? `Scores unavailable: ${lastError.message}`
      : 'No World Cup matches found via ESPN. The competition may not be available yet.'
  )
}
