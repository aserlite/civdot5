import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function GameLoop() {
  const isPlaying = useGameStore(state => state.isPlaying);
  const gameSpeed = useGameStore(state => state.gameSpeed);
  const runTick = useGameStore(state => state.runTick);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      runTick();
    }, 500 / gameSpeed);

    return () => clearInterval(intervalId);
  }, [isPlaying, gameSpeed, runTick]);

  return null;
}
