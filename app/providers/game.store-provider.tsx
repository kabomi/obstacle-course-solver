'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type GameStore,
  createGameStore,
  initGameStore,
} from '@/app/store/game.store'

export type GameStoreApi = ReturnType<typeof createGameStore>

export const GameStoreContext = createContext<GameStoreApi | undefined>(
  undefined,
)

export interface GameStoreProviderProps {
  children: ReactNode
}

export const GameStoreProvider = ({
  children,
}: GameStoreProviderProps) => {
  const storeRef = useRef<GameStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createGameStore(initGameStore())
  }

  return (
    <GameStoreContext.Provider value={storeRef.current}>
      {children}
    </GameStoreContext.Provider>
  )
}

export const useGameStore = <T,>(
  selector: (store: GameStore) => T,
): T => {
  const gameStoreContext = useContext(GameStoreContext)

  if (!gameStoreContext) {
    throw new Error(`useGameStore must be used within GameStoreProvider`)
  }

  return useStore(gameStoreContext, selector)
}