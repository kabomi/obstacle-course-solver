/**
 * @jest-environment jsdom
 */
import { Game } from "./game";

describe("Game: Obstacle course solver", () => {

  describe("With 1x1 matrix", () => {
    it("Should return exception", () => {
      const matrix = [['']];
      const game = new Game(matrix);
      expect(() => game.start()).toThrow("Invalid matrix");
    });
  });
});