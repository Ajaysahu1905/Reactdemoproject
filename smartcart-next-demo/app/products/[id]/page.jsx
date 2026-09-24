// SSR demo (primary strategy shown here): `force-dynamic` forces this page
// to be rendered fresh on every request, even though generateStaticParams
// (below) is present. We do this deliberately so the page always reflects
// the latest data and so this route can clearly demonstrate request-time
// SSR without being confused with the SSG example.
//
// If `force-dynamic` were removed, having generateStaticParams here with no
// other dynamic config would make Next.js prerender each id at BUILD TIME
// (i.e. SSG) instead. Combining generateStaticParams with
// `export const revalidate = 60` (and no force-dynamic) is what produces
// ISR — see app/products/isr-demo/page.jsx for a page that actually does
// this, since force-dynamic and revalidate-based caching are contradictory
// on the same page.
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "../../lib/products";
import AddToCartButton from "../../components/AddToCartButton";
import styles from "../products.module.css";

export const dynamic = "force-dynamic";

// SSG mechanism: generateStaticParams tells Next.js which [id] values exist
// so it *could* prerender them at build time. Here it just documents the
// mechanism; `dynamic = "force-dynamic"` above overrides it for this route
// so every request is still rendered live (SSR).
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product not found — SmartCart Next Demo" };
  }

  return {
    title: `${product.name} — SmartCart Next Demo`,
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
      <p className={styles.banner}>Rendered on the server (force-dynamic)</p>
      <h1>{product.name}</h1>
      <p className={styles.category}>{product.category}</p>
      <p className={styles.price}>${product.price.toFixed(2)}</p>
      <p>{product.description}</p>
      <AddToCartButton productName={product.name} />
    </div>
  );
}
