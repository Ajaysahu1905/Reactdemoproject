import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import SuspenseProductList from "../components/SuspenseProductList";
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Box
        sx={{
          textAlign: "center",
          py: 7.5,
          px: 2.5,
          bgcolor: "secondary.main",
          color: "white",
          borderRadius: 2.5,
          mb: 3.75,
        }}
      >
        <Typography variant="h4" sx={{ mb: 1.25 }}>
          Welcome to SmartCart Pro
        </Typography>
        <Typography>Your one-stop shop for everything you need.</Typography>
        <Box sx={{ mt: 2.5 }}>
          <Button variant="contained" onClick={() => navigate("/products")}>
            Shop Now
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Featured Products
        </Typography>

        {/* SuspenseProductList reads data via use(); this <Suspense> boundary
            IS the loading state. ProductsPage/ProductDetailsPage keep the classic useFetch pattern for comparison. */}
        <Suspense fallback={<LoadingSpinner />}>
          <SuspenseProductList />
        </Suspense>
      </Box>
    </Box>
  );
}

export default HomePage;
