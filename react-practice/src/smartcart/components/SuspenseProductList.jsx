import { use } from "react";
import { Grid } from "@mui/material";
import { getProductsResource } from "../data/productsResource";
import ProductCard from "./ProductCard";

// How many products the "Featured Products" section shows.
const FEATURED_COUNT = 4;

// use() unwraps a promise during render — if it's still pending it
// throws, and the nearest <Suspense> shows its fallback until it resolves.
// ProductsPage/ProductDetailsPage still use the classic useFetch pattern for comparison.
function SuspenseProductList() {
  const products = use(getProductsResource());

  // The resource fetches the whole list; slicing happens here rather than in the fetch.
  const featuredProducts = products.slice(0, FEATURED_COUNT);

  // Reuses ProductCard, so featured items behave like the ones on the Products page.
  return (
    <Grid container spacing={2.25}>
      {featuredProducts.map((product) => (
        <Grid key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

export default SuspenseProductList;
