import { useRef, useEffect } from 'react';

const MapCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block" 
    />
  );
};

export default MapCanvas;
