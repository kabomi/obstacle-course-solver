"use client";
import { lazy, Suspense, useEffect } from "react";
import "../page.css";
import { GamePhase } from "../models";
import { useGameStore } from '@/app/providers/game.store-provider'
import ActionButton from "../components/actionButton";
import Result from "../components/result";
import GameHeader from "../components/gameHeader";

let LazyBoard = lazy(() => import("../components/board").then(module => ({ default: module.Board })));

export default function GamePage() {
  const { place, phase, boardSize, setBoardSize } = useGameStore(
    (state) => state,
  );

  useEffect(() => {
    if (phase === GamePhase.SelectMatrix) {
      LazyBoard = lazy(() => import("../components/board").then(module => ({ default: module.Board })));
    }
  }, [phase]);

  return (
    <>
      <GameHeader />
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

          {phase >= GamePhase.PlaceStart && boardSize && (
            <Suspense fallback={<div>Loading...</div>}>
              <div data-testid="game-board" className="flex flex-col">
                <LazyBoard boardSize={boardSize} onCellClick={place} />
              </div>
            </Suspense>
          )}
          <Result />
          <p className="flex self-center">
            <ActionButton />
          </p>
        </article>
      </main>
    </>
  );
}