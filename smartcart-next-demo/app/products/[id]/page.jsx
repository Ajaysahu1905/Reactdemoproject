// SSR demo: force-dynamic makes this page render fresh on every request.
// generateStaticParams shows how dynamic product routes can be generated,
// while String(product.id) ensures Next.js receives the route id as a string.

import { notFound } from "next/navigation";
import { getProductById, getProducts } from "../../lib/products";
import AddToCartButton from "../../components/AddToCartButton";
import styles from "../products.module.css";

export const dynamic = "force-dynamic";

// Provides valid product IDs for the dynamic [id] route.
// Dynamic route parameters must be strings.
export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    id: String(product.id),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product not found — SmartCart Next Demo",
    };
  }

  return {
    title: `${product.title} — SmartCart Next Demo`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.banner}>
        Rendered on the server (force-dynamic)
      </p>

      <h1>{product.title}</h1>

      <p className={styles.category}>
        {product.category}
      </p>

      <p className={styles.price}>
        ${product.price.toFixed(2)}
      </p>

      <p>{product.description}</p>

      <AddToCartButton productName={product.title} />
    </div>
  );
}