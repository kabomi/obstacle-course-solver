"use client";

import { useState } from "react";
import { GamePhase, Board as BoardModel, Cell, EmptyCell, Point } from "../models";
import {  } from "../models/board";

export interface BoardProps {
  matrixSize: number;
  phase: GamePhase;
  onCellClick: (point: Point) => void;
}

function generateMatrix(matrixSize: number): Cell[][] {
  const matrix: Cell[][] = [];
  for (let i = 0; i < matrixSize; i++) {
    matrix.push([]);
    for (let j = 0; j < matrixSize; j++) {
      matrix[i].push(EmptyCell);
    }
  }
  return matrix;
}
export default function Board({ matrixSize, phase, onCellClick } : BoardProps) {
  const [board, setBoard] = useState<BoardModel>(new BoardModel(generateMatrix(matrixSize)));
  
  const handleCellClick = ([x, y]: Point) => {
    if (phase === GamePhase.PlaceStart) {
      const newBoard = new BoardModel(generateMatrix(matrixSize));
      newBoard.cells[x][y] = 'S';
      setBoard(newBoard);
      onCellClick([x, y]);
    }
  };

  return (
    <div data-testid="board" className="flex flex-col items-center mb-4">
      <h2 className="mb-4">Board</h2>
      <div className="flex flex-row">
        {board.cells.map((row, i) => (
          <div key={i} className="flex flex-col">
            {row.map((cell, j) => (
              <BoardCell dataTestId={`cell-${i}-${j}`} key={j} cell={cell} onClick={() => handleCellClick([i, j])} />
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