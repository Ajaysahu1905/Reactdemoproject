import { lazy, Suspense } from "react";
import { Box, Typography } from "@mui/material";
import ErrorBoundary from "./ErrorBoundary";
import LoadingSpinner from "./LoadingSpinner";
import { loadRecommendationsWidget } from "./loadRecommendationsWidget";

// Module Federation (Week 5 Day 3): the `recommendations` remote is only
// resolvable at runtime once smartcart-recommendations is built + served
// on port 4173 (see vite.config.js). React.lazy + dynamic import is what
// actually triggers loading the remote's JS bundle.
const RecommendationsWidget = lazy(loadRecommendationsWidget);

function RemoteUnavailableFallback() {
  return (
    <Box sx={{ py: 2 }}>
      <Typography color="text.secondary">
        Recommendations are temporarily unavailable.
      </Typography>
    </Box>
  );
}

function RemoteRecommendations({ currentProductId, onAddToCart }) {
  return (
    <ErrorBoundary fallback={<RemoteUnavailableFallback />}>
      <Suspense fallback={<LoadingSpinner />}>
        <RecommendationsWidget
          currentProductId={currentProductId}
          onAddToCart={onAddToCart}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export default RemoteRecommendations;
