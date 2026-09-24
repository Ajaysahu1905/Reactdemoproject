import { memo } from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

// memo() skips re-rendering when props are unchanged — but only works because
// ProductsPage wraps onCategoryChange in useCallback; a fresh function reference would defeat it.
function CategoryFilterBar({ categories, activeCategory, onCategoryChange }) {
  console.log("CategoryFilterBar rendered");

  function handleChange(_event, newCategory) {
    // Exclusive mode reports null when the active button is clicked again —
    // ignore that instead of clearing the filter.
    if (newCategory !== null) {
      onCategoryChange(newCategory);
    }
  }

  return (
    <ToggleButtonGroup
      value={activeCategory}
      exclusive
      onChange={handleChange}
      sx={{ mb: 2.5, flexWrap: "wrap" }}
    >
      {categories.map((cat) => (
        <ToggleButton key={cat} value={cat}>
          {cat}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default memo(CategoryFilterBar);
