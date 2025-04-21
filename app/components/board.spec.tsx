/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { Board } from "./board";
import { GameStoreContext } from "../providers/game.store-provider";
import { createGameStore } from "../store/game.store";

describe("Board Component", () => {
  let store = createGameStore();
  beforeEach(() => {
    store = createGameStore();
  });
  it("Renders Board", () => {
    render(
      <GameStoreContext.Provider value={store}>
        <Board boardSize={2} onCellClick={jest.fn()} />
      </GameStoreContext.Provider>
    );
    expect(screen.getByTestId("board")).toBeInTheDocument();
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        expect(screen.getByTestId(`cell-${i}-${j}`)).toBeInTheDocument();
      }
    }
  });
  it("calls onCellClick when clicking on a cell", () => {
    const onCellClick = jest.fn();
    render(
      <GameStoreContext.Provider value={store}>
        <Board boardSize={2}  onCellClick={onCellClick} />
      </GameStoreContext.Provider>
    );

    fireEvent.click(screen.getByTestId("cell-0-0"));

    expect(onCellClick).toHaveBeenCalledWith([0, 0]);
  });
});
