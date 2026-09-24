"use client";

import { useState } from "react";

// This is the ONLY client component needed for interactivity on the product
// detail page; everything else on that page is server-rendered. It is
// intentionally small so hydration cost stays minimal.
export default function AddToCartButton({ productName }) {
  const [quantity, setQuantity] = useState(0);

  const handleClick = () => setQuantity((q) => q + 1);

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Add to cart
      </button>
      {quantity > 0 && (
        <p role="status" aria-live="polite">
          Added! {productName} in cart: {quantity}
        </p>
      )}
    </div>
  );
}
