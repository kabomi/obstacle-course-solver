import { BoardType } from '.';

export type Result = null | {
  path: number[][];
  steps: number;
}

export class Game {
  board: BoardType;
  result: Result = null;

  constructor(board: BoardType) {
      this.board = board;
  }

  public getResult() {
    return {
      ...this.result,
      path: this.result?.path.map(([x, y]) => [x, y])
    };
  }

  public start() {
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
    this.result = {
      path: [[0, 0], [0, 1], [1, 1]],
      steps: 2
    };
  }
}