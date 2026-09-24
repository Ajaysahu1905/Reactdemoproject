// ISR demo: Incremental Static Regeneration. This page is statically
// generated like SSG, but `revalidate = 60` tells Next.js it may serve the
// cached HTML for up to 60 seconds before regenerating it in the background
// on the next request after that window — visitors keep getting a fast,
// static response while the content still stays reasonably fresh, without
// a full rebuild/redeploy.
//
// This is kept as its own page (separate from app/products/[id]/page.jsx)
// because that page uses `dynamic = "force-dynamic"` for a clean SSR demo;
// force-dynamic and revalidate-based static caching are contradictory on
// the same route.
import { getProducts } from "../../lib/products";
import styles from "../products.module.css";

export const revalidate = 60;

export default async function IsrDemoPage() {
  const products = await getProducts();
  const generatedAt = new Date().toISOString();

  return (
    <div className={styles.wrapper}>
      <p className={styles.banner}>ISR — revalidate = 60</p>
      <h1>ISR Demo</h1>
      <p>
        This page was statically generated and will be regenerated at most
        once every 60 seconds. The timestamp below only changes after the
        revalidation window elapses and a new request triggers a rebuild of
        this page in the background.
      </p>
      <p>
        <strong>Generated at:</strong> {generatedAt}
      </p>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id} className={styles.card}>
            <span>{product.name}</span>
            <span className={styles.category}>{product.category}</span>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
