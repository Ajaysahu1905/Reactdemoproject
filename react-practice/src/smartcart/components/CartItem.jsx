import { useContext, memo } from "react";
import {
  TableRow,
  TableCell,
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { CartContext } from "../context/CartContextObject";

function CartItem({ item }) {
  const { dispatch } = useContext(CartContext);

  function handleIncrease() {
    dispatch({ type: "INCREASE_QUANTITY", payload: item });
  }

  function handleDecrease() {
    dispatch({ type: "DECREASE_QUANTITY", payload: item });
  }

  function handleRemove() {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  }

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar src={item.image} alt={item.title} variant="rounded" sx={{ width: 56, height: 56 }} />
          <Typography variant="body2">{item.title}</Typography>
        </Box>
      </TableCell>
      <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
      <TableCell align="center">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <IconButton size="small" color="primary" onClick={handleDecrease}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography fontWeight="bold">{item.quantity}</Typography>
          <IconButton size="small" color="primary" onClick={handleIncrease}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
      <TableCell align="right">
        <Button
          size="small"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={handleRemove}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}

// memo() means only the row whose `item` actually changed re-renders —
// not every row in the cart table.
export default memo(CartItem);
