import { useRef, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Alert } from "@mui/material";
import { loginUser } from "../store/authSlice";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

function LoginPage() {
  const usernameRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: loginError } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // register() returns RHF's own ref callback; this component also needs
  // its own ref for the focus-on-mount effect below, so the two are chained.
  const usernameField = register("username");

  // useLayoutEffect runs before paint (unlike useEffect), so the field is
  // focused in the first frame with zero flicker — fine here since it's fast, never for slow work like a fetch.
  useLayoutEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // Zod already rejects invalid fields before this runs, so onSubmit just
  // hands valid data to the thunk — its status/error state drives the UI.
  function onSubmit(data) {
    dispatch(loginUser(data))
      .unwrap()
      .then(() => navigate("/cart"))
      .catch(() => {
        // authSlice already recorded the rejection in state.auth.error.
      });
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 3.75,
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Login
        </Typography>

        {status === "failed" && <Alert severity="error">{loginError}</Alert>}

        <TextField
          label="Username"
          {...usernameField}
          inputRef={(el) => {
            usernameField.ref(el);
            usernameRef.current = el;
          }}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button type="submit" variant="contained" sx={{ mt: 1 }} disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Login"}
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;
