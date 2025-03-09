/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Page from "./page";

it("App Router: Works with Server Components", () => {
  render(<Page />);
  expect(screen.getByRole("heading")).toHaveTextContent("Obstacle Course Solver");
});
it("Shows a start button if the game is not started", () => {
  render(<Page />);
  expect(screen.getByRole("button")).toHaveTextContent("Start");
});