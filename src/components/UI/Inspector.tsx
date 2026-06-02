import { useGameStore } from '../../store/useGameStore';

const BIOME_COLORS: Record<string, string> = {
  OCEAN: '#1e3a8a',
  BEACH: '#fde047',
  PLAIN: '#4ade80',
  FOREST: '#166534',
  MOUNTAIN: '#9ca3af'
};

export default function Inspector() {
  const cells = useGameStore(state => state.cells);
  const civs = useGameStore(state => state.civs);
  const hoveredCellId = useGameStore(state => state.hoveredCellId);
  const showDebug = useGameStore(state => state.showDebug);
  const toggleDebug = useGameStore(state => state.toggleDebug);

  if (!showDebug) {
    return (
      <button 
        onClick={toggleDebug}
        className="absolute bottom-4 right-4 bg-slate-900/90 text-slate-400 hover:text-white p-2 rounded-lg border border-slate-700 shadow-2xl backdrop-blur-md transition-colors"
        title="Afficher le debug"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
      </button>
    );
  }

  if (hoveredCellId === null) {
    return (
      <div className="absolute bottom-4 right-4 w-64 bg-slate-900/90 text-slate-100 p-4 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md pointer-events-auto">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-slate-400 italic">Survolez la carte</p>
          <button onClick={toggleDebug} className="text-slate-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
    );
  }

  const cell = cells.find(c => c.id === hoveredCellId);
  if (!cell) return null;
  const color = BIOME_COLORS[cell.biome] || '#000';
  const occupant = cell.civId ? civs.find(c => c.id === cell.civId) : null;

  return (
    <div className="absolute bottom-4 right-4 w-64 bg-slate-900/90 text-slate-100 p-4 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md pointer-events-auto transition-all duration-200">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">Cellule #{cell.id}</h3>
          <span 
            className="w-3 h-3 rounded-full border border-slate-600 shadow-sm"
            style={{ backgroundColor: color }}
          />
        </div>
        <button onClick={toggleDebug} className="text-slate-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        {occupant && (
          <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 mb-3">
            <span className="text-slate-300">Occupé par :</span>
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full border border-slate-600 shadow-sm"
                style={{ backgroundColor: occupant.color }}
              />
              <span className="font-bold text-white">{occupant.name}</span>
            </div>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-400">Biome</span>
          <span className="font-medium text-white">{cell.biome}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Élévation</span>
          <span className="font-medium text-emerald-400">{cell.elevation.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Humidité</span>
          <span className="font-medium text-blue-400">{cell.moisture.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
