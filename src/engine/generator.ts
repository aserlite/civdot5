import { createNoise2D } from 'simplex-noise';
import { generateVoronoi } from './voronoi';
import type { Cell } from './types';

export function generateCells(width: number, height: number, count: number): Cell[] {
  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    points.push([Math.random() * width, Math.random() * height]);
  }

  const voronoi = generateVoronoi(points, width, height);
  const noise2D_mask = createNoise2D();
  const noise2D_elev = createNoise2D();
  const noise2D_moist = createNoise2D();

  const cells: Cell[] = [];
  const cx = width / 2;
  const cy = height / 2;

  for (let i = 0; i < count; i++) {
    const polygon = voronoi.cellPolygon(i);
    if (!polygon) continue;

    const [x, y] = points[i];
    const dx = Math.abs(x - cx) / cx;
    const dy = Math.abs(y - cy) / cy;
    const baseD = Math.max(dx, dy);

    let elevation: number;
    let moisture = 0;
    let biome: string;

    const limit = 0.96;
    if (baseD > limit) {
      elevation = 0;
      biome = 'OCEAN';
    } else {
      const noiseFactor = 0.4 * (1 - baseD / limit);
      const d = baseD + noise2D_mask(x / 400, y / 400) * noiseFactor;

      elevation = (noise2D_elev(x / 300, y / 300) + 1) / 2;
      moisture = (noise2D_moist(x / 300, y / 300) + 1) / 2;

      if (d > 0.9 || elevation < 0.15) {
        elevation = 0;
        biome = 'OCEAN';
      } else {
        if (elevation > 0.8) {
          biome = 'MOUNTAIN';
        } else {
          if (moisture > 0.5) {
            biome = 'FOREST';
          } else {
            biome = 'PLAIN';
          }
        }
      }
    }

    cells.push({
      id: i,
      x,
      y,
      polygon: Array.from(polygon) as [number, number][],
      elevation,
      moisture,
      biome,
      neighbors: []
    });
  }

  const cellsMap = new Map<number, Cell>();
  cells.forEach(c => cellsMap.set(c.id, c));

  cells.forEach(c => {
    c.neighbors = Array.from(voronoi.neighbors(c.id)).filter(nId => cellsMap.has(nId));
  });

  cells.forEach(c => {
    if (c.biome !== 'OCEAN') {
      const hasOceanNeighbor = c.neighbors.some(nId => cellsMap.get(nId)?.biome === 'OCEAN');
      if (hasOceanNeighbor) {
        c.biome = 'BEACH';
      }
    }
  });

  return cells;
}
