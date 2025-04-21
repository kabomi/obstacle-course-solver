import { BoardCellProps } from "../cell";

export default function BoardCell({ onClick } : BoardCellProps) {
  return <div data-testid="cell-0-0" onClick={() => onClick([0, 0])}>
    Cell
  </div>;
}
