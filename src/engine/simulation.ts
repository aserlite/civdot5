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
      const colorData = generateCivColor(civs.map(c => c.hue));
      const newCiv: Civilization = {
        id: civId,
        name: generateCivName(),
        color: colorData.color,
        hue: colorData.hue,
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

export function simulateTick(cells: Cell[], civs: Civilization[], currentTick: number): { updatedCells: Cell[], updatedCivs: Civilization[], events: {message: string, type: string}[] } {
  const updatedCells = [...cells];
  let updatedCivs = civs.map(c => ({ ...c }));
  const events: {message: string, type: string}[] = [];
  
  for (const civ of updatedCivs) {
    let foodGain = GAME_CONFIG.BASE_INCOME.food; 
    let woodGain = GAME_CONFIG.BASE_INCOME.wood; 
    let oreGain = GAME_CONFIG.BASE_INCOME.ore;

    const ownedCells = updatedCells.filter(c => c.civId === civ.id);
    if (ownedCells.length === 0) continue;
    
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

    let maxPop = GAME_CONFIG.STARTING_POPULATION;
    let maxFood = GAME_CONFIG.BASE_STORAGE.food;
    let maxWood = GAME_CONFIG.BASE_STORAGE.wood;
    let maxOre = GAME_CONFIG.BASE_STORAGE.ore;

    ownedCells.forEach(c => {
      maxPop += GAME_CONFIG.MAX_POP_PER_CELL;
      if (c.biome === 'BEACH') {
        maxFood += GAME_CONFIG.BEACH_STORAGE.food;
        maxWood += GAME_CONFIG.BEACH_STORAGE.wood;
        maxOre += GAME_CONFIG.BEACH_STORAGE.ore;
      } else {
        maxFood += GAME_CONFIG.STORAGE_PER_CELL.food;
        maxWood += GAME_CONFIG.STORAGE_PER_CELL.wood;
        maxOre += GAME_CONFIG.STORAGE_PER_CELL.ore;
      }
      
      if (ownedCells.length > GAME_CONFIG.MIN_CELLS_FOR_REBELLION && (currentTick - (civ.lastRevoltTick || 0) > GAME_CONFIG.REBELLION_COOLDOWN) && Math.random() < GAME_CONFIG.REBELLION_CHANCE) {
        const civId = `civ_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const colorData = generateCivColor(updatedCivs.map(c => c.hue));
        const newCiv: Civilization = {
          id: civId,
          name: generateCivName(),
          color: colorData.color,
          hue: colorData.hue,
          capitalCellId: c.id,
          population: GAME_CONFIG.REBEL_STARTING_RESOURCES.pop,
          food: GAME_CONFIG.REBEL_STARTING_RESOURCES.food,
          wood: GAME_CONFIG.REBEL_STARTING_RESOURCES.wood,
          ore: GAME_CONFIG.REBEL_STARTING_RESOURCES.ore,
        };

        civ.lastRevoltTick = currentTick;

        const cellIndex = updatedCells.findIndex(cell => cell.id === c.id);
        if (cellIndex !== -1) {
          updatedCells[cellIndex] = {
            ...updatedCells[cellIndex],
            civId: newCiv.id
          };
        }

        updatedCivs.push(newCiv);
        events.push({ message: `Une rébellion a éclaté ! ${newCiv.name} se soulève.`, type: 'rebellion' });
      }
    });

    if (newFood > 0) {
      if (newPop < maxPop) {
        newPop += Math.ceil(newPop * GAME_CONFIG.GROWTH_RATE);
      }
    } else {
      newFood = 0;
      newPop -= Math.ceil(newPop * GAME_CONFIG.STARVATION_RATE);
      if (newPop < 1) newPop = 1;
    }

    newPop = Math.min(newPop, maxPop);
    newFood = Math.min(newFood, maxFood);
    newWood = Math.min(newWood, maxWood);
    newOre = Math.min(newOre, maxOre);

    const peacefulCandidates: { id: number, score: number }[] = [];
    const warCandidates: { id: number, score: number, civId: string }[] = [];
    
    ownedCells.forEach(c => {
      c.neighbors.forEach(nId => {
        const neighbor = updatedCells.find(nc => nc.id === nId);
        if (neighbor && neighbor.biome !== 'OCEAN') {
          const score = BIOME_SCORES[neighbor.biome] || 0;
          if (!neighbor.civId) {
            if (!peacefulCandidates.find(cand => cand.id === nId)) {
              peacefulCandidates.push({ id: nId, score });
            }
          } else if (neighbor.civId !== civ.id) {
            if (!warCandidates.find(cand => cand.id === nId)) {
              warCandidates.push({ id: nId, score, civId: neighbor.civId });
            }
          }
        }
      });
    });

    if (peacefulCandidates.length > 0) {
      if (newPop > GAME_CONFIG.EXPANSION_COST.pop && newWood >= GAME_CONFIG.EXPANSION_COST.wood) {
        peacefulCandidates.sort((a, b) => b.score - a.score);
        const bestCandidateId = peacefulCandidates[0].id;
        
        newWood -= GAME_CONFIG.EXPANSION_COST.wood;
        
        const cellIndex = updatedCells.findIndex(c => c.id === bestCandidateId);
        if (cellIndex !== -1) {
          updatedCells[cellIndex] = {
            ...updatedCells[cellIndex],
            civId: civ.id
          };
        }
      }
    } else if (warCandidates.length > 0) {
      if (newPop > GAME_CONFIG.WAR_COST.pop && newOre >= GAME_CONFIG.WAR_COST.ore) {
        warCandidates.sort((a, b) => b.score - a.score);
        const bestTarget = warCandidates[0];
        
        const defender = updatedCivs.find(c => c.id === bestTarget.civId);
        if (defender) {
          const attackPower = (newPop * 0.5) + (newOre * 2) + Math.random() * 50;
          let defensePower = ((defender.population * 0.5) + (defender.ore * 2)) * GAME_CONFIG.DEFENSE_BONUS + Math.random() * 50;
          
          const targetCell = updatedCells.find(c => c.id === bestTarget.id);
          if (targetCell && targetCell.biome === 'BEACH') {
            defensePower *= GAME_CONFIG.BEACH_DEFENSE_MULTIPLIER;
          }
          
          const defenderCapital = updatedCells.find(c => c.id === defender.capitalCellId);
          if (defenderCapital && targetCell) {
            const dx = defenderCapital.x - targetCell.x;
            const dy = defenderCapital.y - targetCell.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (targetCell.id === defender.capitalCellId) {
              defensePower *= 3;
            } else if (dist < 150) {
              defensePower *= 1.5;
            }
          }
          
          const defenderCellsCount = updatedCells.filter(c => c.civId === defender.id).length;
          const localPop = Math.floor(defender.population / Math.max(1, defenderCellsCount));
          
          newOre -= GAME_CONFIG.WAR_COST.ore;
          if (newOre < 0) newOre = 0;

          if (attackPower > defensePower) {
            defender.population = Math.max(1, defender.population - localPop);
            newPop = Math.max(1, newPop - GAME_CONFIG.WAR_COST.pop + Math.floor(localPop * GAME_CONFIG.ASSIMILATION_RATE));
            
            newFood += 20;
            newWood += 20;
            defender.food = Math.max(0, defender.food - 20);
            defender.wood = Math.max(0, defender.wood - 20);

            const cellIndex = updatedCells.findIndex(c => c.id === bestTarget.id);
            if (cellIndex !== -1) {
              updatedCells[cellIndex] = {
                ...updatedCells[cellIndex],
                civId: civ.id
              };
            }
            
            if (targetCell && targetCell.id === defender.capitalCellId) {
              updatedCivs = updatedCivs.filter(c => c.id !== defender.id);
              events.push({ message: `La capitale de ${defender.name} est tombée ! L'empire s'effondre.`, type: 'death' });
              
              for (let i = 0; i < updatedCells.length; i++) {
                if (updatedCells[i].civId === defender.id) {
                  updatedCells[i] = {
                    ...updatedCells[i],
                    civId: null
                  };
                }
              }
            }
          } else {
            newPop = Math.max(1, newPop - GAME_CONFIG.WAR_COST.pop);
            defender.population = Math.max(1, defender.population - Math.floor(localPop * 0.2));
          }
        }
      }
    }

    civ.food = newFood;
    civ.wood = newWood;
    civ.ore = newOre;
    civ.population = newPop;
  }

  return { updatedCells, updatedCivs, events };
}
