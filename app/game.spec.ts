/**
 * @jest-environment jsdom
 */
import { Game } from "./game";
import { Board, EmptyCell } from "./models";

describe("Game: Obstacle course solver", () => {

  describe("With 1x1 board", () => {
    it("Should return exception", () => {
      const board = new Board([[EmptyCell]]);
      const game = new Game(board);
      expect(() => game.start()).toThrow("Invalid board");
    });
  });

  describe("With 2x2 board", () => {
    it("Should return exception when board is invalid", () => {
      const board = new Board([[EmptyCell, EmptyCell], [EmptyCell, EmptyCell]]);
      const game = new Game(board);
      expect(() => game.start()).toThrow(expect.any(Error));
    });
  });
});