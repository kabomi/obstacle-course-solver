import { BoardType, BoulderCell, Cell, EmptyCell, EndCell, Graph, GravelCell, InvalidCell, StartCell, WormECell, WormSCell } from '.';

export type Result = null | {
  path?: Path;
  steps: number;
}

export type Point = [number, number];

export class Vector {
  p1: Point;
  p2: Point;
  weight: number;
  constructor(p1: Point, p2: Point, weight: number) {
    this.p1 = p1;
    this.p2 = p2;
    this.weight = weight;
  }
}

export type Path = Vector[];

export class Game {
  board: BoardType;
  shortestPath?: Path;
  result: Result = null;

  constructor(board: BoardType) {
      this.board = board;
  }

  public getResult(): Result {
    return {
      path: this.shortestPath,
      steps: this.shortestPath ? this.calculateStepsFrom(this.shortestPath) : 0,
    };
  }

  public start() {
    this.shortestPath = undefined;
    this.result = null;
    if (this.board.colLength <= 1 || this.board.colLength <= 1) {
        throw new Error("Invalid board");
    }

    this.validate();

    this.play();
  }

  private validate() {
    this.board.validate();
  }

  private play() {
    const startPoint = this.board.find(StartCell)[0];
    const endPoint = this.board.find(EndCell)[0];

    this.findShortestPath(startPoint, endPoint);
  }
  private calculateStepsFrom(path: Path) {
    if (!path || path.length === 0) {
      return 0;
    }
    return path.reduce((acc, vector) => acc + vector.weight, 0);
  }

  private calculateGraphFrom(board: BoardType): Graph {
    const graph = new Graph();
    for (let x = 0; x < board.rowLength; x++) {
      for (let y = 0; y < board.colLength; y++) {
        graph.addNode(`${x},${y}`);
      }
    }
    for (let x = 0; x < board.rowLength; x++) {
      for (let y = 0; y < board.colLength; y++) {
        const cell = board.getCellAt(x, y);
        if (cell === BoulderCell) {
          continue;
        }
        const neighbors = [[x -1, y], [x +1, y], [x, y -1], [x, y +1]] as Point[];
        for (const neighbor of neighbors) {
          const [neighborX, neighborY] = neighbor;
          if (neighborX < 0 || neighborY < 0 || neighborX >= board.rowLength || neighborY >= board.colLength) {
            continue;
          }
          const neighborCell = board.getCellAt(neighborX, neighborY);
          if (neighborCell === BoulderCell) {
            continue;
          }
          if (neighborCell === WormSCell) {
            const weight = this.getWeightFrom(neighborCell, cell);
            graph.addEdge(`${x},${y}`, `${neighborX},${neighborY}`, weight);
            this.board.find(WormECell)
              .map(([wx, wy]) => {
                graph.addEdge(`${neighborX},${neighborY}`, `${wx},${wy}`, 0);
              });
          } else {
            const weight = this.getWeightFrom(neighborCell, cell);
            graph.addEdge(`${x},${y}`, `${neighborX},${neighborY}`, weight);
          }
        }
      }
    }
    return graph;
  }

  private findShortestPath([startX, startY]: Point, [endX, endY]: Point) {
    const graph = this.calculateGraphFrom(this.board);

    // Dijkstra's algorithm
    const startNode = `${startX},${startY}`;
    const endNode = `${endX},${endY}`;

    const unexplored = new Set(graph.nodes);
    const precedingNodes = new Map<string, string>();

    const distances = new Map<string, number>();

    // Initialization
    graph.nodes.forEach(node => distances.set(node, Infinity));
    distances.set(startNode, 0);

    while (unexplored.size > 0) {
      // Iterate unexplored node with the smallest distance
      const presentNode = [...unexplored].reduce((closestNode, node) => {
        return distances.get(node)! < distances.get(closestNode)! ? node : closestNode;
      }, [...unexplored][0]);

      // Skip endNode or remaining nodes are inaccessible
      if (presentNode === endNode) {
        break;
      }
      // Skip when remaining nodes are inaccessible
      if (distances.get(presentNode) === Infinity) {
        break;
      }


      unexplored.delete(presentNode);

      // Update neighbors distances
      for (const neighbor of graph.edges.get(presentNode)!) {
        if (!unexplored.has(neighbor.node)){ 
          continue;
        }
        const newDistance = distances.get(presentNode)! + neighbor.weight;
        if (newDistance < distances.get(neighbor.node)!) {
          distances.set(neighbor.node, newDistance);
          precedingNodes.set(neighbor.node, presentNode);
        }
      }
    }

    // Calculate the shortest path of nodes
    let shortestPathNode: Array<string>  = [];
    let workingNode = endNode;
    while (precedingNodes.has(workingNode)) {
      shortestPathNode = [workingNode, ...shortestPathNode];
      workingNode = precedingNodes.get(workingNode)!;
    }
    if (shortestPathNode.length > 0) {
      shortestPathNode.unshift(startNode);
    }

    if (shortestPathNode.length > 1) {
      const [x1, y1] = shortestPathNode[0].split(',').map(Number);
      const [x2, y2] = shortestPathNode[1].split(',').map(Number);
      const weight = this.getWeightFrom(this.getCellAt([x2, y2]), this.getCellAt([x1, y1]));
      this.shortestPath = shortestPathNode.reduce((acc, node, i) => {
        if (i < 2) return acc;
        const [x1, y1] = acc[i - 2].p2;
        const [x2, y2] = node.split(',').map(Number);
        const weight = this.getWeightFrom(this.getCellAt([x2, y2]), this.getCellAt([x1, y1]));
        return [...acc, new Vector([x1, y1], [x2, y2], weight)];
      }, [new Vector([x1, y1], [x2, y2], weight)] as Path);
    }
    const steps = distances.get(endNode);
    //console.log('steps:', steps, 'path:', shortestPathNode);
    return {
      steps,
      path: shortestPathNode,
    };
  }

  public getWeightFrom(currentCell: Cell | null, previousCell: Cell | null): number {
    switch (currentCell) {
      case EndCell:
      case EmptyCell:
      case WormSCell:
        return 1;
      case StartCell:
      case BoulderCell:
        return 0;
      case GravelCell:
        return 2;
      case WormECell:
        if (previousCell === WormSCell) {
          return 0;
        }
        return 1;
      default:
        throw new Error("Invalid cell");
    }
  }

  private getCellAt(p: Point): Cell | null {
    if (!p) {
      return InvalidCell;
    }
    const [x, y] = p;
    return this.board.getCellAt(x, y);
  }
}