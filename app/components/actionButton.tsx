import React, { useCallback, useEffect, useState } from 'react'
import { useGameStore } from '../providers/game.store-provider';
import { GamePhase } from '../models';

export default function ActionButton() {
  const { phase, nextPhase, startPoint, endPoint,
     } = useGameStore(
      (state) => state,
    );
  const [isBusy, setIsBusy] = useState(false);
  const [disableNext, setDisableNext] = useState(false);
  const [actionName, setActionName] = useState("Next");

  const onClick = useCallback(async () => {
    if (phase === GamePhase.PlaceObstacles) {
      setIsBusy(true);
    }
    setTimeout(() => nextPhase(), 0);
    // return () => clearTimeout(timeout);
  }, [nextPhase, phase]);

  useEffect(() => {
    if (phase === GamePhase.PlaceStart) {
      if (startPoint) {
        setDisableNext(false);
      }
    }
    if (phase === GamePhase.PlaceEnd) {
      if (endPoint) {
        setDisableNext(false);
      }
    }
    if (phase === GamePhase.Play) {
      setIsBusy(false);
    }
  }, [phase, startPoint, endPoint]);
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
    <button disabled={disableNext}
      onClick={onClick}>
        {isBusy ? (
          <div className="flex flex-row items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white-500"></div>
          </div>
        ): actionName}
    </button>
  )
}
