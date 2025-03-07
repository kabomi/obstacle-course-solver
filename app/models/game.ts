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
    if (!this.result) {
      throw new Error("Game has not started");
    }

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

    const path = this.findShortestPath(startPoint, endPoint);
    const steps = this.calculateStepsFrom(path);
    
    this.result = {
      path,
      steps
    };
  }
  private calculateStepsFrom(path: Path) {
    if (!path || path.length === 0) {
      return 0;
    }
    return path.reduce((acc, vector) => acc + vector.weight, 0);
  }

  private findShortestPath([startX, startY]: Point, [endX, endY]: Point): Path {
    const shortestPath = [] as Path;
    const pointVisitor =  new PointVisitor([]);
    if (startX === endX && startY === endY) {
      return shortestPath;
    }
    this.findShortestPathAux([startX, startY], [endX, endY], pointVisitor, shortestPath);
    return shortestPath;
  }
  private findShortestPathAux([startX, startY]: Point, [endX, endY]: Point, pointVisitor: PointVisitor, path: Path) {
    
    if (pointVisitor.hasVisited([startX, startY])) {
      return;
    }
    if (startX < 0 || startY < 0 || startX >= this.board.rowLength || startY >= this.board.colLength) {
      return;
    }
    if (startX === endX && startY === endY) {
      path.push(new Vector(pointVisitor.getLastVisited(), [startX, startY], 1));
      pointVisitor.visit([startX, startY]);
      return;
    }

    if (this.getCellAt([startX, startY]) === StartCell) {
      pointVisitor.visit([startX, startY]);
    }
    if (this.getCellAt([startX, startY]) === EmptyCell) {
      path.push(new Vector(pointVisitor.getLastVisited(), [startX, startY], 1));
      pointVisitor.visit([startX, startY]);
    }
    if (this.getCellAt([startX, startY]) === BoulderCell) {
      pointVisitor.visit([startX, startY]);
      return;
    }
    const leftPoint = [startX -1, startY] as Point, rightPoint = [startX +1, startY] as Point, downPoint = [startX, startY -1] as Point, upPoint = [startX, startY +1] as Point;
    if (!pointVisitor.hasVisited(leftPoint)) {
      const newPointVisitor = new PointVisitor(pointVisitor.points);
      const newPath = [...path];
      this.findShortestPathAux(leftPoint, [endX, endY], newPointVisitor, newPath);
      if (newPointVisitor.hasVisited([endX, endY]) && !pointVisitor.hasVisited([endX, endY])) {
        //path.push(newPath[newPath.length - 1]);
        this.paths.push(newPath);
        pointVisitor.visit(leftPoint);
        return;
      }
    }
    if (!pointVisitor.hasVisited(rightPoint)) {
      const newPointVisitor = new PointVisitor(pointVisitor.points);
      const newPath = [...path];
      this.findShortestPathAux(rightPoint, [endX, endY], newPointVisitor, newPath);
      if (newPointVisitor.hasVisited([endX, endY]) && !pointVisitor.hasVisited([endX, endY])) {
        //path.push(newPath[newPath.length - 1]);
        this.paths.push(newPath);
        pointVisitor.visit(rightPoint);
        return;
      }
    }
    if (!pointVisitor.hasVisited(downPoint)) {
      const newPointVisitor = new PointVisitor(pointVisitor.points);
      const newPath = [...path];
      this.findShortestPathAux(downPoint, [endX, endY], newPointVisitor, newPath);
      if (newPointVisitor.hasVisited([endX, endY]) && !pointVisitor.hasVisited([endX, endY])) {
        //path.push(newPath[newPath.length - 1]);
        this.paths.push(newPath);
        pointVisitor.visit(downPoint);
        return;
      }
    }
    if (!pointVisitor.hasVisited(upPoint)) {
      const newPointVisitor = new PointVisitor(pointVisitor.points);
      const newPath = [...path];
      this.findShortestPathAux(upPoint, [endX, endY], newPointVisitor, newPath);
      if (newPointVisitor.hasVisited([endX, endY]) && !pointVisitor.hasVisited([endX, endY])) {
        //path.push(newPath[newPath.length - 1]);
        this.paths.push(newPath);
        pointVisitor.visit(upPoint);
        return;
      }
    }
  }

  private getCellAt([x, y]: Point): Cell | null {
    return this.board.getCellAt(x, y);
  }
}