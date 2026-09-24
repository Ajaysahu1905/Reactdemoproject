import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Divider } from "@mui/material";
import { CartContext } from "../context/CartContextObject";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
});

function CheckoutPage() {
  const { items, cartTotal, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(checkoutSchema) });

  // The form is uncontrolled (react-hook-form owns field values); only the
  // submitted result is kept in state, for the "Order Placed!" text below.
  const [placedOrder, setPlacedOrder] = useState(null);

  function onSubmit(data) {
    setPlacedOrder(data);
    dispatch({ type: "CLEAR_CART" });
  }

  if (placedOrder) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 1.5 }}>
          Order Placed!
        </Typography>
        <Typography sx={{ mb: 2.5 }}>
          Thank you, {placedOrder.name}. Your order will be delivered to:{" "}
          {placedOrder.address}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <Typography color="text.secondary" sx={{ mb: 2.5 }}>
          Your cart is empty. Add some products before checking out.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/products")}>
          Go to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Checkout
      </Typography>

      <Paper sx={{ p: 2, mb: 2.5 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}
          >
            <Typography variant="body2">
              {item.title} x {item.quantity}
            </Typography>
            <Typography variant="body2">
              ₹{(item.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography fontWeight="bold">Total: ₹{cartTotal.toFixed(2)}</Typography>
        </Box>
      </Paper>

      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <TextField
          label="Full Name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Delivery Address"
          {...register("address")}
          error={!!errors.address}
          helperText={errors.address?.message}
        />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          Place Order
        </Button>
      </Paper>
    </Box>
  );
}

export default CheckoutPage;
