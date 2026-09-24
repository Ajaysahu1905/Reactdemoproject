import { Link } from "react-router-dom";
import { useContext, memo } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartContext } from "../context/CartContextObject";
import PriceTag from "./PriceTag";

function ProductCard({ product }) {
  const { items, dispatch } = useContext(CartContext);

  const cartItem = items.find((item) => item.id === product.id);

  function handleAddToCart() {
    dispatch({ type: "ADD_TO_CART", payload: product });
  }

  function handleIncrease() {
    dispatch({ type: "INCREASE_QUANTITY", payload: product });
  }

  function handleDecrease() {
    dispatch({ type: "DECREASE_QUANTITY", payload: product });
  }

  return (
    <Card sx={{ width: 220, display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        src={product.image}
        alt={product.title}
        sx={{ height: 150, objectFit: "contain", p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ height: 40, overflow: "hidden" }}>
          {product.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {product.category}
        </Typography>
        <PriceTag variant="subtitle1">₹{product.price.toFixed(2)}</PriceTag>
      </CardContent>

      <CardActions sx={{ flexDirection: "column", alignItems: "stretch", gap: 1, px: 2, pb: 2 }}>
        <Button component={Link} to={`/products/${product.id}`} variant="outlined" size="small">
          View Details
        </Button>

        {cartItem ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <IconButton size="small" color="primary" onClick={handleDecrease}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography fontWeight="bold">{cartItem.quantity}</Typography>
            <IconButton size="small" color="primary" onClick={handleIncrease}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Button variant="contained" size="small" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

// memo() skips re-rendering when `product` is unchanged, but this component
// also reads CartContext directly, so it still re-renders on any cart change.
export default memo(ProductCard);
