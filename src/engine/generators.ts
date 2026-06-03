const PREFIXES = ['Al', 'Bor', 'Carth', 'Drak', 'Elen', 'Fen', 'Gor', 'Hel', 'Ith', 'Kael', 'Lor', 'Mor', 'Nyr', 'Oma', 'Pyr', 'Qor', 'Rath', 'Syl', 'Thar', 'Urx', 'Val', 'Zor'];
const SUFFIXES = ['a', 'ia', 'or', 'us', 'os', 'dor', 'nath', 'thal', 'rion', 'lis', 'mar', 'gard'];

export function generateCivColor(existingHues: number[] = []): { color: string, hue: number } {
  let hue = 0;
  for (let i = 0; i < 50; i++) {
    const rand = Math.random();
    if (rand < 70 / 210) {
      hue = Math.floor(Math.random() * 70); 
    } else if (rand < 100 / 210) {
      hue = 160 + Math.floor(Math.random() * 30);
    } else {
      hue = 250 + Math.floor(Math.random() * 110);
    }

    let tooClose = false;
    for (const existing of existingHues) {
      const dist = Math.min(Math.abs(hue - existing), 360 - Math.abs(hue - existing));
      if (dist < 30) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      return { color: `hsl(${hue}, 70%, 60%)`, hue };
    }
  }

  return { color: `hsl(${hue}, 70%, 60%)`, hue };
}

export function generateCivName(): string {
  const pre = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suf = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const mid = Math.random() > 0.7 ? ['a', 'e', 'i', 'o', 'u'][Math.floor(Math.random() * 5)] : '';
  return pre + mid + suf;
}
