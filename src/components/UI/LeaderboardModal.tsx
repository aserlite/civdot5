import { useGameStore } from '../../store/useGameStore';
import type { Civilization } from '../../engine/types';

export default function LeaderboardModal() {
  const isLeaderboardOpen = useGameStore(state => state.isLeaderboardOpen);
  const setLeaderboardOpen = useGameStore(state => state.setLeaderboardOpen);
  const civs = useGameStore(state => state.civs);
  const cells = useGameStore(state => state.cells);
  const year = useGameStore(state => state.year);

  if (!isLeaderboardOpen) return null;

  const getScore = (civ: Civilization) => {
    const ownedCellsCount = cells.filter(c => c.civId === civ.id).length;
    return Math.floor(civ.population + (civ.wood + civ.food + civ.ore) * 0.1 + (ownedCellsCount * 500));
  };

  const sortedCivs = [...civs].sort((a, b) => getScore(b) - getScore(a));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative shadow-2xl border border-slate-700">
        <button 
          onClick={() => setLeaderboardOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors text-2xl font-bold"
        >
          &times;
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
          🏆 Classement Mondial
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                <th className="py-4 px-4 font-semibold">Rang</th>
                <th className="py-4 px-4 font-semibold">Civilisation</th>
                <th className="py-4 px-4 font-semibold">Population</th>
                <th className="py-4 px-4 font-semibold">Territoires</th>
                <th className="py-4 px-4 font-semibold">Âge</th>
                <th className="py-4 px-4 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody className="text-white text-lg">
              {sortedCivs.map((civ, index) => {
                const ownedCellsCount = cells.filter(c => c.civId === civ.id).length;
                return (
                  <tr key={civ.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-400">#{index + 1}</td>
                    <td className="py-4 px-4 font-medium flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: civ.color }}></div>
                      {civ.name}
                    </td>
                    <td className="py-4 px-4">{civ.population.toLocaleString()}</td>
                    <td className="py-4 px-4">{ownedCellsCount}</td>
                    <td className="py-4 px-4 text-slate-300">{Math.max(0, year - civ.birthTick)} ans</td>
                    <td className="py-4 px-4 font-bold text-amber-400">{getScore(civ).toLocaleString()}</td>
                  </tr>
                );
              })}
              {sortedCivs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">Aucune civilisation active.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
