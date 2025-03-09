import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Cell, Game, GamePhase } from '../models'

export type GameState = {
  model: Game | undefined
  phase: GamePhase
  boardSize: number
  placementBoard: Cell[][] | undefined
}

export type GameActions = {
  nextPhase: () => void,
  setBoardSize: (size: number) => void,
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
    nextPhase: () => set((state) => ({ ...state, phase: state.phase + 1 })),
    setBoardSize: (size) => set((state) => ( { ...state, boardSize: size }))
  })))
}