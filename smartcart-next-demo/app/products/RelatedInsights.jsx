// Streaming demo: this is an async Server Component that is deliberately
// slow. It is rendered inside a <Suspense> boundary in app/products/page.jsx,
// so the product grid can be sent to the browser immediately while this
// component's HTML streams in a couple of seconds later.
import { getProducts } from "../lib/products";
import styles from "./products.module.css";

export default async function RelatedInsights() {
  // Artificial delay for streaming demo only — remove/reduce in real apps.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const products = await getProducts();
  const counts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const trending = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <section className={styles.insights} aria-label="Related insights">
      <h2>Related Insights</h2>
      <p>Trending category: {trending}</p>
      <p>
        This section streamed in ~2 seconds after the rest of the page —
        thanks to React Suspense + Server Components streaming.
      </p>
    </section>
  );
}
