import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeModeProvider } from "./context/ThemeModeContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/global.css";
import "./styles/ErrorBoundary.css";

function SmartCartApp() {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <ErrorBoundary>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </ErrorBoundary>
      </ThemeModeProvider>
    </Provider>
  );
}

export default SmartCartApp;
