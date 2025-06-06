/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation"
import Page from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

const mockUseRouter = useRouter as jest.Mock;

describe("Home Page", () => {
  const mockPush = jest.fn(() => Promise.resolve(true));
   
  beforeAll(() => {
    mockUseRouter.mockReturnValue({
      asPath: "/",
      query: {},
      push: mockPush,
      prefetch: () => Promise.resolve(true)
    });
  });
  it("Renders Home Page", () => {
    render(<Page />);
    expect(screen.getByRole("heading")).toHaveTextContent("Obstacle Course Solver");
  });
  it("Shows a start button if the game is not started", () => {
    render(<Page />);
    expect(screen.getByRole("button")).toHaveTextContent("Start");
  });
  it("Navigates to game page when the game is started", () => {
    render(<Page />);
    expect(screen.getByRole("button")).toHaveTextContent("Start");
    fireEvent.click(screen.getByRole("button"));
    expect(mockPush).toHaveBeenCalledWith("/game")
  });
});
