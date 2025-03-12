import { BoardType, BoulderCell, Cell, EmptyCell, EndCell, GravelCell, InvalidCell, StartCell, WormECell, WormSCell } from '.';

export type Result = null | {
  path?: Path;
  steps: number;
}

export type Point = [number, number];

export class PointVisitor {
  points: Point[] = [];
  constructor(points: Point[]) {
    points.forEach((point) => this.visit(point));
  }
  visited: Record<string, boolean> = {};
  visit([x, y]: Point) {
    if (!this.visited[`${x},${y}`]) {
      this.points.push([x, y]);
    }
    this.visited[`${x},${y}`] = true;
  }
  hasVisited([x, y]: Point): boolean {
    return this.visited[`${x},${y}`] || false;
  }
  getLastVisited(): Point {
    return this.points[this.points.length - 1];
  }
}

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

  private setShorterPath(newPath: Path) {
    const shorterPathLength = this.shortestPath ? this.calculateStepsFrom(this.shortestPath) : Infinity;
    const newPathLength = this.calculateStepsFrom(newPath);
    if (newPathLength < shorterPathLength) {
      this.shortestPath = newPath;
    }
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

  // TODO: Substitute algorithm with A* algorithm or Dijkstra's algorithm
  private findShortestPath([startX, startY]: Point, [endX, endY]: Point) {
    const pointVisitor =  new PointVisitor([]);

    const queue: [Point, Path, PointVisitor][] = [[[startX, startY], [], pointVisitor]];

    let iterations = 0;
    let shortestPathLength = Infinity;
    while(queue.length > 0) {
      iterations = iterations + 1;
      const [currentPoint, currentPath, currentPointVisitor] = queue.pop() as [Point, Path, PointVisitor];
      const [currentX, currentY] = currentPoint;

      // If the currentPath + 1 is longer than the shortestPath, skip this point
      if (shortestPathLength < this.calculateStepsFrom(currentPath) + 1) {
        continue;
      }
      
      // If already visited, skip this point
      if (currentPointVisitor.hasVisited(currentPoint)) {
        continue;
      }

      // If out of bounds, skip this point
      if (currentX < 0 || currentY < 0 || currentX >= this.board.rowLength || currentY >= this.board.colLength) {
        continue;
      }

      // Boost the algorithm when there are no wormholes and the board is big
      // When there are no Wormholes and the currentPath + distanceToEnd is less than board rowLength + board colLength - 2, skip this point
      if (this.board.find(WormSCell).length === 0 && this.board.find(WormECell).length === 0 && (this.board.rowLength + this.board.colLength > 10)) {
        const distanceToEnd = Math.abs(endX - currentX) + Math.abs(endY - currentY);
        if (this.shortestPath && this.calculateStepsFrom(currentPath) + distanceToEnd < this.board.rowLength + this.board.colLength - 2) {
          continue;
        }
      }

      // If the currentPath + (Min distance to end or to a WormSCell + Min distance from a WormECell to the end) is longer than the shortestPath, skip this point
      const distanceToEnd = Math.abs(endX - currentX) + Math.abs(endY - currentY);
      const minDistanceToWormSCell = this.board.find(WormSCell)
        .map(([x, y]) => Math.abs(x - currentX) + Math.abs(y - currentY))
        .reduce((acc, distance) => Math.min(acc, distance), Infinity);
      const minDistanceFromWormECell = this.board.find(WormECell)
        .map(([x, y]) => Math.abs(x - endX) + Math.abs(y - endY))
        .reduce((acc, distance) => Math.min(acc, distance), Infinity);
      if (this.shortestPath && this.calculateStepsFrom(currentPath) + Math.min(distanceToEnd, minDistanceToWormSCell + minDistanceFromWormECell) >= this.calculateStepsFrom(this.shortestPath)) {
        continue;
      }

      const currentCell = this.getCellAt(currentPoint);
      const lastVisitedCell = this.getCellAt(currentPointVisitor.getLastVisited());
      const weight = this.getWeightFrom(currentCell, lastVisitedCell);

      switch (currentCell) {
        case EndCell:
          // If the current cell is the end cell, add the path to the list of paths
          currentPath.push(new Vector(currentPointVisitor.getLastVisited(), currentPoint, weight));
          this.setShorterPath(currentPath);
          shortestPathLength = this.calculateStepsFrom(this.shortestPath!);
          console.log('EndCell', 'iteration ', iterations, currentPath, 'steps ', );
          currentPointVisitor.visit(currentPoint);
          continue;
        case StartCell:
          currentPointVisitor.visit(currentPoint);
          break;
        case EmptyCell:
        case GravelCell:
          // When an empty cell is found, add it to the path
          currentPath.push(new Vector(currentPointVisitor.getLastVisited(), currentPoint, weight));
          currentPointVisitor.visit(currentPoint);
          break;
        case WormSCell:
          // When a wormhole start cell is found, add it to the path and visit other wormhole end cells
          currentPath.push(new Vector(currentPointVisitor.getLastVisited(), currentPoint, weight));
          currentPointVisitor.visit(currentPoint);
          const wormholes = this.board.find(WormECell)
            .filter(([x, y]) => !currentPointVisitor.hasVisited([x, y]));
          for (const wormhole of wormholes) {
            const newPointVisitor = new PointVisitor(currentPointVisitor.points);
            const newPath = [...currentPath];
            queue.push([wormhole, newPath, newPointVisitor]);
          }
          break;
        case WormECell:
          // When a wormhole end cell is found, add it to the path
          currentPath.push(new Vector(currentPointVisitor.getLastVisited(), currentPoint, weight));
          currentPointVisitor.visit(currentPoint);
          break;
        case BoulderCell:
          currentPointVisitor.visit(currentPoint);
          continue;
        default:
          throw new Error("Invalid cell");
      }

      //const neighbors = [[currentX -1, currentY], [currentX +1, currentY], [currentX, currentY -1], [currentX, currentY +1]] as Point[];
      const neighbors = this.getNeighborsOrderedByDistance(currentPoint, [endX, endY]);
      
      for (const neighbor of neighbors) {
        const [neighborX, neighborY] = neighbor;
        if (neighborX < 0 || neighborY < 0 || neighborX >= this.board.rowLength || neighborY >= this.board.colLength) {
          continue;
        }
        if (currentPointVisitor.hasVisited(neighbor)) {
          continue;
        }
        
        const newPointVisitor = new PointVisitor(currentPointVisitor.points);
        const newPath = [...currentPath];
        
        if (shortestPathLength <= this.calculateStepsFrom(newPath) + 1) {
          continue;
        }
        
        queue.push([neighbor, newPath, newPointVisitor]);
      }
    }
  }
  private getNeighborsOrderedByDistance(currentPoint: Point, [endX, endY]: Point): Point[] {
    const [currentX, currentY] = currentPoint;
    const neighbors = [[currentX -1, currentY], [currentX +1, currentY], [currentX, currentY -1], [currentX, currentY +1]] as Point[];
    
    // Order the neighbors by distance to the end point
    return neighbors.sort((a, b) => {
      const [aX, aY] = a;
      const [bX, bY] = b;
      const aDistance = Math.abs(aX - endX) + Math.abs(aY - endY);
      const bDistance = Math.abs(bX - endX) + Math.abs(bY - endY);
      return aDistance - bDistance;
    }).reverse();
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