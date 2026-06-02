export const GAME_CONFIG = {
  STARTING_POPULATION: 100,
  STARTING_WOOD: 50,
  STARTING_FOOD: 50,
  STARTING_ORE: 0,
  BASE_INCOME: { food: 8, wood: 5, ore: 0 },
  EXPANSION_COST: { pop: 100, wood: 50 },
  CONSUMPTION_RATE: 10,
  GROWTH_RATE: 0.02,
  STARVATION_RATE: 0.05,
  BIOME_YIELDS: {
    PLAIN: { food: [3, 6], wood: [0, 1], ore: [0, 0] },
    FOREST: { food: [1, 3], wood: [3, 6], ore: [0, 0] },
    BEACH: { food: [1, 3], wood: [0, 0], ore: [0, 0] },
    MOUNTAIN: { food: [0, 0], wood: [0, 0], ore: [1, 4] },
    OCEAN: { food: [0, 0], wood: [0, 0], ore: [0, 0] }
  } as Record<string, { food: [number, number], wood: [number, number], ore: [number, number] }>
};
