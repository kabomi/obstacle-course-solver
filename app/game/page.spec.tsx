/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import GamePage from "./page";
import { GameStoreProvider } from "../providers/game.store-provider";

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
  beforeEach(() => {
    render(
    <GameStoreProvider>
      <GamePage />
    </GameStoreProvider>
    );
  });
  it("Renders Game Page", () => {
    expect(screen.getByTestId("title")).toHaveTextContent("Select Matrix Size");
  });
  it("Shows a next button", () => {
    expect(screen.getByRole("button")).toHaveTextContent("Next");
  });
  it("Shows matrix size slider", () => {
    expect(screen.getByTestId("matrix-range")).toBeInTheDocument();
  });
  it("Shows place start phase after pressing next", () => {
    expect(screen.getByRole("button")).toHaveTextContent("Next");

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId("title")).toHaveTextContent("Place Start");
    expect(screen.queryByTestId("matrix-range")).not.toBeInTheDocument();
  });
  describe("On place start phase", () => {
    it("Shows a Board Game component", () => {
      expect(screen.getByRole("button")).toHaveTextContent("Next");

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByTestId("game-board")).toBeInTheDocument();
    });
    it("disables next action", () => {
      expect(screen.getByRole("button")).toHaveTextContent("Next");

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});
