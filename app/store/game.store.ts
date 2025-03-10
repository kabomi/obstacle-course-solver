import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Board, BoulderCell, Cell, EmptyCell, EndCell, Game, GamePhase, InvalidCell, Point, Result, StartCell } from '../models'

export type GameState = {
  result?: Result
  phase: GamePhase
  boardSize: number
  placementBoard: Cell[][] | undefined
  startPoint?: Point
  endPoint?: Point
}

export type GameActions = {
  nextPhase: () => void,
  setBoardSize: (size: number) => void,
  place: (point: Point) => void,
}

export type GameStore = GameState & GameActions

export const initGameStore = (): GameState => {
  return { 
    boardSize: 2,
    phase: GamePhase.SelectMatrix,
    placementBoard: undefined,
    result: undefined,
    startPoint: undefined,
    endPoint: undefined
  }
}

export const defaultInitState: GameState = initGameStore();

export const createGameStore = (
  initState: GameState = defaultInitState,
) => {
  return createStore<GameStore>()(devtools((set) => ({
    ...initState,
    nextPhase: () => set((state) => { 
      if (state.phase === GamePhase.Play) return { ...defaultInitState };
      if (state.phase === GamePhase.SelectMatrix) {
        const placementBoard = Board.generateEmptyBoard(state.boardSize);
        state.placementBoard = placementBoard;
      }
      if (state.phase === GamePhase.PlaceObstacles) {
        const game = new Game(new Board(state.placementBoard!));
        game.start();
        state.result = game.getResult();
      }
      state.phase += 1;
      return { ...state };
    }),
    place: ([x, y]: Point) => set((state) => {
      if (!state.placementBoard || state.phase === GamePhase.Play) return state;
      const previousBoard = new Board(state.placementBoard);
      let placementBoard = new Board(Board.generateEmptyBoard(state.boardSize));
      if (!placementBoard) return state;
      switch (state.phase) {
        case GamePhase.PlaceStart:
          placementBoard.setCellAt([x, y], StartCell);
          state.startPoint = [x, y];
          break;
        case GamePhase.PlaceEnd:
          if (previousBoard.getCellAt(x, y) === StartCell) return state;
          const [startX, startY] = previousBoard.find(StartCell)[0];
          placementBoard.setCellAt([startX, startY], StartCell);
          placementBoard.setCellAt([x, y], EndCell);
          break;
        case GamePhase.PlaceObstacles:
          const previousCell = previousBoard.getCellAt(x, y);
          if (previousCell === StartCell ||
            previousCell === EndCell || 
            previousCell === InvalidCell
          ) { return state; }

          placementBoard = previousBoard;
          placementBoard.setCellAt([x, y], nextObstacle(previousCell));
          break;
        default:
          break;
      }
      return { ...state, placementBoard: placementBoard.cells };
    }),
    setBoardSize: (size) => set((state) => ({ ...state, boardSize: size }))
  })))
}

function nextObstacle(cell: Cell): Cell {
  switch (cell) {
    case EmptyCell:
      return BoulderCell;
    case BoulderCell:
      return EmptyCell;
    default:
      return EmptyCell;
  }
}