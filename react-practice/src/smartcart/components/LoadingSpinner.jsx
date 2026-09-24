import { Box, CircularProgress, Typography } from "@mui/material";

function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 8,
      }}
    >
      <CircularProgress sx={{ mb: 1.5 }} />
      <Typography variant="body2">Loading...</Typography>
    </Box>
  );
}

export default LoadingSpinner;
