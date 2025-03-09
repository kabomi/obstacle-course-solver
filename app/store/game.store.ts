import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Board, Cell, Game, GamePhase, Point, StartCell } from '../models'

export type GameState = {
  model: Game | undefined
  phase: GamePhase
  boardSize: number
  placementBoard: Cell[][] | undefined
}

export type GameActions = {
  nextPhase: () => void,
  setBoardSize: (size: number) => void,
  placeStart: (point: Point) => void
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
      return { ...state, placementBoard };
    }),
    setBoardSize: (size) => set((state) => ({ ...state, boardSize: size }))
  })))
}