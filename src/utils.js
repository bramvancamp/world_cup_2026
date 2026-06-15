export function fmtVal(v) {
  if (v >= 1000) return `€${(v / 1000).toFixed(2)}B`
  return `€${v.toFixed(0)}M`
}

export function normalise(s) {
  return s.toLowerCase().trim()
}
