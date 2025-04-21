"use client";

import { memo } from "react";
import { Point } from "../models";
import { BoardCell } from "./cell";
export interface BoardProps {
  boardSize: number;
  onCellClick: (point: Point) => void;
}

export const Board = memo(({ boardSize, onCellClick } : BoardProps) => {
  const cells = Array.from(Array(boardSize), () => 0);
  return (
    <div data-testid="board" className="flex flex-col items-center mb-4">
      <h2 className="mb-4">Board</h2>
      <div className="flex flex-col">
        {cells.map((row, x) => (
          <div key={x} className="flex flex-row">
            {cells.map((cell, y) => (
              <BoardCell dataTestId={`cell-${x}-${y}`} key={`${x}-${y}`} x={x} y={y}
               onClick={onCellClick} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
Board.displayName = "Board";
