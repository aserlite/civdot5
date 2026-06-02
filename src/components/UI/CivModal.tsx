import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';

export default function CivModal() {
  const cells = useGameStore(state => state.cells);
  const civs = useGameStore(state => state.civs);
  const selectedCellId = useGameStore(state => state.selectedCellId);
  const setSelectedCellId = useGameStore(state => state.setSelectedCellId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCellId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedCellId]);

  if (selectedCellId === null) return null;

  const cell = cells.find(c => c.id === selectedCellId);
  if (!cell || !cell.civId) return null;

  const civ = civs.find(c => c.id === cell.civId);
  if (!civ) return null;

  return (
    <div 
      className="fixed left-6 bottom-6 w-80 bg-slate-900/95 text-white p-6 rounded-2xl border-2 shadow-2xl backdrop-blur-md transition-all duration-300"
      style={{ borderColor: civ.color }}
    >
      <button 
        onClick={() => setSelectedCellId(null)}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <h2 className="text-2xl font-bold mb-1" style={{ color: civ.color }}>
        {civ.name}
      </h2>
      <p className="text-slate-400 text-sm mb-6 border-b border-slate-700 pb-4">
        Territoire : {cell.biome}
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <span className="text-slate-300">Population</span>
          <span className="font-bold text-white">{civ.population}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <span className="text-slate-300">Bois</span>
          <span className="font-bold text-amber-500">{civ.wood}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <span className="text-slate-300">Nourriture</span>
          <span className="font-bold text-emerald-400">{civ.food}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <span className="text-slate-300">Minerai</span>
          <span className="font-bold text-slate-300">{civ.ore}</span>
        </div>
      </div>
    </div>
  );
}
