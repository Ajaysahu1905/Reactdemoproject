import productsData from "../../db.json";

// Converts the db.json product format into the format
// used by the Next.js SmartCart application.
function toProduct(raw) {
  return {
    id: String(raw.id),
    name: raw.title,
    price: raw.price,
    description: raw.description,
    category: raw.category,
    image: raw.image,
  };
}

// Returns all products.
export async function getProducts() {
  return productsData.products.map(toProduct);
}

// Returns a single product by id.
// Returns null when the product does not exist.
export async function getProductById(id) {
  const product = productsData.products.find(
    (item) => String(item.id) === String(id)
  );

  return product ? toProduct(product) : null;
}