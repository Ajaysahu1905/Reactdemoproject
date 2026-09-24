import productsData from "../../db.json";

// Returns all products in the same format as db.json.
export async function getProducts() {
  return productsData.products;
}

// Returns a single product by id.
// Returns null if the product does not exist.
export async function getProductById(id) {
  const product = productsData.products.find(
    (item) => String(item.id) === String(id)
  );

  return product || null;
}