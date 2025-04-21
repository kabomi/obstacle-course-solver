import { InvalidCell, Point } from "../models";
import { useGameStore } from "../providers/game.store-provider";

export interface BoardCellProps {
  color?: string;
  dataTestId: string;
  x: number;
  y: number;
  onClick: (p: Point) => void;
};
export const BoardCell = ({ dataTestId, x, y, onClick }: BoardCellProps) => {
  const cell = useGameStore(
    (state) => state.placementBoard ? state.placementBoard[x][y] : InvalidCell
  );
  const isColored = useGameStore(
    (state) => { 
      if (state.result && state.result.path) {
        return state.result.path.some(({ p1, p2 }) => (p1[0] === x && p1[1] === y) || (p2[0] === x && p2[1] === y));
      }
      return false;
    }
  );
  const color = isColored ? "bg-emerald-400" : "";

  return (
    <div data-testid={dataTestId} 
        className={`flex cursor-pointer hover:border-blue-500 hover:border-4 justify-center items-center border w-8 h-8 ${color}`}
        onClick={() => onClick([x, y])}>
      {cell}
    </div>);
};

