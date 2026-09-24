import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import ProductCard from "./ProductCard";

const product = {
  id: 1,
  title: "Wireless Mouse",
  category: "Electronics",
  price: 799,
  image: "/mouse.png",
};

describe("ProductCard", () => {
  it("shows the product name and price", () => {
    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("₹799.00")).toBeInTheDocument();
  });

  it("adds the product to the cart when Add to Cart is clicked", () => {
    const dispatch = vi.fn();
    renderWithProviders(<ProductCard product={product} />, {
      cartValue: { items: [], cartCount: 0, cartTotal: 0, dispatch },
    });

    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "ADD_TO_CART",
      payload: product,
    });
  });

  it("shows quantity controls once the product is already in the cart", () => {
    renderWithProviders(<ProductCard product={product} />, {
      cartValue: {
        items: [{ ...product, quantity: 2 }],
        cartCount: 2,
        cartTotal: 1598,
        dispatch: vi.fn(),
      },
    });

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add to cart/i })
    ).not.toBeInTheDocument();
  });
});
