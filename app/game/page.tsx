"use client";
import { useCallback, useEffect, useState } from "react";
import "../page.css";
import { GamePhase } from "../models";
import Board from "../components/board";


export default function GamePage() {
  const [matrixSize, setMatrixSize] = useState(2);
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SelectMatrix);
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
                value={matrixSize}
                onChange={(e) => setMatrixSize(parseInt(e.target.value))}
                step="1" />
              <label className="flex pl-2" htmlFor="matrix-range">{matrixSize}</label>
            </p>
          )}
          {phase === GamePhase.PlaceStart && (
            <div data-testid="game-board" className="flex flex-col">
              <Board matrixSize={matrixSize} phase={phase} onCellClick={() => setDisableNext(false)} />
            </div>
          )}
          <p className="flex self-center">
            <button disabled={disableNext}
              onClick={() => setPhase((currentPhase) => currentPhase + 1) }>
              Next
            </button>
          </p>
        </article>
      </main>
    </>
  );
}