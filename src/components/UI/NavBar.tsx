import { useGameStore } from '../../store/useGameStore';

export default function NavBar() {
  const mapMode = useGameStore(state => state.mapMode);
  const setMapMode = useGameStore(state => state.setMapMode);
  const showDebug = useGameStore(state => state.showDebug);
  const toggleDebug = useGameStore(state => state.toggleDebug);
  const showNotifications = useGameStore(state => state.showNotifications);
  const toggleNotifications = useGameStore(state => state.toggleNotifications);
  const setLeaderboardOpen = useGameStore(state => state.setLeaderboardOpen);

  return (
    <div className="fixed top-6 left-6 z-40 flex flex-col gap-2">
      <button
        onClick={toggleDebug}
        className="bg-slate-900/50 text-slate-300 hover:text-white px-3 py-1.5 rounded border border-slate-700/50 shadow-md backdrop-blur-md hover:bg-slate-800/80 transition-all font-medium text-xs text-left"
      >
        Debug : {showDebug ? 'ON' : 'OFF'}
      </button>
      <button
        onClick={() => setMapMode(mapMode === 'political' ? 'biome' : 'political')}
        className="bg-slate-900/50 text-slate-300 hover:text-white px-3 py-1.5 rounded border border-slate-700/50 shadow-md backdrop-blur-md hover:bg-slate-800/80 transition-all font-medium text-xs text-left"
      >
        Vue : {mapMode === 'political' ? 'Politique' : 'Terrain'}
      </button>
      <button
        onClick={toggleNotifications}
        className="bg-slate-900/50 text-slate-300 hover:text-white px-3 py-1.5 rounded border border-slate-700/50 shadow-md backdrop-blur-md hover:bg-slate-800/80 transition-all font-medium text-xs text-left"
      >
        Notifs : {showNotifications ? 'ON' : 'OFF'}
      </button>
      <button
        onClick={() => setLeaderboardOpen(true)}
        className="bg-slate-900/50 text-slate-300 hover:text-white px-3 py-1.5 rounded border border-slate-700/50 shadow-md backdrop-blur-md hover:bg-slate-800/80 transition-all font-medium text-xs text-left"
      >
        🏆 Classement
      </button>
    </div>
  );
}
