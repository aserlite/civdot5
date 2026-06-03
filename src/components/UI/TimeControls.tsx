import { useGameStore } from '../../store/useGameStore';

export default function TimeControls() {
  const isPlaying = useGameStore(state => state.isPlaying);
  const gameSpeed = useGameStore(state => state.gameSpeed);
  const togglePlay = useGameStore(state => state.togglePlay);
  const setSpeed = useGameStore(state => state.setSpeed);
  const year = useGameStore(state => state.year);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white p-2 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md flex gap-2 items-center">
      <div className="px-3 font-mono text-sm text-slate-300">
        Année {year}
      </div>

      <div className="w-px h-6 bg-slate-700"></div>

      <button 
        onClick={togglePlay}
        className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors w-20 ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <div className="flex gap-1 border-l border-slate-700 pl-2">
        {[1, 5, 10].map(speed => (
          <button
            key={speed}
            onClick={() => setSpeed(speed)}
            className={`w-8 h-8 rounded-lg font-medium text-sm transition-colors flex items-center justify-center ${gameSpeed === speed ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'} border border-transparent`}
          >
            x{speed}
          </button>
        ))}
      </div>
    </div>
  );
}
