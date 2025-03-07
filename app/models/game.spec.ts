/**
 * @jest-environment jsdom
 */
import { Game, Vector } from "./game";
import { Board, EmptyCell, EndCell, StartCell, BoulderCell } from ".";

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
    it.each`
    board                                 | resultSteps    | resultPath
    ${new Board([[StartCell, EmptyCell ], 
                [EmptyCell, EndCell]])}   |  ${2}          |${[new Vector([0, 0], [1, 0], 1), new Vector([1, 0] , [1, 1], 1)]}
    ${new Board([[StartCell, EmptyCell ], 
                [BoulderCell, EndCell]])} |  ${2}          |${[new Vector([0, 0], [0, 1], 1), new Vector([0, 1] , [1, 1], 1)]}
    ${new Board([[StartCell, EndCell ], 
                [BoulderCell, BoulderCell]])} |  ${1}          |${[new Vector([0, 0], [0, 1], 1)]}
    ${new Board([[StartCell, BoulderCell ], 
                [BoulderCell, EndCell]])} |  ${0}          |${undefined}
    `('should solve Board $board in $resultSteps steps', ({board, resultSteps, resultPath}) => {
      const game = new Game(board);

      game.start();

      const result = game.getResult();

      expect(result).toEqual(expect.objectContaining({ path: resultPath, steps: resultSteps }));
    });
  });
});