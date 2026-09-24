import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Tooltip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { logout } from "../store/authSlice";
import { CartContext } from "../context/CartContextObject";
import { ThemeModeContext } from "../context/ThemeModeContextObject";

// color="secondary" maps to the theme's navy (see theme/theme.js).
// Auth comes from Redux (authSlice); CartContext below stays Context + useReducer on purpose, for comparison.
function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const dispatch = useDispatch();
  const { cartCount } = useContext(CartContext);
  const { mode, toggleMode } = useContext(ThemeModeContext);
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <AppBar position="static" color="secondary">
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: "inherit", textDecoration: "none", fontWeight: "bold" }}
        >
          SmartCart Pro
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/products" color="inherit">
            Products
          </Button>

          <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>

          {/* "secondary" is now navy (would be invisible on the navy
              AppBar), so this uses "error" (red) instead. */}
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Hi, {user.username}
              </Typography>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" color="inherit" variant="outlined">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
