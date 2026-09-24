import { createContext } from "react";

// Split out from CartContext.jsx: react-refresh/only-export-components
// requires files used by fast refresh to export components only, and
// createContext() itself isn't a component.
export const CartContext = createContext(null);
