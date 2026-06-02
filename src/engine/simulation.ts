import type { Cell, Civilization } from './types';
import { GAME_CONFIG } from './config';
import { generateCivColor, generateCivName } from './generators';

const BIOME_SCORES: Record<string, number> = {
  PLAIN: 10,
  FOREST: 8,
  BEACH: 4,
  MOUNTAIN: 1,
  OCEAN: 0,
};

function getRandomYield([min, max]: [number, number]): number {
  if (min === max) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function spawnCivilizations(cells: Cell[], count: number): { updatedCells: Cell[], civs: Civilization[] } {
  const updatedCells = [...cells];
  const civs: Civilization[] = [];

  const scoredCells = updatedCells.map(cell => ({
    cell,
    score: BIOME_SCORES[cell.biome] || 0
  }));

  scoredCells.sort((a, b) => b.score - a.score);

  const MIN_DIST = 300;

  for (const { cell } of scoredCells) {
    if (civs.length >= count) break;
    if (cell.biome === 'OCEAN') continue;
    let tooClose = false;
    for (const civ of civs) {
      const capital = updatedCells.find(c => c.id === civ.capitalCellId);
      if (!capital) continue;
      
      const dx = cell.x - capital.x;
      const dy = cell.y - capital.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < MIN_DIST) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      const civId = `civ_${civs.length + 1}`;
      const newCiv: Civilization = {
        id: civId,
        name: generateCivName(),
        color: generateCivColor(),
        capitalCellId: cell.id,
        population: GAME_CONFIG.STARTING_POPULATION,
        food: GAME_CONFIG.STARTING_FOOD,
        wood: GAME_CONFIG.STARTING_WOOD,
        ore: GAME_CONFIG.STARTING_ORE,
      };
      
      civs.push(newCiv);
      
      const cellIndex = updatedCells.findIndex(c => c.id === cell.id);
      if (cellIndex !== -1) {
        updatedCells[cellIndex] = {
          ...updatedCells[cellIndex],
          civId: newCiv.id
        };
      }
    }
  }

  return { updatedCells, civs };
}

export function simulateTick(cells: Cell[], civs: Civilization[]): { updatedCells: Cell[], updatedCivs: Civilization[] } {
  const updatedCells = [...cells];
  
  const updatedCivs = civs.map(civ => {
    let foodGain = GAME_CONFIG.BASE_INCOME.food; 
    let woodGain = GAME_CONFIG.BASE_INCOME.wood; 
    let oreGain = GAME_CONFIG.BASE_INCOME.ore;

    const ownedCells = updatedCells.filter(c => c.civId === civ.id);
    
    ownedCells.forEach(cell => {
      const yields = GAME_CONFIG.BIOME_YIELDS[cell.biome];
      if (yields) {
        foodGain += getRandomYield(yields.food);
        woodGain += getRandomYield(yields.wood);
        oreGain += getRandomYield(yields.ore);
      }
    });

    const foodConsumption = Math.floor(civ.population / GAME_CONFIG.CONSUMPTION_RATE);
    const netFood = foodGain - foodConsumption;

    let newFood = civ.food + netFood;
    let newPop = civ.population;
    let newWood = civ.wood + woodGain;
    let newOre = civ.ore + oreGain;

    if (newFood > 0) {
      newPop += Math.ceil(newPop * GAME_CONFIG.GROWTH_RATE);
    } else {
      newFood = 0;
      newPop -= Math.ceil(newPop * GAME_CONFIG.STARVATION_RATE);
      if (newPop < 1) newPop = 1;
    }

    console.log('Civ:', civ.name, '| Pop:', newPop, '| Wood:', newWood);
    if (newPop > GAME_CONFIG.EXPANSION_COST.pop && newWood >= GAME_CONFIG.EXPANSION_COST.wood) {
      const candidates: { id: number, score: number }[] = [];
      
      ownedCells.forEach(c => {
        c.neighbors.forEach(nId => {
          const neighbor = updatedCells.find(nc => nc.id === nId);
          if (neighbor && !neighbor.civId && neighbor.biome !== 'OCEAN') {
            const score = BIOME_SCORES[neighbor.biome] || 0;
            if (!candidates.find(cand => cand.id === nId)) {
              candidates.push({ id: nId, score });
            }
          }
        });
      });

      if (candidates.length > 0) {
        candidates.sort((a, b) => b.score - a.score);
        const bestCandidateId = candidates[0].id;
        
        newWood -= GAME_CONFIG.EXPANSION_COST.wood;
        
        const cellIndex = updatedCells.findIndex(c => c.id === bestCandidateId);
        if (cellIndex !== -1) {
          updatedCells[cellIndex] = {
            ...updatedCells[cellIndex],
            civId: civ.id
          };
        }
      }
    }

    return {
      ...civ,
      food: newFood,
      wood: newWood,
      ore: newOre,
      population: newPop
    };
  });

  return { updatedCells, updatedCivs };
}
