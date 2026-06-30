// All group stage final standings + Round of 32 bracket + odds
// Data as of June 30, 2026

// Group stage final standings: [name, pts, w, d, l, gf, ga, qualified]
// qualified: '1st' | '2nd' | '3rd-best' | null
export const groupStandings = {
  A: [
    { name: 'Mexico',       pts: 9, w: 3, d: 0, l: 0, gf: 6, ga: 1, qualified: '1st' },
    { name: 'South Africa', pts: 4, w: 1, d: 1, l: 1, gf: 2, ga: 3, qualified: '2nd' },
    { name: 'South Korea',  pts: 3, w: 1, d: 0, l: 2, gf: 2, ga: 3, qualified: null },
    { name: 'Czechia',      pts: 1, w: 0, d: 1, l: 2, gf: 1, ga: 5, qualified: null },
  ],
  B: [
    { name: 'Switzerland',   pts: 7, w: 2, d: 1, l: 0, gf: 6, ga: 2, qualified: '1st' },
    { name: 'Canada',        pts: 6, w: 2, d: 0, l: 1, gf: 5, ga: 2, qualified: '2nd' },
    { name: 'Bosnia & Herz.', pts: 4, w: 1, d: 1, l: 1, gf: 4, ga: 4, qualified: '3rd-best' },
    { name: 'Qatar',         pts: 0, w: 0, d: 0, l: 3, gf: 1, ga: 8, qualified: null },
  ],
  C: [
    { name: 'Brazil',   pts: 7, w: 2, d: 1, l: 0, gf: 7, ga: 1, qualified: '1st' },
    { name: 'Morocco',  pts: 7, w: 2, d: 1, l: 0, gf: 5, ga: 2, qualified: '2nd' },
    { name: 'Scotland', pts: 3, w: 1, d: 0, l: 2, gf: 3, ga: 6, qualified: null },
    { name: 'Haiti',    pts: 0, w: 0, d: 0, l: 3, gf: 0, ga: 6, qualified: null },
  ],
  D: [
    { name: 'United States', pts: 6, w: 2, d: 0, l: 1, gf: 5, ga: 1, qualified: '1st' },
    { name: 'Australia',     pts: 4, w: 1, d: 1, l: 1, gf: 3, ga: 3, qualified: '2nd' },
    { name: 'Paraguay',      pts: 4, w: 1, d: 1, l: 1, gf: 3, ga: 5, qualified: '3rd-best' },
    { name: 'Turkey',        pts: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, qualified: null },
  ],
  E: [
    { name: 'Germany',       pts: 6, w: 2, d: 0, l: 1, gf: 10, ga: 4, qualified: '1st' },
    { name: "Côte d'Ivoire", pts: 6, w: 2, d: 0, l: 1, gf: 4,  ga: 2, qualified: '2nd' },
    { name: 'Ecuador',       pts: 4, w: 1, d: 1, l: 1, gf: 3,  ga: 5, qualified: '3rd-best' },
    { name: 'Curaçao',       pts: 0, w: 0, d: 0, l: 3, gf: 1,  ga: 7, qualified: null },
  ],
  F: [
    { name: 'Netherlands', pts: 7, w: 2, d: 1, l: 0, gf: 6, ga: 3, qualified: '1st' },
    { name: 'Japan',       pts: 5, w: 1, d: 2, l: 0, gf: 4, ga: 4, qualified: '2nd' },
    { name: 'Sweden',      pts: 4, w: 1, d: 1, l: 1, gf: 4, ga: 5, qualified: '3rd-best' },
    { name: 'Tunisia',     pts: 0, w: 0, d: 0, l: 3, gf: 1, ga: 3, qualified: null },
  ],
  G: [
    { name: 'Belgium',     pts: 7, w: 2, d: 1, l: 0, gf: 5, ga: 1, qualified: '1st' },
    { name: 'Egypt',       pts: 5, w: 1, d: 2, l: 0, gf: 3, ga: 2, qualified: '2nd' },
    { name: 'Iran',        pts: 3, w: 1, d: 0, l: 2, gf: 2, ga: 4, qualified: null },
    { name: 'New Zealand', pts: 1, w: 0, d: 1, l: 2, gf: 1, ga: 4, qualified: null },
  ],
  H: [
    { name: 'Spain',        pts: 7, w: 2, d: 1, l: 0, gf: 5, ga: 2, qualified: '1st' },
    { name: 'Cabo Verde',   pts: 5, w: 1, d: 2, l: 0, gf: 3, ga: 2, qualified: '2nd' },
    { name: 'Uruguay',      pts: 4, w: 1, d: 1, l: 1, gf: 4, ga: 4, qualified: null },
    { name: 'Saudi Arabia', pts: 1, w: 0, d: 1, l: 2, gf: 1, ga: 5, qualified: null },
  ],
  I: [
    { name: 'France',  pts: 9, w: 3, d: 0, l: 0, gf: 8, ga: 0, qualified: '1st' },
    { name: 'Norway',  pts: 4, w: 1, d: 1, l: 1, gf: 5, ga: 4, qualified: '2nd' },
    { name: 'Senegal', pts: 4, w: 1, d: 1, l: 1, gf: 3, ga: 4, qualified: '3rd-best' },
    { name: 'Iraq',    pts: 0, w: 0, d: 0, l: 3, gf: 0, ga: 8, qualified: null },
  ],
  J: [
    { name: 'Argentina', pts: 9, w: 3, d: 0, l: 0, gf: 8, ga: 2, qualified: '1st' },
    { name: 'Austria',   pts: 6, w: 2, d: 0, l: 1, gf: 5, ga: 4, qualified: '2nd' },
    { name: 'Algeria',   pts: 4, w: 1, d: 1, l: 1, gf: 3, ga: 4, qualified: '3rd-best' },
    { name: 'Jordan',    pts: 1, w: 0, d: 1, l: 2, gf: 2, ga: 8, qualified: null },
  ],
  K: [
    { name: 'Colombia', pts: 6, w: 2, d: 0, l: 1, gf: 5, ga: 3, qualified: '1st' },
    { name: 'Portugal', pts: 5, w: 1, d: 2, l: 0, gf: 4, ga: 2, qualified: '2nd' },
    { name: 'Congo DR', pts: 4, w: 1, d: 1, l: 1, gf: 3, ga: 3, qualified: '3rd-best' },
    { name: 'Uzbekistan', pts: 0, w: 0, d: 0, l: 3, gf: 0, ga: 4, qualified: null },
  ],
  L: [
    { name: 'England',  pts: 7, w: 2, d: 1, l: 0, gf: 6, ga: 2, qualified: '1st' },
    { name: 'Croatia',  pts: 4, w: 1, d: 1, l: 1, gf: 4, ga: 4, qualified: '2nd' },
    { name: 'Ghana',    pts: 4, w: 1, d: 1, l: 1, gf: 3, ga: 3, qualified: '3rd-best' },
    { name: 'Panama',   pts: 0, w: 0, d: 0, l: 3, gf: 0, ga: 4, qualified: null },
  ],
}

// Bracket: 4 "quadrants" of 4 R32 matches each
// status: 'final' | 'today' | 'upcoming'
// penHome/penAway: only if match went to shootout
// oddsHome/oddsAway: moneyline (positive/negative integers), null if completed
// impliedHome: normalized win probability from bookmaker odds (0-1)

export const r32Matches = [
  // ── QUADRANT 1: Jun 28-29 (all completed) ──────────────────────────────
  {
    id: 'r32_q1_1', quadrant: 1,
    date: 'Jun 28', venue: 'Los Angeles',
    home: 'Canada',       away: 'South Africa',
    status: 'final',
    homeScore: 1, awayScore: 0,
    winner: 'Canada',
    oddsHome: null, oddsAway: null, impliedHome: null,
    seedHome: 'B2', seedAway: 'A2',
  },
  {
    id: 'r32_q1_2', quadrant: 1,
    date: 'Jun 29', venue: 'Mexico City (Azteca)',
    home: 'Brazil', away: 'Japan',
    status: 'final',
    homeScore: 2, awayScore: 1,
    winner: 'Brazil',
    oddsHome: null, oddsAway: null, impliedHome: null,
    seedHome: 'C1', seedAway: 'F2',
  },
  {
    id: 'r32_q1_3', quadrant: 1,
    date: 'Jun 29', venue: 'Foxborough',
    home: 'Paraguay', away: 'Germany',
    status: 'final',
    homeScore: 1, awayScore: 1,
    penHome: 4, penAway: 3,
    winner: 'Paraguay',
    oddsHome: null, oddsAway: null, impliedHome: null,
    seedHome: 'D3', seedAway: 'E1',
    upset: true,
  },
  {
    id: 'r32_q1_4', quadrant: 1,
    date: 'Jun 29', venue: 'Monterrey',
    home: 'Morocco', away: 'Netherlands',
    status: 'final',
    homeScore: 1, awayScore: 1,
    penHome: 3, penAway: 2,
    winner: 'Morocco',
    oddsHome: null, oddsAway: null, impliedHome: null,
    seedHome: 'C2', seedAway: 'F1',
    upset: true,
  },

  // ── QUADRANT 2: Jun 30 (today) + Jul 1 ─────────────────────────────────
  {
    id: 'r32_q2_1', quadrant: 2,
    date: 'Jun 30', venue: 'Arlington (AT&T)',
    home: "Côte d'Ivoire", away: 'Norway',
    status: 'today',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: 156, oddsAway: -194, impliedHome: 0.372,
    seedHome: 'E2', seedAway: 'I2',
  },
  {
    id: 'r32_q2_2', quadrant: 2,
    date: 'Jun 30', venue: 'East Rutherford (MetLife)',
    home: 'France', away: 'Sweden',
    status: 'today',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -1000, oddsAway: 620, impliedHome: 0.867,
    seedHome: 'I1', seedAway: 'F3',
  },
  {
    id: 'r32_q2_3', quadrant: 2,
    date: 'Jun 30', venue: 'Mexico City (Azteca)',
    home: 'Mexico', away: 'Ecuador',
    status: 'today',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -174, oddsAway: 142, impliedHome: 0.606,
    seedHome: 'A1', seedAway: 'E3',
  },
  {
    id: 'r32_q2_4', quadrant: 2,
    date: 'Jul 1', venue: 'Atlanta (Mercedes-Benz)',
    home: 'England', away: 'Congo DR',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -950, oddsAway: 580, impliedHome: 0.860,
    seedHome: 'L1', seedAway: 'K3',
  },

  // ── QUADRANT 3: Jul 1-2 ─────────────────────────────────────────────────
  {
    id: 'r32_q3_1', quadrant: 3,
    date: 'Jul 1', venue: 'Seattle (Lumen Field)',
    home: 'Belgium', away: 'Senegal',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -172, oddsAway: 140, impliedHome: 0.602,
    seedHome: 'G1', seedAway: 'I3',
  },
  {
    id: 'r32_q3_2', quadrant: 3,
    date: 'Jul 1', venue: 'Santa Clara (Levi\'s)',
    home: 'United States', away: 'Bosnia & Herz.',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -750, oddsAway: 510, impliedHome: 0.843,
    seedHome: 'D1', seedAway: 'B3',
  },
  {
    id: 'r32_q3_3', quadrant: 3,
    date: 'Jul 2', venue: 'Los Angeles (SoFi)',
    home: 'Spain', away: 'Austria',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -1200, oddsAway: 690, impliedHome: 0.879,
    seedHome: 'H1', seedAway: 'J2',
  },
  {
    id: 'r32_q3_4', quadrant: 3,
    date: 'Jul 2', venue: 'Toronto (BMO Field)',
    home: 'Portugal', away: 'Croatia',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -290, oddsAway: 220, impliedHome: 0.704,
    seedHome: 'K2', seedAway: 'L2',
  },

  // ── QUADRANT 4: Jul 2-3 ─────────────────────────────────────────────────
  {
    id: 'r32_q4_1', quadrant: 4,
    date: 'Jul 2', venue: 'Vancouver (BC Place)',
    home: 'Switzerland', away: 'Algeria',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -198, oddsAway: 162, impliedHome: 0.635,
    seedHome: 'B1', seedAway: 'J3',
  },
  {
    id: 'r32_q4_2', quadrant: 4,
    date: 'Jul 3', venue: 'Dallas (AT&T)',
    home: 'Egypt', away: 'Australia',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -140, oddsAway: 114, impliedHome: 0.555,
    seedHome: 'G2', seedAway: 'D2',
  },
  {
    id: 'r32_q4_3', quadrant: 4,
    date: 'Jul 3', venue: 'Miami (Hard Rock)',
    home: 'Argentina', away: 'Cabo Verde',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -2500, oddsAway: 1280, impliedHome: 0.930,
    seedHome: 'J1', seedAway: 'H2',
  },
  {
    id: 'r32_q4_4', quadrant: 4,
    date: 'Jul 3', venue: 'Kansas City (Arrowhead)',
    home: 'Colombia', away: 'Ghana',
    status: 'upcoming',
    homeScore: null, awayScore: null, winner: null,
    oddsHome: -480, oddsAway: 350, impliedHome: 0.788,
    seedHome: 'K1', seedAway: 'L3',
  },
]

// Bracket path: which R32 pairs feed into each R16 match
// Q1: r32_q1_1+2 → r16_1, r32_q1_3+4 → r16_2
// Q2: r32_q2_1+2 → r16_3, r32_q2_3+4 → r16_4
// Q3: r32_q3_1+2 → r16_5, r32_q3_3+4 → r16_6
// Q4: r32_q4_1+2 → r16_7, r32_q4_3+4 → r16_8
// R16: r16_1+2 → qf_1, r16_3+4 → qf_2, r16_5+6 → qf_3, r16_7+8 → qf_4
// SF: qf_1+2 → sf_1, qf_3+4 → sf_2
// Final: sf_1+2

export const bracketStructure = {
  r16_1: ['r32_q1_1', 'r32_q1_2'],
  r16_2: ['r32_q1_3', 'r32_q1_4'],
  r16_3: ['r32_q2_1', 'r32_q2_2'],
  r16_4: ['r32_q2_3', 'r32_q2_4'],
  r16_5: ['r32_q3_1', 'r32_q3_2'],
  r16_6: ['r32_q3_3', 'r32_q3_4'],
  r16_7: ['r32_q4_1', 'r32_q4_2'],
  r16_8: ['r32_q4_3', 'r32_q4_4'],
  qf_1:  ['r16_1', 'r16_2'],
  qf_2:  ['r16_3', 'r16_4'],
  qf_3:  ['r16_5', 'r16_6'],
  qf_4:  ['r16_7', 'r16_8'],
  sf_1:  ['qf_1', 'qf_2'],
  sf_2:  ['qf_3', 'qf_4'],
  final: ['sf_1', 'sf_2'],
}

// Round schedule
export const roundDates = {
  r32:   'Jun 28 – Jul 3',
  r16:   'Jul 4–7',
  qf:    'Jul 10–11',
  sf:    'Jul 14–15',
  third: 'Jul 18',
  final: 'Jul 19',
}

// DraftKings tournament winner moneyline odds (as of Jun 30)
export const championOdds = {
  'France':        340,
  'Argentina':     400,
  'Spain':         600,
  'Brazil':        900,
  'England':      1200,
  'Portugal':     1600,
  'Morocco':      2200,
  'United States': 2500,
  'Colombia':     3000,
  'Belgium':      3200,
  'Norway':       3500,
  'Mexico':       4000,
  'Paraguay':     5000,
  'Canada':       6000,
  'Switzerland':  7000,
  "Côte d'Ivoire": 8000,
  'Egypt':        9000,
  'Australia':   10000,
  'Algeria':     12000,
  'Austria':     15000,
  'Sweden':      15000,
  'Ghana':       18000,
  'Senegal':     20000,
  'Cabo Verde':  50000,
  'Bosnia & Herz.': 50000,
  'Congo DR':    50000,
  'Ecuador':     50000,
}
