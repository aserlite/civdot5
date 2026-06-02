import { create } from 'zustand';
import type { Cell, Civilization } from '../engine/types';
import { simulateTick } from '../engine/simulation';

interface GameState {
  cells: Cell[];
  civs: Civilization[];
  hoveredCellId: number | null;
  selectedCellId: number | null;
  isPlaying: boolean;
  gameSpeed: number;
  setCells: (cells: Cell[]) => void;
  setHoveredCellId: (id: number | null) => void;
  setSelectedCellId: (id: number | null) => void;
  initGame: (cells: Cell[], civs: Civilization[]) => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  runTick: () => void;
  showDebug: boolean;
  toggleDebug: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  cells: [],
  civs: [],
  hoveredCellId: null,
  selectedCellId: null,
  isPlaying: false,
  gameSpeed: 1,
  showDebug: true,
  setCells: (cells) => set({ cells }),
  setHoveredCellId: (id) => set({ hoveredCellId: id }),
  setSelectedCellId: (id) => set({ selectedCellId: id }),
  initGame: (cells, civs) => set({ cells, civs }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ gameSpeed: speed }),
  runTick: () => {
    const { cells, civs } = get();
    const { updatedCells, updatedCivs } = simulateTick(cells, civs);
    set({ cells: updatedCells, civs: updatedCivs });
  },
  toggleDebug: () => set((state) => ({ showDebug: !state.showDebug }))
}));
