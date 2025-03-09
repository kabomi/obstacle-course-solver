/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import Board from "./board";
import { GamePhase } from "../models";

describe("Board Component", () => {
  it("Renders Board", () => {
    render(<Board matrixSize={2} phase={GamePhase.PlaceStart } onCellClick={jest.fn()} />);
    expect(screen.getByTestId("board")).toBeInTheDocument();
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        expect(screen.getByTestId(`cell-${i}-${j}`)).toBeInTheDocument();
      }
    }
  });
  it("calls onCellClick when clicking on a cell", () => {
    const onCellClick = jest.fn();
    render(<Board matrixSize={2} phase={GamePhase.PlaceStart } onCellClick={onCellClick} />);

    fireEvent.click(screen.getByTestId("cell-0-0"));

    expect(onCellClick).toHaveBeenCalledWith([0, 0]);
  });
});
