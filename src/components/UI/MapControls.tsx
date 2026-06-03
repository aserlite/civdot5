import { useGameStore } from '../../store/useGameStore';

export default function MapControls() {
  const mapMode = useGameStore(state => state.mapMode);
  const setMapMode = useGameStore(state => state.setMapMode);

  const toggleMode = () => {
    setMapMode(mapMode === 'political' ? 'biome' : 'political');
  };

  return (
    <button
      onClick={toggleMode}
      className="absolute top-6 right-6 bg-slate-900/90 text-white px-4 py-2 rounded-lg border border-slate-700 shadow-xl backdrop-blur-md hover:bg-slate-800 transition-colors font-medium text-sm z-50"
    >
      Vue : {mapMode === 'political' ? 'Politique' : 'Terrain'}
    </button>
  );
}
