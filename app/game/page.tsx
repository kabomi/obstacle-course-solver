"use client";
import { useCallback, useEffect, useState } from "react";
import "../page.css";
import { GamePhase } from "../models";
import Board from "../components/board";
import { useGameStore } from '@/app/providers/game.store-provider'

export default function GamePage() {
  const { phase, nextPhase, boardSize, setBoardSize } = useGameStore(
    (state) => state,
  );
  const [disableNext, setDisableNext] = useState(false);

  const getHeaderText = useCallback(() => {
    switch (phase) {
      case GamePhase.SelectMatrix:
        return "Select Matrix Size";
      case GamePhase.PlaceStart:
        return "Place Start";
      case GamePhase.PlaceEnd:
        return "Place End";
      case GamePhase.PlaceObstacles:
        return "Place Obstacles";
      case GamePhase.Play:
        return "Play";
      default:
        return "";
    }
  }, [phase]);

  useEffect(() => {
    if (phase === GamePhase.PlaceStart) {
      setDisableNext(true);
    }
  }, [phase]);

  return (
    <>
      <h1 data-testid="title">{getHeaderText()}</h1>
      <main>
        <article className="flex flex-col">
          {phase === GamePhase.SelectMatrix && (
            <p data-testid="matrix-range" className="flex flex-row items-center mb-4">
              <input
                type="range"
                id="matrix-range"
                name="matrix-range"
                className="flex"
                min="2"
                max="5"
                value={boardSize}
                onChange={(e) => setBoardSize(parseInt(e.target.value))}
                step="1" />
              <label className="flex pl-2" htmlFor="matrix-range">{boardSize}</label>
            </p>
          )}
          {phase === GamePhase.PlaceStart && (
            <div data-testid="game-board" className="flex flex-col">
              <Board matrixSize={boardSize} phase={phase} onCellClick={() => setDisableNext(false)} />
            </div>
          )}
          <p className="flex self-center">
            <button disabled={disableNext}
              onClick={() => nextPhase() }>
              Next
            </button>
          </p>
        </article>
      </main>
    </>
  );
}