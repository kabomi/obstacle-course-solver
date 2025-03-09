import { Board, EndCell, GamePhase, StartCell } from "../models";
import { createGameStore, initGameStore } from "./game.store";

describe('Game Store', () => {
  it('has an initial state', () => {
    const state = initGameStore();

    expect(state).toEqual({
      boardSize: 2,
      phase: GamePhase.SelectMatrix,
      model: undefined,
      placementBoard: undefined
    });
  });
  describe('actions', () => {
    it('changes phase on nextPhase', () => {
      const state = initGameStore();
      const store = createGameStore(state);

      store.getState().nextPhase();

      expect(store.getState().phase).toBe(GamePhase.PlaceStart);
    });
    it('generates the placement board on nextPhase if phase is PlaceStart', () => {
      const state = initGameStore();
      const store = createGameStore(state);

      store.getState().nextPhase();

      expect(store.getState().placementBoard).toBeDefined();
    });
    it('does not change phase on nextPhase if phase is Play', () => {
      const state = initGameStore();
      state.phase = GamePhase.Play;
      const store = createGameStore(state);

      store.getState().nextPhase();

      expect(store.getState().phase).toBe(GamePhase.Play);
    });
    it('changes board size on setBoardSize', () => {
      const state = initGameStore();
      const store = createGameStore(state);

      store.getState().setBoardSize(3);

      expect(store.getState().boardSize).toBe(3);
    });
    it('adds StartCell on place if phase is PlaceStart', () => {
      const state = initGameStore();
      state.phase = GamePhase.PlaceStart;
      state.placementBoard = Board.generateEmptyBoard(2);
      const store = createGameStore(state);

      store.getState().place([0, 1]);

      const board = new Board(store.getState().placementBoard!);
      expect(board.getCellAt(0, 1)).toBe(StartCell);
      expect(store.getState().startPoint).toEqual([0, 1]);
    });
    it('does not add StartCell on place if phase is PlaceEnd', () => {
      const state = initGameStore();
      state.phase = GamePhase.PlaceEnd;
      const store = createGameStore(state);

      store.getState().place([0, 1]);

      expect(store.getState().placementBoard).toBeUndefined();
    });
    it('adds EndCell on place if phase is PlaceEnd', () => {
      const state = initGameStore();
      state.placementBoard = Board.generateEmptyBoard(2);
      state.placementBoard[0][0] = StartCell;
      state.phase = GamePhase.PlaceEnd;
      const store = createGameStore(state);

      store.getState().place([0, 1]);

      const board = new Board(store.getState().placementBoard!);
      expect(board.getCellAt(0, 1)).toBe(EndCell);
    });
    it('does not add EndCell on place if phase is PlaceStart', () => {
      const state = initGameStore();
      state.phase = GamePhase.PlaceStart;
      const store = createGameStore(state);

      store.getState().place([0, 1]);

      expect(store.getState().placementBoard).toBeUndefined();
    });
    it('does not add EndCell on place if point coincides with StartCell', () => {
      const state = initGameStore();
      state.placementBoard = Board.generateEmptyBoard(2);
      state.placementBoard[0][1] = StartCell;
      state.phase = GamePhase.PlaceEnd;
      const store = createGameStore(state);

      store.getState().place([0, 1]);

      const board = new Board(store.getState().placementBoard!);
      expect(board.getCellAt(0, 1)).toBe(StartCell);
    });
    describe('On place obstacles phase', () => {
      it('does not place on start point', () => {
        const state = initGameStore();
        state.phase = GamePhase.PlaceObstacles;
        state.placementBoard = Board.generateEmptyBoard(2);
        state.placementBoard[0][1] = StartCell;
        const store = createGameStore(state);

        store.getState().place([0, 1]);

        expect(store.getState().placementBoard![0][1]).toBe(StartCell);
      });
      it('does not add EndCell on end point', () => {
        const state = initGameStore();
        state.phase = GamePhase.PlaceObstacles;
        state.placementBoard = Board.generateEmptyBoard(2);
        state.placementBoard[0][1] = EndCell;
        const store = createGameStore(state);

        store.getState().place([0, 1]);

        expect(store.getState().placementBoard![0][1]).toBe(EndCell);
      });
    });
  });
});