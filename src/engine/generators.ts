const PREFIXES = ['Al', 'Bor', 'Carth', 'Drak', 'Elen', 'Fen', 'Gor', 'Hel', 'Ith', 'Kael', 'Lor', 'Mor', 'Nyr', 'Oma', 'Pyr', 'Qor', 'Rath', 'Syl', 'Thar', 'Urx', 'Val', 'Zor'];
const SUFFIXES = ['a', 'ia', 'or', 'us', 'os', 'dor', 'nath', 'thal', 'rion', 'lis', 'mar', 'gard'];

export function generateCivColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

export function generateCivName(): string {
  const pre = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suf = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const mid = Math.random() > 0.7 ? ['a', 'e', 'i', 'o', 'u'][Math.floor(Math.random() * 5)] : '';
  return pre + mid + suf;
}
