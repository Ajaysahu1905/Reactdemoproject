// SSR demo: this page is dynamically rendered per-request on the server.
// It is an async Server Component (no useEffect/useState needed to load
// data) and also demonstrates Streaming via the <Suspense>-wrapped
// RelatedInsights component below, which resolves slower than the main list.
import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "../lib/products";
import RelatedInsights from "./RelatedInsights";
import styles from "./products.module.css";

export const metadata = {
  title: "Products — SmartCart Next Demo",
  description: "Server-side rendered product catalog.",
};

// Force per-request rendering so this route is a true SSR example rather
// than being static-optimized at build time (there's no per-request data
// here otherwise, so Next.js would default to prerendering it once).
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className={styles.wrapper}>
      <p className={styles.banner}>Rendered on the server</p>
      <h1>Products</h1>
      <p>
        This list is fetched and rendered entirely on the server for every
        request (SSR). View source to confirm the HTML already contains the
        product data — no client-side fetch is required.
      </p>

      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id} className={styles.card}>
            <Link href={`/products/${product.id}`}>{product.name}</Link>
            <span className={styles.category}>{product.category}</span>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <Suspense
        fallback={
          <p role="status" aria-live="polite">
            Loading related insights&hellip;
          </p>
        }
      >
        <RelatedInsights />
      </Suspense>

      <p>
        <Link href="/products/isr-demo">See the ISR demo &rarr;</Link>
      </p>
    </div>
  );
}
