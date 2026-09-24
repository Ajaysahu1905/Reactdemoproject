import { getProductById } from "../../../lib/products";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://smartcart-react-app.vercel.app",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(request, { params }) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return Response.json(
      { message: "Product not found" },
      {
        status: 404,
        headers: corsHeaders,
      }
    );
  }

  return Response.json(product, {
    headers: corsHeaders,
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}