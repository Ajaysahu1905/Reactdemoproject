import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import authReducer from "../smartcart/store/authSlice";
import { CartContext } from "../smartcart/context/CartContextObject";
import { getTheme } from "../smartcart/theme/theme";

// Shared test render helper: wraps a component with every provider real
// pages expect (Redux store, MUI theme, router, cart context) so tests
// exercise components the same way the app does, not in isolation.
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    }),
    cartValue = { items: [], cartCount: 0, cartTotal: 0, dispatch: () => {} },
    route = "/",
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={getTheme("light")}>
          <CssBaseline />
          <CartContext.Provider value={cartValue}>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </CartContext.Provider>
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
