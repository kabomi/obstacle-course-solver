"use client";
import { useCallback, useEffect, useState } from "react";
import "../page.css";
import { GamePhase, Point } from "../models";
import Board from "../components/board";
import { useGameStore } from '@/app/providers/game.store-provider'

export default function GamePage() {
  const { phase, nextPhase, boardSize, setBoardSize,
    placementBoard, place, startPoint, result
   } = useGameStore(
    (state) => state,
  );
  const [disableNext, setDisableNext] = useState(false);
  const [actionName, setActionName] = useState("Next");

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

  const onCellClick = useCallback((point: Point) => {
    if (phase === GamePhase.PlaceEnd) {
      if (startPoint && point[0] === startPoint[0] && point[1] === startPoint[1]) {
        return;
      }
    }
    place(point);
    setDisableNext(false);
  }, [place, phase, startPoint]);

  useEffect(() => {
    switch (phase) {
      case GamePhase.SelectMatrix:
        setActionName("Next");
        break;
      case GamePhase.PlaceStart:
      case GamePhase.PlaceEnd:
        setActionName("Next");
        setDisableNext(true);
        break;
      case GamePhase.PlaceObstacles:
        setActionName("Play");
        break;
      case GamePhase.Play:
        setActionName("Restart");
        break;
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
                max="100"
                value={boardSize}
                onChange={(e) => setBoardSize(parseInt(e.target.value))}
                step="1" />
              <label className="flex pl-2" htmlFor="matrix-range">{boardSize}</label>
            </p>
          )}
          {phase >= GamePhase.PlaceStart && placementBoard && (
            <div data-testid="game-board" className="flex flex-col">
              <Board cells={placementBoard} path={result?.path} onCellClick={onCellClick} />
            </div>
          )}
          {result && (
            <p data-testid="game-result" className="flex self-center mb-4">
              {result.steps > 0 ? `Minimum steps: ${result.steps}` : "Unable to calculate route"}
            </p>
          )}
          <p className="flex self-center">
            <button disabled={disableNext}
              onClick={nextPhase}>
              {actionName}
            </button>
          </p>
        </article>
      </main>
    </>
  );
}