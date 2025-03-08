import { BoardType, BoulderCell, Cell, EmptyCell, EndCell, StartCell } from '.';

export type Result = null | {
  path: Path;
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
  paths: Path[] = [];
  result: Result = null;

  constructor(board: BoardType) {
      this.board = board;
  }

  public getResult(): Result {
    const path = this.getShorterPath();
    return {
      path,
      steps: this.calculateStepsFrom(path)
    };
  }

  private getShorterPath() {
    let shorterPath = this.paths[0];
    let shorterPathLength = this.calculateStepsFrom(shorterPath);
    const endCell = this.board.find(EndCell)[0];
    this.paths.forEach((path) => {
      const [endX, endY] = path[path.length - 1].p2;
      if (endX !== endCell[0] || endY !== endCell[1]) {
        return;
      }
      const pathLength = this.calculateStepsFrom(path);
      if (pathLength < shorterPathLength) {
        shorterPath = path;
        shorterPathLength = pathLength;
      }
    });
    return shorterPath;
  }

  public start() {
    this.paths = [];
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

  private findShortestPath([startX, startY]: Point, [endX, endY]: Point) {
    const pointVisitor =  new PointVisitor([]);

    const queue: [Point, Path, PointVisitor][] = [[[startX, startY], [], pointVisitor]];

    while(queue.length > 0) {
      const [currentPoint, currentPath, currentPointVisitor] = queue.shift() as [Point, Path, PointVisitor];
      const [currentX, currentY] = currentPoint;
      
      // If already visited, skip this point
      if (currentPointVisitor.hasVisited(currentPoint)) {
        continue;
      }

      // If out of bounds, skip this point
      if (currentX < 0 || currentY < 0 || currentX >= this.board.rowLength || currentY >= this.board.colLength) {
        continue;
      }

      const currentCell = this.getCellAt(currentPoint);

      // If the current cell is the end cell, add the path to the list of paths
      if (currentCell === EndCell) {
        currentPath.push(new Vector(currentPointVisitor.getLastVisited(), currentPoint, 1));
        this.paths.push(currentPath);
        currentPointVisitor.visit(currentPoint);
        continue;
      }

      // Mark the current point as visited based on the Cell type
      if (currentCell === StartCell) {
        currentPointVisitor.visit(currentPoint);
      }
      // When an empty cell is found, add it to the path
      if (currentCell === EmptyCell) {
        currentPath.push(new Vector(currentPointVisitor.getLastVisited(), currentPoint, 1));
        currentPointVisitor.visit(currentPoint);
      }
      // When a boulder cell is found, mark it as visited and skip this point
      if (currentCell === BoulderCell) {
        currentPointVisitor.visit(currentPoint);
        continue;
      }
      

      const neighbors = [[currentX -1, currentY], [currentX +1, currentY], [currentX, currentY -1], [currentX, currentY +1]] as Point[];

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
        
        if (newPointVisitor.hasVisited([endX, endY]) && !currentPointVisitor.hasVisited([endX, endY])) {
          this.paths.push(newPath);
          currentPointVisitor.visit(neighbor);
          continue;
        } else {
          queue.push([neighbor, newPath, newPointVisitor]);
        }
      }
    }
  }

  private getCellAt([x, y]: Point): Cell | null {
    return this.board.getCellAt(x, y);
  }
}