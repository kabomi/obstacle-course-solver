import { memo } from "react";
import { Cell, Point } from "../models";

export interface BoardCellProps {
  cell: Cell;
  color?: string;
  dataTestId: string;
  x: number;
  y: number;
  onClick: (p: Point) => void;
};
export const BoardCell = memo(({ cell, dataTestId, x, y, onClick, color }: BoardCellProps) => {
  return <div data-testid={dataTestId}
    className={`flex cursor-pointer hover:border-blue-500 hover:border-4 justify-center items-center border border-white w-8 h-8 ${color}`} onClick={() => onClick([x, y])}>
    {cell}
</div>;
});
BoardCell.displayName = "BoardCell";
