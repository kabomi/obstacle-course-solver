import { Board, EmptyCell, GamePhase, StartCell } from "../models";
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
    it('adds StartCell on placeStart if phase is PlaceStart', () => {
      const state = initGameStore();
      state.phase = GamePhase.PlaceStart;
      const store = createGameStore(state);

      store.getState().placeStart([0, 1]);

      const board = new Board(store.getState().placementBoard!);
      expect(board.getCellAt(0, 1)).toBe(StartCell);
    });
    it('does not add StartCell on placeStart if phase is PlaceEnd', () => {
      const state = initGameStore();
      state.phase = GamePhase.PlaceEnd;
      const store = createGameStore(state);

      store.getState().placeStart([0, 1]);

      expect(store.getState().placementBoard).toBeUndefined();
    });
  });
});