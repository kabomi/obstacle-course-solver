export interface BoardType {
  rowLength: number;
  colLength: number;
  cells: string[][];
  validate(): void;
  find(cell: string): string[];
}

export const EmptyCell = '';
export const StartCell = 'S';
export const EndCell = 'E';
export type Cell = typeof EmptyCell | typeof StartCell | typeof EndCell;

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
  public find(cell: Cell): Cell[] {
    const result: Cell[] = [];
    for (let i = 0; i < this.rowLength; i++) {
      for (let j = 0; j < this.colLength; j++) {
        if (this.cells[i][j] === cell) {
          result.push(this.cells[i][j]);
        }
      }
    }
    return result;
  }
}