import { useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getTheme } from "../theme/theme";
import { ThemeModeContext } from "./ThemeModeContextObject";

export function ThemeModeProvider({ children }) {
  // Reuses the same useLocalStorage hook CartContext relies on,
  // so the chosen mode survives a page refresh.
  const [mode, setMode] = useLocalStorage("smartcart_theme_mode", "light");

  function toggleMode() {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }

  // useMemo: createTheme() builds a fairly large object graph — this
  // avoids rebuilding it on every render, only when `mode` actually flips.
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline resets browser defaults and applies the theme's
            background/text to <body> — global.css's resets stay for the few plain-HTML pages. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
