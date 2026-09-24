import { createTheme } from "@mui/material/styles";

// Centralizes the brand colors once instead of duplicating hex codes
// across CSS files: accent blue (buttons, prices) and navy (Navbar/hero). Both stay fixed across light/dark mode.
export function getTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#2f6fed",
        dark: "#1f56c9", // was a separate `button:hover` rule in global.css
      },
      secondary: {
        main: "#1a1a2e",
      },
      ...(mode === "light" && {
        background: {
          default: "#f4f5f7",
          paper: "#ffffff",
        },
      }),
      // No background override for dark mode — MUI's own dark
      // defaults (#121212 / #1e1e1e) are used as-is.
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: "Arial, Helvetica, sans-serif",
    },
  });
}
