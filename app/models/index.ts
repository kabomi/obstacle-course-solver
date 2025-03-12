export * from './board';
export * from './game';


export enum GamePhase {
  SelectMatrix = 0,
  PlaceStart = 1,
  PlaceEnd = 2,
  PlaceObstacles = 3,
  Play = 4,
}

type EdgeValue = { node: string, weight: number };
type EdgeMap = Map<string, EdgeValue[]>;

export class Graph {
  nodes: Set<string>;
  edges: EdgeMap;
  constructor() {
    this.nodes = new Set();
    this.edges = new Map();
  }

  addNode(node: string) {
    this.nodes.add(node);
    this.edges.set(node, []);
  }

  addEdge(start: string, end: string, weight: number) {
    if (!this.edges.get(start)) { throw new Error("Invalid node"); }
    if (!this.edges.get(end)) { throw new Error("Invalid node"); }
    this.edges.get(start)!.push({ node: end, weight });
  }
}