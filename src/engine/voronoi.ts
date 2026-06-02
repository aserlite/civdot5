import { Delaunay } from 'd3-delaunay';

export function generateVoronoi(points: [number, number][], width: number, height: number) {
  const delaunay = Delaunay.from(points);
  return delaunay.voronoi([0, 0, width, height]);
}
