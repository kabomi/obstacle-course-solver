import React, { useCallback } from 'react'
import { useGameStore } from '../providers/game.store-provider';
import { GamePhase } from '../models';

export default function GameHeader() {
  const phase = useGameStore(
      (state) => state.phase,
    );
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

  return (
    <h1 data-testid="title">{getHeaderText()}</h1>
  )
}
