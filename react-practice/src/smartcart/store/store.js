import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// CartContext's useReducer stays as-is — this store only holds auth,
// the piece that genuinely needed createAsyncThunk's loading/error lifecycle.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
