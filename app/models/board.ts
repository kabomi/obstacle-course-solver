import { Point } from ".";

export interface BoardType {
  getCellAt(x: number, y: number): Cell | typeof InvalidCell;
  rowLength: number;
  colLength: number;
  cells: Cell[][];
  validate(): void;
  find(cell: Cell): Point[];
}

export const EmptyCell = '';
export const StartCell = 'S';
export const EndCell = 'E';
export const BoulderCell = 'B';
export const GravelCell = 'G';
export const WormSCell = 'WS';
export const InvalidCell = null;
export type Cell = typeof EmptyCell | typeof StartCell | typeof EndCell | 
  typeof BoulderCell | typeof GravelCell | typeof WormSCell;

export type ObstacleCell = typeof BoulderCell | typeof GravelCell | typeof WormSCell;
export type ObstacleRotationCell = typeof EmptyCell | ObstacleCell;
export const obstacleCells = [BoulderCell, GravelCell, WormSCell] as const;
export const obstacleRotationCells = [...obstacleCells, EmptyCell] as const;

export class Board implements BoardType {
  rowLength: number;
  colLength: number;
  cells: Cell[][];
  constructor(cells: Cell[][]) {
    this.cells = cells;
    this.rowLength = cells.length;
    this.colLength = cells[0] ? cells[0].length : 0;
  }
  public validate() {
    if (this.rowLength <= 1 || this.colLength <= 1) {
      throw new Error("Invalid board");
    }
    if (this.find(StartCell).length === 0) {
      throw new Error("Missing start cell");
    }
    if (this.find(EndCell).length === 0) {
      throw new Error("Missing end cell");
    }
  }
  public find(cell: Cell): Point[] {
    const result: Point[] = [];
    for (let i = 0; i < this.rowLength; i++) {
      for (let j = 0; j < this.colLength; j++) {
        if (this.cells[i][j] === cell) {
          result.push([i, j]);
        }
      }
    }
    return result;
  }

  public getCellAt(x: number, y: number): Cell | typeof InvalidCell {
    if (this.cells[x] === undefined || this.cells[x][y] === undefined) {
      return InvalidCell;
    }
    return this.cells[x][y];
  }

  public setCellAt([x, y]: Point, cell: Cell): Cell | typeof InvalidCell {
    if (this.cells[x] === undefined || this.cells[x][y] === undefined) {
      return InvalidCell;
    }
    this.cells[x][y] = cell;
    return this.cells[x][y];
  }

  public static generateEmptyBoard(matrixSize: number): Cell[][] {
    const matrix: Cell[][] = [];
    for (let i = 0; i < matrixSize; i++) {
      matrix.push([]);
      for (let j = 0; j < matrixSize; j++) {
        matrix[i].push(EmptyCell);
      }
    }
    return matrix;
  }
}