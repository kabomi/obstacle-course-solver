/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import Board from "./board";
import { Cell, EmptyCell, Vector } from "../models";

describe("Board Component", () => {
  const cells: Cell[][] = [
    [EmptyCell, EmptyCell],
    [EmptyCell, EmptyCell],
  ];
  it("Renders Board", () => {
    render(<Board cells={cells} onCellClick={jest.fn()} />);
    expect(screen.getByTestId("board")).toBeInTheDocument();
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        expect(screen.getByTestId(`cell-${i}-${j}`)).toBeInTheDocument();
      }
    }
  });
  it("Renders Board with a path of colored cells", () => {
    const path = [new Vector([0, 0], [0, 1], 1), new Vector([0, 1], [1, 1], 1)];
    const points = [path[0].p1, path[0].p2, path[1].p2];
    render(<Board cells={cells} path={path} onCellClick={jest.fn()} />);
    expect(screen.getByTestId("board")).toBeInTheDocument();
    for (let i = 0; i < path.length; i++) {
      const cell = screen.getByTestId(`cell-${points[i][0]}-${points[i][1]}`);
      expect(cell.classList).toContain("bg-emerald-400");
    }
  });
  it("calls onCellClick when clicking on a cell", () => {
    const onCellClick = jest.fn();
    render(<Board cells={cells} onCellClick={onCellClick} />);

    fireEvent.click(screen.getByTestId("cell-0-0"));

    expect(onCellClick).toHaveBeenCalledWith([0, 0]);
  });
});
