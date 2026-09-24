import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";

// The remote isn't available in a test run, so we mock the loader module
// that wraps the Module Federation dynamic import. This proves the host's
// loading + error handling without needing smartcart-recommendations
// built or served on port 4173.
vi.mock("./loadRecommendationsWidget", () => ({
  loadRecommendationsWidget: vi.fn(),
}));

describe("RemoteRecommendations", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("shows a loading fallback before the remote resolves, then renders it", async () => {
    const { loadRecommendationsWidget } = await import(
      "./loadRecommendationsWidget"
    );
    loadRecommendationsWidget.mockResolvedValue({
      default: function MockRecommendationsWidget({ onAddToCart }) {
        return (
          <div>
            <h2>Recommended Products</h2>
            <button onClick={() => onAddToCart({ id: 99, price: 10 })}>
              Add to Cart
            </button>
          </div>
        );
      },
    });

    const { default: RemoteRecommendations } = await import(
      "./RemoteRecommendations"
    );

    renderWithProviders(
      <RemoteRecommendations currentProductId={1} onAddToCart={vi.fn()} />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Recommended Products")).toBeInTheDocument()
    );
  });

  it("shows a safe fallback message when the remote fails to load", async () => {
    const { loadRecommendationsWidget } = await import(
      "./loadRecommendationsWidget"
    );
    loadRecommendationsWidget.mockRejectedValue(
      new Error("Remote unavailable")
    );

    const { default: RemoteRecommendations } = await import(
      "./RemoteRecommendations"
    );

    renderWithProviders(
      <RemoteRecommendations currentProductId={1} onAddToCart={vi.fn()} />
    );

    await waitFor(() =>
      expect(
        screen.getByText(/recommendations are temporarily unavailable/i)
      ).toBeInTheDocument()
    );
  });
});
