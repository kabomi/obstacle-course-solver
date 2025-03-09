import { BoardProps } from "../board";

export default function Board({ onCellClick } : BoardProps) {
  return <>
  <div>Board</div>
  <div data-testid="cell-0-0" onClick={() => onCellClick([0, 0])}></div>
  </>;
}
