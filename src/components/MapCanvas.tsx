import { useEffect, useRef } from 'react';
import { generateCells } from '../engine/generator';
import { spawnCivilizations } from '../engine/simulation';
import { useGameStore } from '../store/useGameStore';
import { Delaunay } from 'd3-delaunay';

const BIOME_COLORS: Record<string, string> = {
  OCEAN: '#1e3a8a',
  BEACH: '#fde047',
  PLAIN: '#4ade80',
  FOREST: '#166534',
  MOUNTAIN: '#9ca3af'
};

export default function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const delaunayRef = useRef<Delaunay<number> | null>(null);
  
  const cells = useGameStore(state => state.cells);
  const civs = useGameStore(state => state.civs);
  const setCells = useGameStore(state => state.setCells);
  const initGame = useGameStore(state => state.initGame);
  const hoveredCellId = useGameStore(state => state.hoveredCellId);
  const setHoveredCellId = useGameStore(state => state.setHoveredCellId);
  const setSelectedCellId = useGameStore(state => state.setSelectedCellId);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const initialCells = generateCells(width, height, 1500);
    const { updatedCells, civs: generatedCivs } = spawnCivilizations(initialCells, 5);
    
    initGame(updatedCells, generatedCivs);
    
    delaunayRef.current = Delaunay.from(updatedCells.map(c => [c.x, c.y]));
  }, [initGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cells.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);
    
    // Passe 1 : Remplissage
    cells.forEach(cell => {
      if (!cell.polygon || cell.polygon.length === 0) return;
      
      ctx.beginPath();
      ctx.moveTo(cell.polygon[0][0], cell.polygon[0][1]);
      for (let i = 1; i < cell.polygon.length; i++) {
        ctx.lineTo(cell.polygon[i][0], cell.polygon[i][1]);
      }
      ctx.closePath();

      const color = BIOME_COLORS[cell.biome] || '#000';
      ctx.fillStyle = color;
      ctx.fill();
      
      if (cell.civId) {
        const civ = civs.find(c => c.id === cell.civId);
        if (civ) {
          ctx.fillStyle = civ.color;
          ctx.globalAlpha = 0.65;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }
    });

    // Passe 2 : Bordures
    cells.forEach(cell => {
      if (!cell.polygon || cell.polygon.length === 0) return;
      
      ctx.beginPath();
      ctx.moveTo(cell.polygon[0][0], cell.polygon[0][1]);
      for (let i = 1; i < cell.polygon.length; i++) {
        ctx.lineTo(cell.polygon[i][0], cell.polygon[i][1]);
      }
      ctx.closePath();

      if (cell.civId) {
        const civ = civs.find(c => c.id === cell.civId);
        if (civ) {
          ctx.strokeStyle = civ.color;
          ctx.lineWidth = 3;
        }
      } else {
        const color = BIOME_COLORS[cell.biome] || '#000';
        if (cell.biome === 'OCEAN') {
          ctx.strokeStyle = color;
        } else {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        }
        ctx.lineWidth = 0.8;
      }
      ctx.stroke();
    });

    // Dessiner les capitales de civilisations
    cells.forEach(cell => {
      if (cell.civId) {
        const civ = civs.find(c => c.id === cell.civId);
        if (civ) {
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = civ.color;
          ctx.fill();
          
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    if (hoveredCellId !== null) {
      const cell = cells.find(c => c.id === hoveredCellId);
      if (cell && cell.polygon && cell.polygon.length > 0) {
        ctx.beginPath();
        ctx.moveTo(cell.polygon[0][0], cell.polygon[0][1]);
        for (let i = 1; i < cell.polygon.length; i++) {
          ctx.lineTo(cell.polygon[i][0], cell.polygon[i][1]);
        }
        ctx.closePath();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [cells, hoveredCellId, civs]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!delaunayRef.current) return;
    
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    
    const closestId = delaunayRef.current.find(x, y);
    
    if (closestId !== hoveredCellId) {
      setHoveredCellId(closestId);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!delaunayRef.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const id = delaunayRef.current.find(x, y);
    setSelectedCellId(id);
  };

  const handleMouseLeave = () => {
    setHoveredCellId(null);
  };

  return (
    <canvas 
      ref={canvasRef} 
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      className="w-screen h-screen block"
    />
  );
}
