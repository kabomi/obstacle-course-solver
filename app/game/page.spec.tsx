/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation"
import GamePage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

const mockUseRouter = useRouter as jest.Mock;

describe("Game Page", () => {
  const mockPush = jest.fn(() => Promise.resolve(true));
   
  beforeAll(() => {
    mockUseRouter.mockReturnValue({
      asPath: "/",
      query: {},
      push: mockPush,
      prefetch: () => Promise.resolve(true)
    });
  });
  it("Renders Game Page", () => {
    render(<GamePage />);
    expect(screen.getByTestId("title")).toHaveTextContent("Select Matrix Size");
  });
  it("Shows a next button", () => {
    render(<GamePage />);
    expect(screen.getByRole("button")).toHaveTextContent("Next");
  });
  it("Shows matrix size slider", () => {
    render(<GamePage />);
    expect(screen.getByTestId("matrix-range")).toBeInTheDocument();
  });
  it("Shows place start phase after pressing next", () => {
    render(<GamePage />);
    expect(screen.getByRole("button")).toHaveTextContent("Next");

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId("title")).toHaveTextContent("Place Start");
    expect(screen.queryByTestId("matrix-range")).not.toBeInTheDocument();
  });
  it("On place start phase shows a Board Game component", () => {
    render(<GamePage />);
    expect(screen.getByRole("button")).toHaveTextContent("Next");

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId("board")).toBeInTheDocument();
  });
});
