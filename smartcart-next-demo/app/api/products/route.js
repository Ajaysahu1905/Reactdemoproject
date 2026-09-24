import { getProducts } from "../../lib/products";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://smartcart-react-app.vercel.app",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  const products = await getProducts();

  return Response.json(products, {
    headers: corsHeaders,
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
``