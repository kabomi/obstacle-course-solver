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
    expect(screen.getByRole("heading")).toHaveTextContent("Select Matrix Size");
  });
  it("Shows a next button", () => {
    render(<GamePage />);
    expect(screen.getByRole("button")).toHaveTextContent("Next");
  });
  it("Navigates to placement phase after pressing next", () => {
    render(<GamePage />);
    expect(screen.getByRole("button")).toHaveTextContent("Next");
    fireEvent.click(screen.getByRole("button"));
    expect(mockPush).toHaveBeenCalledWith("/game/placement")
  });
});
