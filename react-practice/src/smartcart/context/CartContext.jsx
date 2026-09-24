import { useReducer, useEffect } from "react";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CartContext } from "./CartContextObject";

export function CartProvider({ children }) {
  // useLocalStorage now owns loading/saving the cart — CartContext
  // no longer talks to localStorage directly.
  const [storedItems, setStoredItems] = useLocalStorage(
    "smartcart_items",
    initialCartState.items
  );

  const [state, dispatch] = useReducer(cartReducer, { items: storedItems });

  // Hands the new items array to useLocalStorage, which persists it internally.
  useEffect(() => {
    setStoredItems(state.items);
  }, [state.items]);

  const cartCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    items: state.items,
    cartCount,
    cartTotal,
    dispatch,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
