/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { BoulderCell, Cell, EmptyCell, Vector } from "../models";
import { GameStoreContext } from "../providers/game.store-provider";
import { createGameStore } from "../store/game.store";
import { BoardCell } from "./cell";

describe("BoardCell Component", () => {
  let store = createGameStore();
  beforeEach(() => {
    store = createGameStore();
  });
  it("Renders", () => {
    const onClick = jest.fn();
    render(
      <GameStoreContext.Provider value={store}>
        <BoardCell dataTestId={'cell-0-0'} x={0} y={0} onClick={onClick} />
      </GameStoreContext.Provider>
    );
    expect(screen.getByTestId("cell-0-0")).toBeInTheDocument();
  });
  it("Renders a colored cell", () => {
    const path = [new Vector([0, 0], [0, 1], 1), new Vector([0, 1], [1, 1], 1)];
    store.setState({ ...store.getState(), result: { path, steps: 3 } });
    const onClick = jest.fn();
    render(
      <GameStoreContext.Provider value={store}>
        <BoardCell dataTestId={'cell-0-0'} x={0} y={0} onClick={onClick} />
      </GameStoreContext.Provider>
    );
    const cell = screen.getByTestId(`cell-0-0`);
    expect(cell.classList).toContain("bg-emerald-400");
  });
  it("Renders any Cell, e.g. BoulderCell", () => {
    const placementBoard = [[EmptyCell, EmptyCell], [BoulderCell, EmptyCell]] as Cell[][];
    store.setState({ ...store.getState(), placementBoard });
    const onClick = jest.fn();
    render(
      <GameStoreContext.Provider value={store}>
        <BoardCell dataTestId={'cell'} x={1} y={0} onClick={onClick} />
      </GameStoreContext.Provider>
    );
    const cell = screen.getByTestId(`cell`);

    expect(cell.innerHTML).toBe(BoulderCell);
  });
  it("calls onClick when clicking on it", () => {
    const onClick = jest.fn();
    render(
      <GameStoreContext.Provider value={store}>
        <BoardCell dataTestId={'cell-0-0'} x={0} y={0} onClick={onClick} />
      </GameStoreContext.Provider>
    );

    fireEvent.click(screen.getByTestId("cell-0-0"));

    expect(onClick).toHaveBeenCalledWith([0, 0]);
  });
});
