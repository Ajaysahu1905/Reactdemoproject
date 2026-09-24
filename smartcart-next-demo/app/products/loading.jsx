// Automatic Suspense fallback Next.js shows for /products (and nested
// routes) while the server component tree above is still rendering.
import styles from "./products.module.css";

export default function ProductsLoading() {
  return (
    <div className={styles.skeleton} role="status" aria-live="polite">
      <span className={styles.visuallyHidden}>Loading products...</span>
      <div className={styles.skeletonGrid} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>
    </div>
  );
}
