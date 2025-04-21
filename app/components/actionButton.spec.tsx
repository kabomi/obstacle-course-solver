/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { GameStoreContext, GameStoreProvider } from "../providers/game.store-provider";
import { createGameStore } from "../store/game.store";
import { Board, Cell, EndCell, GamePhase, StartCell } from "../models";
import ActionButton from "./actionButton";


describe("ActionButton Component", () => {

  let store = createGameStore();
  beforeEach(() => {
    store = createGameStore();
  });
  it("Renders", () => {
    render(
      <GameStoreProvider>
        <ActionButton />
      </GameStoreProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Next");
  });
  describe("On place start phase", () => {
    beforeEach(() => {
      store.setState({ ...store.getState(), phase: GamePhase.SelectMatrix})
    });
    it("disables next action", (done) => {
      render(
        <GameStoreContext.Provider value={store}>
          <ActionButton />
        </GameStoreContext.Provider>
      );
      expect(screen.getByRole("button")).toHaveTextContent("Next");

      fireEvent.click(screen.getByRole("button"));

      waitFor(() => {
        expect(screen.getByRole("button")).toBeDisabled();
        done();
      });
    });
  });
  describe("On place end phase", () => {
    beforeEach(() => {
      store.setState({ ...store.getState(), phase: GamePhase.SelectMatrix})
    });

    it("disables next action", () => {
      const placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][0] = StartCell;
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceEnd})
      render(
        <GameStoreContext.Provider value={store}>
          <ActionButton />
        </GameStoreContext.Provider>
      );

      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
  describe("On place obstacles phase", () => {
    let placementBoard: Cell[][] = [];
    beforeEach(() => {
      placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][1] = StartCell;
      placementBoard[1][1] = EndCell;
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceObstacles})
    });
    
    it("rename next action to start", () => {
      const placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][0] = StartCell;
      store.setState({ ...store.getState(), startPoint: [0, 0], placementBoard, phase: GamePhase.PlaceObstacles})
      render(
        <GameStoreContext.Provider value={store}>
          <ActionButton />
        </GameStoreContext.Provider>
      );

      expect(screen.getByRole("button", { name: /^Play$/ })).toBeInTheDocument();
    });
  });
});
