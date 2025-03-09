"use client";

import { useState } from "react";
import { GamePhase, Board as BoardModel, Cell, EmptyCell } from "../models";
import {  } from "../models/board";

export interface BoardProps {
  matrixSize: number;
  phase: GamePhase;
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
export default function Board({ matrixSize, phase } : BoardProps) {
  const [board, setBoard] = useState<BoardModel>(new BoardModel(generateMatrix(matrixSize)));
  
  return (
    <div className="flex flex-col">
      <h2>Board</h2>
      <div className="flex flex-row">
        {board.cells.map((row, i) => (
          <div key={i} className="flex flex-col">
            {row.map((cell, j) => (
              <BoardCell key={j} cell={cell} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BoardCell({ cell }: { cell: Cell }) {
  return (
    <div className="border border-white w-8 h-8">
      {cell}
    </div>
  );
}