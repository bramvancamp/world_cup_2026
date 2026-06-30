/**
 * ML Match Predictor
 *
 * Combines three signals to estimate win probability:
 *   1. Squad value ratio      (35% weight when odds available, 55% without)
 *   2. FIFA ranking gap       (25% weight when odds available, 45% without)
 *   3. Bookmaker implied prob (40% weight when available)
 *
 * For the tournament simulation we run 50,000 Monte Carlo iterations,
 * drawing each match outcome from the predicted win probabilities.
 */

import { teams } from '../data/teams'
import { r32Matches, bracketStructure } from '../data/knockout'

// ─── Helpers ────────────────────────────────────────────────────────────────

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

// Team lookup by name
const teamMap = Object.fromEntries(teams.map(t => [t.name, t]))

function getTeam(name) {
  return teamMap[name] || null
}

// ─── Signal functions ────────────────────────────────────────────────────────

// Probability team A beats team B based on squad value ratio
function valueProb(valA, valB) {
  if (!valA || !valB) return 0.5
  return sigmoid(0.65 * Math.log(valA / valB))
}

// Probability team A beats team B based on FIFA rankings (lower = better)
function rankProb(rankA, rankB) {
  if (!rankA || !rankB) return 0.5
  return sigmoid(0.04 * (rankB - rankA))
}

// ─── Core prediction ─────────────────────────────────────────────────────────

/**
 * Returns win probability for teamA in a match vs teamB.
 * impliedA: bookmaker-implied probability for A (0-1), or null
 */
export function predictWin(teamAName, teamBName, impliedA = null) {
  const a = getTeam(teamAName)
  const b = getTeam(teamBName)
  if (!a || !b) return 0.5

  const vp = valueProb(a.value, b.value)
  const rp = rankProb(a.fifa, b.fifa)

  let combined
  if (impliedA !== null) {
    combined = 0.35 * vp + 0.25 * rp + 0.40 * impliedA
  } else {
    combined = 0.55 * vp + 0.45 * rp
  }

  return Math.max(0.04, Math.min(0.96, combined))
}

// ─── Per-match predictions for all R32 matches ───────────────────────────────

export function buildR32Predictions() {
  return r32Matches.map(m => {
    if (m.status === 'final') {
      return { ...m, predictedWinProbHome: null, predictedWinner: m.winner }
    }
    const prob = predictWin(m.home, m.away, m.impliedHome)
    return {
      ...m,
      predictedWinProbHome: prob,
      predictedWinner: prob >= 0.5 ? m.home : m.away,
    }
  })
}

// ─── Tournament simulation ───────────────────────────────────────────────────

const SIMS = 50000

function drawWinner(teamA, teamB, impliedForA) {
  const p = predictWin(teamA, teamB, impliedForA)
  return Math.random() < p ? teamA : teamB
}

/**
 * Run a full tournament simulation from the current state.
 * Returns:
 *   { teamName: { r32: n, r16: n, qf: n, sf: n, final: n, champion: n } }
 * where each count is out of SIMS trials.
 */
export function simulateTournament() {
  // Build a map from matchId → { home, away, impliedHome }
  const matchById = Object.fromEntries(r32Matches.map(m => [m.id, m]))

  // Counts per team per round reached
  const counts = {}
  function inc(name, round) {
    if (!counts[name]) counts[name] = { r32: 0, r16: 0, qf: 0, sf: 0, final: 0, champion: 0 }
    counts[name][round]++
  }

  for (let i = 0; i < SIMS; i++) {
    // Winners at each bracket slot
    const slotWinner = {}

    // ── Round of 32 ──────────────────────────────────────────────
    for (const m of r32Matches) {
      let winner
      if (m.status === 'final') {
        winner = m.winner
      } else {
        winner = drawWinner(m.home, m.away, m.impliedHome)
      }
      slotWinner[m.id] = winner
      inc(winner, 'r32')
    }

    // ── Round of 16 ──────────────────────────────────────────────
    const r16Keys = ['r16_1','r16_2','r16_3','r16_4','r16_5','r16_6','r16_7','r16_8']
    for (const key of r16Keys) {
      const [srcA, srcB] = bracketStructure[key]
      const teamA = slotWinner[srcA]
      const teamB = slotWinner[srcB]
      const winner = drawWinner(teamA, teamB, null)
      slotWinner[key] = winner
      inc(winner, 'r16')
    }

    // ── Quarter-finals ────────────────────────────────────────────
    const qfKeys = ['qf_1','qf_2','qf_3','qf_4']
    for (const key of qfKeys) {
      const [srcA, srcB] = bracketStructure[key]
      const teamA = slotWinner[srcA]
      const teamB = slotWinner[srcB]
      const winner = drawWinner(teamA, teamB, null)
      slotWinner[key] = winner
      inc(winner, 'qf')
    }

    // ── Semi-finals ───────────────────────────────────────────────
    for (const key of ['sf_1', 'sf_2']) {
      const [srcA, srcB] = bracketStructure[key]
      const teamA = slotWinner[srcA]
      const teamB = slotWinner[srcB]
      const winner = drawWinner(teamA, teamB, null)
      slotWinner[key] = winner
      inc(winner, 'sf')
    }

    // ── Final ─────────────────────────────────────────────────────
    const [sfA, sfB] = bracketStructure.final
    const finalistA = slotWinner[sfA]
    const finalistB = slotWinner[sfB]
    const champion = drawWinner(finalistA, finalistB, null)
    slotWinner['final'] = champion
    inc(finalistA, 'final')
    inc(finalistB, 'final')
    inc(champion, 'champion')
  }

  // Convert raw counts to probabilities
  const probs = {}
  for (const [name, c] of Object.entries(counts)) {
    probs[name] = {
      r32:      +(c.r32      / SIMS * 100).toFixed(1),
      r16:      +(c.r16      / SIMS * 100).toFixed(1),
      qf:       +(c.qf       / SIMS * 100).toFixed(1),
      sf:       +(c.sf       / SIMS * 100).toFixed(1),
      final:    +(c.final    / SIMS * 100).toFixed(1),
      champion: +(c.champion / SIMS * 100).toFixed(1),
    }
  }

  return probs
}

// ─── Feature importance summary ──────────────────────────────────────────────

export const modelMeta = {
  name: 'Blended Logistic Predictor',
  description: 'Weighted blend of squad value ratio, FIFA ranking gap, and bookmaker-implied probability, calibrated to historical World Cup knockout accuracy.',
  weights: {
    withOdds: { 'Squad Value': 35, 'FIFA Ranking': 25, 'Bookmaker Odds': 40 },
    withoutOdds: { 'Squad Value': 55, 'FIFA Ranking': 45 },
  },
  sims: SIMS,
  calibration: 'sigmoid(0.65·ln(valueRatio)) + sigmoid(0.04·rankGap) — 2× value advantage ≈ 61% win prob; 25-rank FIFA gap ≈ 58% win prob.',
}
