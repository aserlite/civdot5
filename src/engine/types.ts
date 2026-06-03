export interface Civilization {
  id: string;
  name: string;
  color: string;
  hue: number;
  capitalCellId: number;
  population: number;
  food: number;
  wood: number;
  ore: number;
  lastRevoltTick?: number;
}

export interface Cell {
  id: number;
  x: number;
  y: number;
  polygon: [number, number][];
  elevation: number;
  moisture: number;
  biome: string;
  civId?: string | null;
  neighbors: number[];
}
