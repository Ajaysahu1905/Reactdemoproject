"use client";

// Next.js error boundary for the /products route segment. Must be a Client
// Component and export a default function accepting { error, reset }.
export default function ProductsError({ error, reset }) {
  return (
    <div style={{ maxWidth: 640, margin: "48px auto", padding: "0 24px" }}>
      <h2>Something went wrong loading products.</h2>
      <p>{error?.message || "An unexpected error occurred."}</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
