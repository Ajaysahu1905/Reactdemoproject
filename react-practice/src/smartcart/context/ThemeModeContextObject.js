import { createContext } from "react";

// Split out from ThemeModeContext.jsx: react-refresh/only-export-components
// requires files used by fast refresh to export components only, and
// createContext() itself isn't a component.
export const ThemeModeContext = createContext(null);
