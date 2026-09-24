import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { CartContext } from "../context/CartContextObject";
import CartItem from "../components/CartItem";

function CartPage() {
  const { items, cartTotal, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  // Clicking Clear Cart used to wipe the cart instantly with no way back —
  // this Dialog adds a confirmation step first.
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleClearCart() {
    dispatch({ type: "CLEAR_CART" });
    setConfirmOpen(false);
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your Cart
      </Typography>

      {items.length === 0 ? (
        <Typography color="text.secondary">Your cart is empty.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2.5,
            }}
          >
            <Typography variant="h6">Total: ${cartTotal.toFixed(2)}</Typography>
            <Box sx={{ display: "flex", gap: 1.25 }}>
              <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
                Clear Cart
              </Button>
              <Button variant="contained" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
            </Box>
          </Box>
        </>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Clear cart?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove all items from your cart. This can't be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CartPage;
