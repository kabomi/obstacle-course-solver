import { Board, EmptyCell, StartCell, EndCell } from ".";

describe("Board", () => {
  it("Should return exception when creating a 1x1 Board", () => {
    const board = new Board([[EmptyCell]]);
    expect(() => board.validate()).toThrow("Invalid board");
  });
  it("Should return exception when missing start cell", () => {
    const board = new Board([[EmptyCell, EmptyCell], [EmptyCell, EmptyCell]]);
    expect(() => board.validate()).toThrow("Missing start cell");
  });
  it("Should return exception when missing end cell", () => {
    const board = new Board([[StartCell, EmptyCell], [EmptyCell, EmptyCell]]);
    expect(() => board.validate()).toThrow("Missing end cell");
  });
  it("Should not throw when board is valid", () => {
    const board = new Board([[StartCell, EmptyCell], [EmptyCell, EndCell]]);
    expect(() => board.validate()).not.toThrow();
  });
});