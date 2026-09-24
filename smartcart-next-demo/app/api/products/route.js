// Simple Route Handler exposing the product list as JSON, sourced from the
// same json-server (db.json) instance the sibling react-practice app uses.
import { getProducts } from "../../lib/products";

export async function GET() {
  return Response.json(await getProducts());
}
