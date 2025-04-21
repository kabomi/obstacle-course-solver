/**
 * @jest-environment jsdom
 */
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import GamePage from "./page";
import { GameStoreContext } from "../providers/game.store-provider";
import { createGameStore } from "../store/game.store";
import { Board, BoulderCell, Cell, EmptyCell, EndCell, GamePhase, GravelCell, StartCell, WormECell, WormSCell } from "../models";

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
      <GameStoreContext.Provider value={store}>
        <GamePage />
      </GameStoreContext.Provider>
    );
    expect(screen.getByTestId("title")).toHaveTextContent("Select Matrix Size");
  });
  it("Shows a next button", () => {
    render(
      <GameStoreContext.Provider value={store}>
        <GamePage />
      </GameStoreContext.Provider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Next");
  });
  it("Shows matrix size slider", () => {
    render(
      <GameStoreContext.Provider value={store}>
        <GamePage />
      </GameStoreContext.Provider>
    );
    expect(screen.getByTestId("matrix-range")).toBeInTheDocument();
  });
  it("Shows place start phase after pressing next", async () => {
    await act(() => {
      return render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );
    });
    expect(screen.getByRole("button")).toHaveTextContent("Next");

    await act(() => {
      return fireEvent.click(screen.getByRole("button"));
    });

    expect(await screen.findByTestId("title")).toHaveTextContent("Place Start");
    expect(screen.queryByTestId("matrix-range")).not.toBeInTheDocument();
  });
  describe("On place start phase", () => {
    beforeEach(() => {
      store.setState({ ...store.getState(), phase: GamePhase.SelectMatrix, boardSize: 2 });
    });
    it("Shows a Board Game component", async () => {
      await act(() => {
        return render(
          <GameStoreContext.Provider value={store}>
            <GamePage />
          </GameStoreContext.Provider>
        );
      });
      expect(screen.getByRole("button")).toHaveTextContent("Next");

      await act(() => {
        return fireEvent.click(screen.getByRole("button"));
      });

      expect(await screen.findByTestId("game-board")).toBeInTheDocument();
    });
    it("places endCell when clicking on a cell", async () => {
      const placementBoard = Board.generateEmptyBoard(2);
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceStart})
      await act(() => {
        return render(
          <GameStoreContext.Provider value={store}>
            <GamePage />
          </GameStoreContext.Provider>
        );
      });

      await act(() => {
        return fireEvent.click(screen.getByTestId("cell-0-0"));
      });

      const state = store.getState();
      expect(state.placementBoard![0][0]).toBe(StartCell);
    });
  });
  describe("On place end phase", () => {
    beforeEach(() => {
      store.setState({ ...store.getState(), phase: GamePhase.SelectMatrix})
    });
    it("Shows a Board Game component", async () => {
      const placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][0] = StartCell;
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceEnd, boardSize: 2})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      expect(await screen.findAllByTestId("game-board")).toBeDefined();
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

    it("disable next action if clicked on StartCell", () => {
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
  describe("On place obstacles phase", () => {
    let placementBoard: Cell[][] = [];
    beforeEach(() => {
      placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][1] = StartCell;
      placementBoard[1][1] = EndCell;
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceObstacles})
    });
    it("Shows a Board Game component", () => {
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      expect(screen.getByTestId("game-board")).toBeInTheDocument();
    });
    it("places an Obstacle when clicking on an EmptyCell", () => {
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      fireEvent.click(screen.getByTestId("cell-0-0"));

      const state = store.getState();
      expect(state.placementBoard![0][1]).toBe(StartCell);
      expect(state.placementBoard![1][1]).toBe(EndCell);
      expect(state.placementBoard![0][0]).toBe(BoulderCell);
    });
    it("places a GravelCell when clicking on a BoulderCell", () => {
      store.setState({ ...store.getState(), placementBoard: [[BoulderCell, StartCell], [EmptyCell, EndCell]]})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      fireEvent.click(screen.getByTestId("cell-0-0"));

      const state = store.getState();
      expect(state.placementBoard![0][1]).toBe(StartCell);
      expect(state.placementBoard![1][1]).toBe(EndCell);
      expect(state.placementBoard![0][0]).toBe(GravelCell);
    });
    it("places an WormSCell when clicking on a GravelCell", () => {
      store.setState({ ...store.getState(), placementBoard: [[GravelCell, StartCell], [EmptyCell, EndCell]]})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      fireEvent.click(screen.getByTestId("cell-0-0"));

      const state = store.getState();
      expect(state.placementBoard![0][1]).toBe(StartCell);
      expect(state.placementBoard![1][1]).toBe(EndCell);
      expect(state.placementBoard![0][0]).toBe(WormSCell);
    });
    it("places an WormECell when clicking on a WormSCell", () => {
      store.setState({ ...store.getState(), placementBoard: [[WormSCell, StartCell], [EmptyCell, EndCell]]})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      fireEvent.click(screen.getByTestId("cell-0-0"));

      const state = store.getState();
      expect(state.placementBoard![0][1]).toBe(StartCell);
      expect(state.placementBoard![1][1]).toBe(EndCell);
      expect(state.placementBoard![0][0]).toBe(WormECell);
    });
    it("places an EmptyCell when clicking on a WormECell", () => {
      store.setState({ ...store.getState(), placementBoard: [[WormECell, StartCell], [EmptyCell, EndCell]]})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      fireEvent.click(screen.getByTestId("cell-0-0"));

      const state = store.getState();
      expect(state.placementBoard![0][1]).toBe(StartCell);
      expect(state.placementBoard![1][1]).toBe(EndCell);
      expect(state.placementBoard![0][0]).toBe(EmptyCell);
    });


    it("rename next action to start", () => {
      const placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][0] = StartCell;
      store.setState({ ...store.getState(), startPoint: [0, 0], placementBoard, phase: GamePhase.PlaceObstacles})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      expect(screen.getByRole("button", { name: /^Play$/ })).toBeInTheDocument();
    });
  });
  describe("On Play phase", () => {
    let placementBoard: Cell[][] = [];
    beforeEach(() => {
      placementBoard = Board.generateEmptyBoard(2);
      placementBoard[0][1] = StartCell;
      placementBoard[1][1] = EndCell;
      store.setState({ ...store.getState(), placementBoard, phase: GamePhase.PlaceObstacles})
    });
    it("Shows a Board Game component", () => {
      store.getState().nextPhase();
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      expect(screen.getByTestId("game-board")).toBeInTheDocument();
    });
    it("Shows the resulting steps", () => {
      store.getState().nextPhase();
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );

      expect(screen.getByTestId("game-result")).toBeInTheDocument();
      expect(screen.getByTestId("game-result")).toHaveTextContent("Minimum steps: 1");
    });
    it("Shows a message indicating that there is no path that solves the game", () => {
      store.setState({ ...store.getState(), placementBoard, result: { path: [], steps: 0 }, phase: GamePhase.Play})
      render(
        <GameStoreContext.Provider value={store}>
          <GamePage />
        </GameStoreContext.Provider>
      );
      expect(screen.getByTestId("game-result")).toBeInTheDocument();
      expect(screen.getByTestId("game-result")).toHaveTextContent("Unable to calculate route");
    });
  });
});
