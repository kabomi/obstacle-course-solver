/**
 * @jest-environment jsdom
 */
import { Game } from "./game";
import { Board, EmptyCell, EndCell, StartCell } from ".";

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
    it("Should solve the board for a simple case", () => {
      const board = new Board([[StartCell, EmptyCell], [EmptyCell, EndCell]]);
      const game = new Game(board);

      game.start();

      expect(game.getResult()).toEqual(expect.objectContaining({ path: [[0, 0], [0, 1], [1, 1]], steps: 2 }));
    });
  });
});