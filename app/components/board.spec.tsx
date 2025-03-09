/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import Board from "./board";
import { Cell, EmptyCell } from "../models";

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
  it("calls onCellClick when clicking on a cell", () => {
    const onCellClick = jest.fn();
    render(<Board cells={cells} onCellClick={onCellClick} />);

    fireEvent.click(screen.getByTestId("cell-0-0"));

    expect(onCellClick).toHaveBeenCalledWith([0, 0]);
  });
});
