/**
 * @jest-environment jsdom
 */
import { Game, Vector } from "./game";
import { Board, EmptyCell, EndCell, StartCell, BoulderCell, GravelCell, WormSCell, WormECell } from ".";

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
    board                                 | resultSteps    |  testDescription | resultPath
    ${new Board([[StartCell, EmptyCell ], 
                [EmptyCell, EndCell]])}   |  ${2}          | ${`for the simplest case`} |${[new Vector([0, 0], [0, 1], 1), new Vector([0, 1] , [1, 1], 1)]}
    ${new Board([[StartCell, EmptyCell ], 
                [BoulderCell, EndCell]])} |  ${2}          | ${`with a Boulder cell`} |${[new Vector([0, 0], [0, 1], 1), new Vector([0, 1] , [1, 1], 1)]}
    ${new Board([[StartCell, EndCell ], 
                [BoulderCell, BoulderCell]])} |  ${1}      | ${`with two Boulder cells`} |${[new Vector([0, 0], [0, 1], 1)]}
    ${new Board([[StartCell, BoulderCell ], 
                [BoulderCell, EndCell]])} |  ${0}          | ${`that it's not solvable`} |${undefined}
    ${new Board([[StartCell, EmptyCell ], 
                [GravelCell, EndCell]])} |  ${2}          | ${`with a Gravel cell`} |${[new Vector([0, 0], [0, 1], 1), new Vector([0, 1] , [1, 1], 1)]}
    ${new Board([[StartCell, GravelCell ], 
                [GravelCell, EndCell]])} |  ${3}          | ${`with two Gravel cells`} |${[new Vector([0, 0], [0, 1], 2), new Vector([0, 1] , [1, 1], 1)]}
    `('should solve Board $testDescription in $resultSteps steps', ({board, resultSteps, resultPath}) => {
      const game = new Game(board);

      game.start();

      const result = game.getResult();

      expect(result).toEqual(expect.objectContaining({ path: resultPath, steps: resultSteps }));
    });
  });
  describe("With 3x3 board", () => {
    it.each`
    board                                  | resultSteps    |  testDescription                 |  resultPath
    ${[[StartCell, BoulderCell, EmptyCell], 
      [EmptyCell, EmptyCell, EmptyCell],
      [EmptyCell, GravelCell, EndCell]]}   |  ${4}          | ${`with 1 Boulder and 1 Gravel`} |${[new Vector([0, 0], [1, 0], 1), new Vector([1, 0] , [1, 1], 1), new Vector([1, 1] , [1, 2], 1), new Vector([1, 2] , [2, 2], 1)]}
    ${[[StartCell, BoulderCell, EmptyCell], 
      [WormSCell, EmptyCell, EmptyCell],
      [EmptyCell, GravelCell, EndCell]]}   |  ${4}          | ${`with 1 Wormhole start cell`}  |${[new Vector([0, 0], [1, 0], 1), new Vector([1, 0] , [1, 1], 1), new Vector([1, 1] , [1, 2], 1), new Vector([1, 2] , [2, 2], 1)]}
    ${[[StartCell, BoulderCell, EmptyCell], 
      [WormECell, EmptyCell, EmptyCell],
      [EmptyCell, GravelCell, EndCell]]}   |  ${4}          | ${`with 1 Wormhole end cell`}    |${[new Vector([0, 0], [1, 0], 1), new Vector([1, 0] , [1, 1], 1), new Vector([1, 1] , [1, 2], 1), new Vector([1, 2] , [2, 2], 1)]}
    ${[[StartCell, BoulderCell, EmptyCell], 
      [WormSCell, EmptyCell, WormECell],
      [EmptyCell, GravelCell, EndCell]]}   |  ${2}          | ${`with 1 WH start & 1 WH end cell`} |${[new Vector([0, 0], [1, 0], 1), new Vector([1, 0] , [1, 2], 0), new Vector([1, 2] , [2, 2], 1)]}
    ${[[BoulderCell, WormECell, EndCell], 
      [WormSCell, BoulderCell, BoulderCell],
      [EmptyCell, StartCell, EmptyCell]]}   |  ${3}          | ${`using wormhole`} |${[new Vector([2, 1], [2, 0], 1), new Vector([2, 0] , [1, 0], 1), new Vector([1, 0] , [0, 1], 0),  new Vector([0, 1] , [0, 2], 1)]}
    `('should solve Board $testDescription in $resultSteps steps', ({board, resultSteps, resultPath}) => {
      const game = new Game(new Board(board));

      game.start();

      const result = game.getResult();

      expect(result).toEqual(expect.objectContaining({ path: resultPath, steps: resultSteps }));
    });
  });
});