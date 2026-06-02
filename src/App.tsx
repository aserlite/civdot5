import MapCanvas from './components/MapCanvas';
import Inspector from './components/UI/Inspector';
import CivModal from './components/UI/CivModal';
import TimeControls from './components/UI/TimeControls';
import GameLoop from './components/GameLoop';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <GameLoop />
      <MapCanvas />
      <Inspector />
      <CivModal />
      <TimeControls />
    </div>
  )
}

export default App
