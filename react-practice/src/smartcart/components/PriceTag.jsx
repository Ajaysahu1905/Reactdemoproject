import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// A styled() example: ProductCard/ProductDetailsPage both repeated bold+primary
// price styling inline — PriceTag centralizes it once, still behaving like a normal Typography.
const PriceTag = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightBold,
}));

export default PriceTag;
