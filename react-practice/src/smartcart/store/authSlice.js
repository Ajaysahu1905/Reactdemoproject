import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const STORAGE_KEY = "smartcart_user";

function loadStoredUser() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

function persistUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// No real backend auth exists here — this thunk simulates a real async
// login (delay + validation + rejectWithValue) so createAsyncThunk's pending/fulfilled/rejected lifecycle has something genuine to drive.
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!username || !password) {
      return rejectWithValue("Please enter both username and password.");
    }

    const token = `demo-token.${username}.${Date.now()}`;
    const user = { username, token };
    persistUser(user);
    return user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Rehydrated on store creation so a refresh doesn't log the user out.
    user: loadStoredUser(),
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      persistUser(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed.";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
