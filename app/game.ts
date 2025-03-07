import { BoardType } from './models';

export class Game {
  board: BoardType;

  constructor(board: BoardType) {
      this.board = board;
  }

  public start() {
    if (this.board.colLength <= 1 || this.board.colLength <= 1) {
        throw new Error("Invalid board");
    }

    this.board.validate();
  }
}