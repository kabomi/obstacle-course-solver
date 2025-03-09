"use client";

import { Cell, Point } from "../models";
export interface BoardProps {
  cells: Cell[][];
  onCellClick: (point: Point) => void;
}

export default function Board({ cells, onCellClick } : BoardProps) {
  
  return (
    <div data-testid="board" className="flex flex-col items-center mb-4">
      <h2 className="mb-4">Board</h2>
      <div className="flex flex-row">
        {cells.map((row, i) => (
          <div key={i} className="flex flex-col">
            {row.map((cell, j) => (
              <BoardCell dataTestId={`cell-${i}-${j}`} key={j} cell={cell} onClick={() => onCellClick([i, j])} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface BoardCellProps {
  cell: Cell;
  dataTestId: string;
  onClick: () => void;
};

export function BoardCell({ cell, dataTestId, onClick }: BoardCellProps) {
  return (
    <div data-testid={dataTestId}
      className="flex justify-center items-center border border-white w-8 h-8" onClick={() => onClick()}>
      {cell}
    </div>
  );
}