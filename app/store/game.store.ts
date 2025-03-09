import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Board, Cell, EndCell, Game, GamePhase, Point, StartCell } from '../models'

export type GameState = {
  model: Game | undefined
  phase: GamePhase
  boardSize: number
  placementBoard: Cell[][] | undefined
  startPoint?: Point
  endPoint?: Point
}

export type GameActions = {
  nextPhase: () => void,
  setBoardSize: (size: number) => void,
  placeStart: (point: Point) => void,
  placeEnd: (point: Point) => void
}

export type GameStore = GameState & GameActions

export const initGameStore = (): GameState => {
  return { 
    boardSize: 2,
    phase: GamePhase.SelectMatrix,
    model: undefined,
    placementBoard: undefined
  }
}

export const defaultInitState: GameState = initGameStore();

export const createGameStore = (
  initState: GameState = defaultInitState,
) => {
  return createStore<GameStore>()(devtools((set) => ({
    ...initState,
    nextPhase: () => set((state) => { 
      if (state.phase === GamePhase.Play) return state;
      if (state.phase === GamePhase.SelectMatrix) {
        const placementBoard = Board.generateEmptyBoard(state.boardSize);
        state.placementBoard = placementBoard;
      }
      state.phase += 1;
      return { ...state };
    }),
    placeStart: ([x, y]) => set((state) => {
      if (state.phase !== GamePhase.PlaceStart) return state;
      const placementBoard = Board.generateEmptyBoard(state.boardSize);
      if (!placementBoard) return state;
      placementBoard[x][y] = StartCell;
      return { ...state, placementBoard, startPoint: [x, y] };
    }),
    placeEnd: ([x, y]) => set((state) => {
      if (state.phase !== GamePhase.PlaceEnd || !state.placementBoard) return state;
      const previousBoard = new Board(state.placementBoard);
      const placementBoard = new Board(Board.generateEmptyBoard(state.boardSize));

      if (previousBoard.getCellAt(x, y) === StartCell) return state;

      const [startX, startY] = previousBoard.find(StartCell)[0];
      placementBoard.setCellAt([startX, startY], StartCell);
      placementBoard.setCellAt([x, y], EndCell);
      return { ...state, placementBoard: placementBoard.cells };
    }),
    setBoardSize: (size) => set((state) => ({ ...state, boardSize: size }))
  })))
}