import React from 'react'
import { useGameStore } from '../providers/game.store-provider';

export default function Result() {
  const result= useGameStore((state) => state.result);
  return result && (
      <p data-testid="game-result" className="flex self-center mb-4">
        {result.steps > 0 ? `Minimum steps: ${result.steps}` : "Unable to calculate route"}
      </p>
  );
  
}
