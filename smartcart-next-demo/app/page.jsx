// Home page — plain Server Component (no "use client", no data fetching).
// This page itself doesn't demonstrate a specific rendering strategy beyond
// "rendered on the server by default"; it's a landing page that explains
// the four strategies covered by the rest of this demo app.
import Link from "next/link";
import styles from "./page.module.css";

const strategies = [
  {
    title: "CSR — Client-Side Rendering",
    tag: "sibling app",
    body:
      'The sibling Vite app "react-practice" is the CSR example: an empty HTML shell ships first, then JavaScript runs in the browser to fetch data and render the UI.',
  },
  {
    title: "SSR — Server-Side Rendering",
    tag: "/products and /products/[id]",
    body:
      "Each request is rendered fresh on the server. See app/products/page.jsx and app/products/[id]/page.jsx (force-dynamic).",
  },
  {
    title: "SSG — Static Site Generation",
    tag: "generateStaticParams",
    body:
      "Pages are rendered once at build time into static HTML. app/products/[id]/page.jsx exports generateStaticParams to show the mechanism SSG relies on.",
  },
  {
    title: "ISR — Incremental Static Regeneration",
    tag: "/products/isr-demo",
    body:
      "A static page that automatically regenerates in the background after a revalidation window. See app/products/isr-demo/page.jsx (revalidate = 60).",
  },
  {
    title: "Streaming",
    tag: "/products",
    body:
      "The /products page renders its main content immediately and streams in a slower section (RelatedInsights) inside a Suspense boundary.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>SmartCart Next Demo</h1>
        <p>
          This is a standalone Next.js (App Router) application built for{" "}
          <strong>Week 5, Day 1–2: SSR / SSG / ISR / Streaming</strong>. It
          lives next to, and does not replace, the existing Vite CSR app{" "}
          <strong>&quot;react-practice&quot;</strong>. That Vite app renders
          entirely in the browser (CSR); this Next.js app demonstrates the
          server-driven rendering strategies for comparison.
        </p>

        <section aria-labelledby="strategies-heading" className={styles.grid}>
          <h2 id="strategies-heading" className={styles.srOnly}>
            Rendering strategies
          </h2>
          {strategies.map((s) => (
            <article key={s.title} className={styles.card}>
              <h3>{s.title}</h3>
              <p className={styles.tag}>{s.tag}</p>
              <p>{s.body}</p>
            </article>
          ))}
        </section>

        <p>
          <Link href="/products">View the products demo &rarr;</Link>
        </p>
      </main>
    </div>
  );
}
