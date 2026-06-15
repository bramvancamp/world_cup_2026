export const teams = [
  // Group A
  { name: 'Mexico',         flag: '🇲🇽', conf: 'CONCACAF', group: 'A', value: 194.6,  fifa: 14, odds: '+1900' },
  { name: 'South Korea',    flag: '🇰🇷', conf: 'AFC',      group: 'A', value: 142.3,  fifa: 25, odds: '+15000' },
  { name: 'Czechia',        flag: '🇨🇿', conf: 'UEFA',     group: 'A', value: 190.18, fifa: 39, odds: '+12000' },
  { name: 'South Africa',   flag: '🇿🇦', conf: 'CAF',      group: 'A', value: 45.8,   fifa: 60, odds: '+50000' },
  // Group B
  { name: 'Canada',         flag: '🇨🇦', conf: 'CONCACAF', group: 'B', value: 203.05, fifa: 30, odds: '+15000' },
  { name: 'Switzerland',    flag: '🇨🇭', conf: 'UEFA',     group: 'B', value: 333.6,  fifa: 19, odds: '+2500' },
  { name: 'Qatar',          flag: '🇶🇦', conf: 'AFC',      group: 'B', value: 19.93,  fifa: 57, odds: '+50000' },
  { name: 'Bosnia & Herz.', flag: '🇧🇦', conf: 'UEFA',     group: 'B', value: 149.2,  fifa: 64, odds: '+30000' },
  // Group C
  { name: 'Brazil',         flag: '🇧🇷', conf: 'CONMEBOL', group: 'C', value: 912.2,  fifa: 6,  odds: '+1000' },
  { name: 'Morocco',        flag: '🇲🇦', conf: 'CAF',      group: 'C', value: 488.2,  fifa: 7,  odds: '+2700' },
  { name: 'Haiti',          flag: '🇭🇹', conf: 'CONCACAF', group: 'C', value: 28.5,   fifa: 83, odds: '+100000' },
  { name: 'Scotland',       flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', conf: 'UEFA',     group: 'C', value: 215.4,  fifa: 42, odds: '+15000' },
  // Group D
  { name: 'United States',  flag: '🇺🇸', conf: 'CONCACAF', group: 'D', value: 414.2,  fifa: 17, odds: '+1700' },
  { name: 'Paraguay',       flag: '🇵🇾', conf: 'CONMEBOL', group: 'D', value: 157.15, fifa: 40, odds: '+20000' },
  { name: 'Australia',      flag: '🇦🇺', conf: 'AFC',      group: 'D', value: 76.5,   fifa: 27, odds: '+25000' },
  { name: 'Turkey',         flag: '🇹🇷', conf: 'UEFA',     group: 'D', value: 494.2,  fifa: 22, odds: '+5000' },
  // Group E
  { name: 'Germany',        flag: '🇩🇪', conf: 'UEFA',     group: 'E', value: 998.0,  fifa: 10, odds: '+1300' },
  { name: 'Curaçao',        flag: '🇨🇼', conf: 'CONCACAF', group: 'E', value: 26.5,   fifa: 82, odds: '+100000' },
  { name: "Côte d'Ivoire",  flag: '🇨🇮', conf: 'CAF',      group: 'E', value: 530.9,  fifa: 33, odds: '+8000' },
  { name: 'Ecuador',        flag: '🇪🇨', conf: 'CONMEBOL', group: 'E', value: 376.2,  fifa: 23, odds: '+3000' },
  // Group F
  { name: 'Netherlands',    flag: '🇳🇱', conf: 'UEFA',     group: 'F', value: 837.2,  fifa: 8,  odds: '+1900' },
  { name: 'Japan',          flag: '🇯🇵', conf: 'AFC',      group: 'F', value: 310.5,  fifa: 18, odds: '+3000' },
  { name: 'Sweden',         flag: '🇸🇪', conf: 'UEFA',     group: 'F', value: 427.3,  fifa: 38, odds: '+8000' },
  { name: 'Tunisia',        flag: '🇹🇳', conf: 'CAF',      group: 'F', value: 82.4,   fifa: 46, odds: '+30000' },
  // Group G
  { name: 'Belgium',        flag: '🇧🇪', conf: 'UEFA',     group: 'G', value: 542.9,  fifa: 9,  odds: '+3300' },
  { name: 'Egypt',          flag: '🇪🇬', conf: 'CAF',      group: 'G', value: 85.6,   fifa: 29, odds: '+12000' },
  { name: 'Iran',           flag: '🇮🇷', conf: 'AFC',      group: 'G', value: 35.5,   fifa: 21, odds: '+15000' },
  { name: 'New Zealand',    flag: '🇳🇿', conf: 'OFC',      group: 'G', value: 48.2,   fifa: 85, odds: '+50000' },
  // Group H
  { name: 'Spain',          flag: '🇪🇸', conf: 'UEFA',     group: 'H', value: 1260.0, fifa: 2,  odds: '+450' },
  { name: 'Cabo Verde',     flag: '🇨🇻', conf: 'CAF',      group: 'H', value: 57.3,   fifa: 67, odds: '+100000' },
  { name: 'Saudi Arabia',   flag: '🇸🇦', conf: 'AFC',      group: 'H', value: 62.8,   fifa: 61, odds: '+50000' },
  { name: 'Uruguay',        flag: '🇺🇾', conf: 'CONMEBOL', group: 'H', value: 405.8,  fifa: 16, odds: '+2200' },
  // Group I
  { name: 'France',         flag: '🇫🇷', conf: 'UEFA',     group: 'I', value: 1530.0, fifa: 3,  odds: '+450' },
  { name: 'Senegal',        flag: '🇸🇳', conf: 'CAF',      group: 'I', value: 472.9,  fifa: 15, odds: '+4000' },
  { name: 'Iraq',           flag: '🇮🇶', conf: 'AFC',      group: 'I', value: 22.8,   fifa: 56, odds: '+80000' },
  { name: 'Norway',         flag: '🇳🇴', conf: 'UEFA',     group: 'I', value: 601.0,  fifa: 31, odds: '+1400' },
  // Group J
  { name: 'Argentina',      flag: '🇦🇷', conf: 'CONMEBOL', group: 'J', value: 818.5,  fifa: 1,  odds: '+950' },
  { name: 'Algeria',        flag: '🇩🇿', conf: 'CAF',      group: 'J', value: 257.6,  fifa: 28, odds: '+10000' },
  { name: 'Austria',        flag: '🇦🇹', conf: 'UEFA',     group: 'J', value: 388.9,  fifa: 24, odds: '+8000' },
  { name: 'Jordan',         flag: '🇯🇴', conf: 'AFC',      group: 'J', value: 19.83,  fifa: 63, odds: '+100000' },
  // Group K
  { name: 'Portugal',       flag: '🇵🇹', conf: 'UEFA',     group: 'K', value: 1020.0, fifa: 5,  odds: '+750' },
  { name: 'Congo DR',       flag: '🇨🇩', conf: 'CAF',      group: 'K', value: 118.4,  fifa: 45, odds: '+25000' },
  { name: 'Uzbekistan',     flag: '🇺🇿', conf: 'AFC',      group: 'K', value: 56.7,   fifa: 50, odds: '+50000' },
  { name: 'Colombia',       flag: '🇨🇴', conf: 'CONMEBOL', group: 'K', value: 357.2,  fifa: 13, odds: '+1600' },
  // Group L
  { name: 'England',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf: 'UEFA',     group: 'L', value: 1310.0, fifa: 4,  odds: '+700' },
  { name: 'Croatia',        flag: '🇭🇷', conf: 'UEFA',     group: 'L', value: 385.7,  fifa: 11, odds: '+2700' },
  { name: 'Ghana',          flag: '🇬🇭', conf: 'CAF',      group: 'L', value: 230.88, fifa: 73, odds: '+25000' },
  { name: 'Panama',         flag: '🇵🇦', conf: 'CONCACAF', group: 'L', value: 34.83,  fifa: 34, odds: '+50000' },
]

export const groupNames = ['A','B','C','D','E','F','G','H','I','J','K','L']

export const confColors = {
  'UEFA':     '#3b82f6',
  'CONMEBOL': '#10b981',
  'CONCACAF': '#f59e0b',
  'CAF':      '#ef4444',
  'AFC':      '#8b5cf6',
  'OFC':      '#ec4899',
}
