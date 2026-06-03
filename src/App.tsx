import MapCanvas from './components/MapCanvas';
import Inspector from './components/UI/Inspector';
import CivModal from './components/UI/CivModal';
import TimeControls from './components/UI/TimeControls';
import NavBar from './components/UI/NavBar';
import NotificationFeed from './components/UI/NotificationFeed';
import LeaderboardModal from './components/UI/LeaderboardModal';
import GameLoop from './components/GameLoop';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <GameLoop />
      <MapCanvas />
      <NavBar />
      <NotificationFeed />
      <Inspector />
      <CivModal />
      <TimeControls />
      <LeaderboardModal />
    </div>
  )
}

export default App
