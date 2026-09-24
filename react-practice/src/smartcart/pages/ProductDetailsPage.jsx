import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartContext } from "../context/CartContextObject";
import { useFetch } from "../hooks/useFetch";
import LoadingSpinner from "../components/LoadingSpinner";
import PriceTag from "../components/PriceTag";
import RemoteRecommendations from "../components/RemoteRecommendations";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, dispatch } = useContext(CartContext);

  // Passing `id` in the URL means useFetch's effect (dependency [url])
  // automatically refetches whenever the route param changes.
  const { data: product, loading, error } = useFetch(`/products/${id}`);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Box>
    );
  }

  if (!product) {
    return null;
  }

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

  function handleAddRecommendedToCart(recommendedProduct) {
    dispatch({ type: "ADD_TO_CART", payload: recommendedProduct });
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2.5 }}
      >
        Back
      </Button>

      <Paper sx={{ display: "flex", gap: 3.75, flexWrap: "wrap", p: 2.5 }}>
        <Box
          component="img"
          src={product.image}
          alt={product.title}
          sx={{ width: 250, height: 250, objectFit: "contain" }}
        />
        <Box sx={{ flex: 1, minWidth: 250 }}>
          <Typography variant="h5">{product.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
          <PriceTag variant="h6">₹{product.price.toFixed(2)}</PriceTag>
          <Typography sx={{ mt: 1.5 }}>{product.description}</Typography>

          {cartItem ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 1.5 }}>
              <IconButton color="primary" onClick={handleDecrease}>
                <RemoveIcon />
              </IconButton>
              <Typography fontWeight="bold">{cartItem.quantity}</Typography>
              <IconButton color="primary" onClick={handleIncrease}>
                <AddIcon />
              </IconButton>
            </Box>
          ) : (
            <Button variant="contained" sx={{ mt: 1.5 }} onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </Box>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <RemoteRecommendations
          currentProductId={product.id}
          onAddToCart={handleAddRecommendedToCart}
        />
      </Box>
    </Box>
  );
}

export default ProductDetailsPage;
