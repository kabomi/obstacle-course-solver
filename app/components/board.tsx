"use client";

import { Cell, Path, Point } from "../models";
export interface BoardProps {
  cells: Cell[][];
  path?: Path;
  onCellClick: (point: Point) => void;
}

function getPointsFromPath(path: Path): Point[] {
  const result = path.map(({ p1 }) => p1);
  result.push(path[path.length - 1].p2);
  return result;
}

function getColorForPoint(point: Point, coloredPoints: Point[]) {
  return coloredPoints.some(([x, y]) => x === point[0] && y === point[1]) ? "bg-emerald-400" : '';
}

export default function Board({ cells, path, onCellClick } : BoardProps) {
  const coloredPoints = path ? getPointsFromPath(path) : [];
  return (
    <div data-testid="board" className="flex flex-col items-center mb-4">
      <h2 className="mb-4">Board</h2>
      <div className="flex flex-col">
        {cells.map((row, x) => (
          <div key={x} className="flex flex-row">
            {row.map((cell, y) => (
              <BoardCell dataTestId={`cell-${x}-${y}`}  key={y} cell={cell} 
                color={getColorForPoint([x, y], coloredPoints)} onClick={() => onCellClick([x, y])} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface BoardCellProps {
  cell: Cell;
  color?: string;
  dataTestId: string;
  onClick: () => void;
};

export function BoardCell({ cell, dataTestId, color = '', onClick }: BoardCellProps) {
  return (
    <div data-testid={dataTestId}
      className={`flex justify-center items-center border border-white w-8 h-8 ${color}`} onClick={() => onClick()}>
      {cell}
    </div>
  );
}