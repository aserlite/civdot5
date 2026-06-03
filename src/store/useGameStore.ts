import { create } from 'zustand';
import type { Cell, Civilization } from '../engine/types';
import { simulateTick } from '../engine/simulation';

export interface GameEvent {
  id: string;
  message: string;
  type: 'info' | 'war' | 'rebellion' | 'death';
  timestamp: number;
}

interface GameState {
  cells: Cell[];
  civs: Civilization[];
  hoveredCellId: number | null;
  selectedCellId: number | null;
  isPlaying: boolean;
  gameSpeed: number;
  year: number;
  mapMode: 'political' | 'biome';
  notifications: GameEvent[];
  isLeaderboardOpen: boolean;
  showNotifications: boolean;
  setCells: (cells: Cell[]) => void;
  setHoveredCellId: (id: number | null) => void;
  setSelectedCellId: (id: number | null) => void;
  initGame: (cells: Cell[], civs: Civilization[]) => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  setMapMode: (mode: 'political' | 'biome') => void;
  runTick: () => void;
  showDebug: boolean;
  toggleDebug: () => void;
  toggleNotifications: () => void;
  setLeaderboardOpen: (isOpen: boolean) => void;
  addNotifications: (events: {message: string, type: string}[]) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  cells: [],
  civs: [],
  hoveredCellId: null,
  selectedCellId: null,
  isPlaying: false,
  gameSpeed: 1,
  year: 1,
  mapMode: 'political',
  showDebug: false,
  showNotifications: true,
  notifications: [],
  isLeaderboardOpen: false,
  setCells: (cells) => set({ cells }),
  setHoveredCellId: (id) => set({ hoveredCellId: id }),
  setSelectedCellId: (id) => set({ selectedCellId: id }),
  initGame: (cells, civs) => set({ cells, civs }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ gameSpeed: speed }),
  setMapMode: (mode) => set({ mapMode: mode }),
  runTick: () => {
    const { cells, civs, year, addNotifications } = get();
    const { updatedCells, updatedCivs, events } = simulateTick(cells, civs, year);
    
    if (events.length > 0) {
      addNotifications(events);
    }
    
    set({ cells: updatedCells, civs: updatedCivs, year: year + 1 });
  },
  toggleDebug: () => set((state) => ({ showDebug: !state.showDebug })),
  toggleNotifications: () => set((state) => ({ showNotifications: !state.showNotifications })),
  setLeaderboardOpen: (isOpen) => set({ isLeaderboardOpen: isOpen }),
  addNotifications: (events) => set((state) => {
    const newEvents: GameEvent[] = events.map((e, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`,
      message: e.message,
      type: e.type as GameEvent['type'],
      timestamp: Date.now()
    }));
    return {
      notifications: [...state.notifications, ...newEvents].slice(-5)
    };
  })
}));
