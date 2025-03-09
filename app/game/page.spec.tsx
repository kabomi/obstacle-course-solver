/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import GamePage from "./page";
import { GameStoreContext, GameStoreProvider } from "../providers/game.store-provider";
import { createGameStore } from "../store/game.store";
import { Board, EndCell, GamePhase, StartCell } from "../models";

jest.mock('../components/board');

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

const mockUseRouter = useRouter as jest.Mock;

describe("Game Page", () => {
  const mockPush = jest.fn(() => Promise.resolve(true));
   
  beforeAll(() => {
    mockUseRouter.mockReturnValue({
      asPath: "/",
      query: {},
      push: mockPush,
      prefetch: () => Promise.resolve(true)
    });
  });
  let store = createGameStore();
  beforeEach(() => {
    store = createGameStore();
  });
  it("Renders Game Page", () => {
    render(
      <GameStoreProvider>
        <GamePage />
      </GameStoreProvider>
    );
    expect(screen.getByTestId("title")).toHaveTextContent("Select Matrix Size");
  });
  it("Shows a next button", () => {
    render(
      <GameStoreProvider>
        <GamePage />
      </GameStoreProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Next");
  });
  it("Shows matrix size slider", () => {
    render(
      <GameStoreProvider>
        <GamePage />
      </GameStoreProvider>
    );
    expect(screen.getByTestId("matrix-range")).toBeInTheDocument();
  });
  it("Shows place start phase after pressing next", () => {
    render(
      <GameStoreProvider>
        <GamePage />
      </GameStoreProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Next");

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId("title")).toHaveTextContent("Place Start");
    expect(screen.queryByTestId("matrix-range")).not.toBeInTheDocument();
  });
  describe("On place start phase", () => {
    beforeEach(() => {
      store.setState({ ...store.getState(), phase: GamePhase.SelectMatrix})
    });
    it("Shows a Board Game component", () => {
      render(
        <GameStoreProvider>
          <GamePage />
        </GameStoreProvider>
      );
      expect(screen.getByRole("button")).toHaveTextContent("Next");

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByTestId("game-board")).toBeInTheDocument();
    });
    it("places endCell when clicking on a cell", () => {
      const placementBoard = Board.generateEmptyBoard(2);
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceStart})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      fireEvent.click(screen.getByTestId("cell-0-0"));

      const state = store.getState();
      expect(state.placementBoard![0][0]).toBe(StartCell);
    });
    it("disables next action", () => {
      render(
        <GameStoreProvider>
          <GamePage />
        </GameStoreProvider>
      );
      expect(screen.getByRole("button")).toHaveTextContent("Next");

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
  describe("On place end phase", () => {
    beforeEach(() => {
      store.setState({ ...store.getState(), phase: GamePhase.SelectMatrix})
    });
    it("Shows a Board Game component", () => {
      const placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][0] = StartCell;
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceEnd})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      expect(screen.getByTestId("game-board")).toBeInTheDocument();
    });
    it("places endCell when clicking on a cell", () => {
      const placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][1] = StartCell;
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceEnd})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      fireEvent.click(screen.getByTestId("cell-0-0"));

      const state = store.getState();
      expect(state.placementBoard![0][1]).toBe(StartCell);
      expect(state.placementBoard![0][0]).toBe(EndCell);
    });

    it("disables next action", () => {
      const placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][0] = StartCell;
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceEnd})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it.only("disable next action if clicked on StartCell", () => {
      const placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][0] = StartCell;
      store.setState({ ...store.getState(), startPoint: [0, 0], placementBoard, phase: GamePhase.PlaceEnd})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      fireEvent.click(screen.getByTestId("cell-0-0"));

      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});
