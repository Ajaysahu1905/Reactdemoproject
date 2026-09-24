// Fetches from the same json-server instance the sibling "react-practice"
// Vite app uses (npm run server -> json-server --watch db.json --port 3001),
// so both apps read the exact same product data.
const API_BASE = process.env.PRODUCTS_API_URL || "http://localhost:3001";

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

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  const raw = await res.json();
  return raw.map(toProduct);
}

export async function getProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, { cache: "no-store" });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}: ${res.status}`);
  }
  return toProduct(await res.json());
}
