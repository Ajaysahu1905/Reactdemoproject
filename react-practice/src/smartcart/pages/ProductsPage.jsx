import { useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Grid, Typography, Alert, Button } from "@mui/material";
import { useFetch } from "../hooks/useFetch";
import ProductCard from "../components/ProductCard";
import CategoryFilterBar from "../components/CategoryFilterBar";
import SearchBox from "../components/SearchBox";
import LoadingSpinner from "../components/LoadingSpinner";

const categories = ["All", "Electronics", "Fashion", "Home", "Accessories"];

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchBoxRef = useRef(null);

  const searchTerm = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";

  // useFetch (custom hook) replaces the manual useState + useEffect
  // fetch code that used to live directly in this component.
  const { data, loading, error } = useFetch("/products");
  const allProducts = data || [];

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (value) {
        updated.set("search", value);
      } else {
        updated.delete("search");
      }
      return updated;
    });
  }

  // useCallback keeps this function reference stable across renders, so
  // memo() on CategoryFilterBar can skip re-rendering — a new reference each render would defeat it.
  const handleCategoryChange = useCallback(
    (cat) => {
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev);
        if (cat === "All") {
          updated.delete("category");
        } else {
          updated.set("category", cat);
        }
        return updated;
      });
    },
    [setSearchParams]
  );

  function handleFocusSearch() {
    // forwardRef + useImperativeHandle let SearchBox expose just .focus(),
    // so this component doesn't need the raw DOM node.
    searchBoxRef.current.focus();
  }

  // useMemo recalculates only when allProducts/searchTerm/category change —
  // matters more once filtering involves thousands of rows.
  const filteredProducts = useMemo(() => {
    console.log("Recalculating filteredProducts...");
    return allProducts.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, category]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Our Products
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <SearchBox
            ref={searchBoxRef}
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
        </Box>
        <Button variant="outlined" onClick={handleFocusSearch}>
          Search
        </Button>
      </Box>

      <CategoryFilterBar
        categories={categories}
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
      />

      <Grid container spacing={2.25}>
        {filteredProducts.map((product) => (
          <Grid key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2.5 }}>
          No products found.
        </Typography>
      )}
    </Box>
  );
}

export default ProductsPage;
