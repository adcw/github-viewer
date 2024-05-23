import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GHAccessTokenProvider from "../github-utils/GHAccessTokenProvider";
import { useGithubAccessToken } from "../github-utils/GHAccessTokenProvider";

// Mock component to use the context
const TestComponent = () => {
  const { openModal } = useGithubAccessToken();
  return <button onClick={openModal}>Open Modal</button>;
};

describe("GHAccessTokenProvider", () => {
  it("shows error message on invalid token submission", async () => {
    render(
      <GHAccessTokenProvider>
        <TestComponent />
      </GHAccessTokenProvider>
    );

    fireEvent.click(screen.getByText("Open Modal"));

    const input = screen.getByLabelText(/Please enter your GitHub API key:/i);
    fireEvent.change(input, { target: { value: "invalid_token" } });

    fireEvent.click(screen.getByText("Ok"));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid API key. Try again.")
      ).toBeInTheDocument();
    });
  });
});
