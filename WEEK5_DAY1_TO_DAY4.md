# Week 5 (Day 1–4) — SSR, Micro Frontends & Testing

This document covers the Week 5 Day 1–4 additions built around the existing
SmartCart app. **No TypeScript was installed or configured anywhere in this
work** — all three projects (`react-practice`, `smartcart-next-demo`,
`smartcart-recommendations`) are pure JavaScript/JSX, intentionally, because
the existing SmartCart codebase is JS/JSX and mixing in TypeScript would
have meant a second toolchain for no benefit to this learning exercise.

## 1. The existing app: react-practice (CSR host)

`react-practice` is a Vite + React SPA. Vite's `vite build` produces a
static bundle with no server rendering step — every page is rendered in the
browser after the JS bundle loads and calls the API (`json-server` on port
3001). This is CSR (Client-Side Rendering).

## 2. Why SSR can't just be "added" to a Vite CSR app

SSR needs a server process that runs your React tree per-request and
returns HTML. Vite's dev/build pipeline for a plain React SPA has no such
server — `vite build` only emits static assets for a CDN/static host.
Retrofitting SSR onto this exact app would mean replacing the router,
the data-fetching pattern, and the build/deploy pipeline — effectively a
different framework, not a feature addition. So instead of migrating
SmartCart, a **separate, small Next.js app** (`smartcart-next-demo`) was
built next to it, on its own port, to demonstrate the concept without
touching or risking the existing app.

## 3. Server Component vs Client Component

- **Server Component** (default in the Next.js App Router): runs only on
  the server, can be `async`, can read data directly (no `useEffect`), and
  sends only HTML + a small serialized description to the browser — no
  component JS for it ships to the client.
- **Client Component** (`"use client"` at the top of the file): runs in
  the browser, can use `useState`/`useEffect`/event handlers.

In `smartcart-next-demo`, only [`app/components/AddToCartButton.jsx`](smartcart-next-demo/app/components/AddToCartButton.jsx)
is a Client Component — everything else (`page.jsx`, `products/page.jsx`,
`products/[id]/page.jsx`) is a Server Component.

## 4. SSR vs SSG vs ISR (in this repo)

| Page | Strategy | How |
|---|---|---|
| [`app/products/page.jsx`](smartcart-next-demo/app/products/page.jsx) | **SSR** | `force-dynamic` — rendered fresh on every request |
| [`app/products/[id]/page.jsx`](smartcart-next-demo/app/products/[id]/page.jsx) | **SSR** | `dynamic = 'force-dynamic'`, plus `generateStaticParams` shown/commented as the mechanism that would make this SSG if the dynamic flag were removed |
| [`app/products/isr-demo/page.jsx`](smartcart-next-demo/app/products/isr-demo/page.jsx) | **ISR** | `export const revalidate = 60` — served from cache, regenerated at most once every 60s |
| `/` (`app/page.jsx`) | **SSG** | static, prerendered at build time (no dynamic data) |

## 5. Streaming and Suspense

[`app/products/RelatedInsights.jsx`](smartcart-next-demo/app/products/RelatedInsights.jsx)
is an `async` Server Component with a deliberate 2-second delay (commented
as artificial, for this demo only). It's wrapped in a `<Suspense>` boundary
inside `app/products/page.jsx`, so the product grid renders and is visible
immediately, while the delayed section streams in ~2s later without
blocking the rest of the page. [`app/products/loading.jsx`](smartcart-next-demo/app/products/loading.jsx)
provides the route-level loading skeleton, and [`app/products/error.jsx`](smartcart-next-demo/app/products/error.jsx)
is the client-side error boundary with a retry button.

## 6. Module Federation: host vs remote

- **Remote** (`smartcart-recommendations`): a standalone Vite app that
  *exposes* one component (`./RecommendationsWidget`) as a federated
  module via `@module-federation/vite`. It owns its own mock data and
  never imports anything from the host — it only receives `currentProductId`
  and `onAddToCart` as props.
- **Host** (`react-practice`): *consumes* that remote at runtime via
  `React.lazy(() => import("recommendations/RecommendationsWidget"))`.
  React and ReactDOM are shared as **singletons** between host and remote
  so there is only one React instance in the page, avoiding "invalid hook
  call" errors from duplicate React copies.

The host never bundles the remote's code at build time — it only knows the
remote's URL (`http://localhost:4173/remoteEntry.js`), fetched at runtime.

## 7. Final folder structure

```
ReactJsGSK/
├── react-practice/                     ← existing Vite SPA, now also the MF host
│   ├── vite.config.js                  ← federation() host config + vitest config
│   ├── src/
│   │   ├── smartcart/
│   │   │   ├── components/
│   │   │   │   ├── RemoteRecommendations.jsx      ← NEW: lazy-loads the remote
│   │   │   │   ├── loadRecommendationsWidget.js   ← NEW: isolates the MF import
│   │   │   │   ├── ErrorBoundary.jsx              ← MODIFIED: optional `fallback` prop
│   │   │   │   ├── ProductCard.jsx / .test.jsx    ← NEW test
│   │   │   │   ├── ProtectedRoute.jsx / .test.jsx ← NEW test
│   │   │   │   └── RemoteRecommendations.test.jsx ← NEW test
│   │   │   ├── context/
│   │   │   │   ├── CartContext.jsx                ← MODIFIED: imports context object
│   │   │   │   ├── CartContextObject.js           ← NEW: split out createContext()
│   │   │   │   ├── ThemeModeContext.jsx           ← MODIFIED: same split
│   │   │   │   └── ThemeModeContextObject.js       ← NEW
│   │   │   ├── hooks/useFetch.js                  ← MODIFIED: fixed set-state-in-effect lint error
│   │   │   └── pages/ProductDetailsPage.jsx        ← MODIFIED: renders <RemoteRecommendations>
│   │   └── test/
│   │       ├── setupTests.js                       ← NEW: jest-dom + localStorage polyfill
│   │       └── renderWithProviders.jsx              ← NEW: shared test render helper
│   └── package.json                                 ← added test/test:run scripts + devDeps
│
├── smartcart-next-demo/                ← NEW: Next.js SSR/SSG/ISR/Streaming demo (port 3001)
│   └── app/
│       ├── page.jsx                     (CSR/SSR/SSG/ISR explainer, links to /products)
│       ├── lib/products.js              (local mock data, no external API)
│       ├── products/
│       │   ├── page.jsx                 (SSR, streams RelatedInsights)
│       │   ├── RelatedInsights.jsx      (delayed async Server Component)
│       │   ├── loading.jsx / error.jsx
│       │   ├── isr-demo/page.jsx        (ISR)
│       │   └── [id]/page.jsx            (SSR detail page, generateStaticParams, metadata)
│       ├── components/AddToCartButton.jsx  ("use client")
│       └── api/products/route.js        (GET route handler)
│
└── smartcart-recommendations/          ← NEW: Module Federation remote (port 4173)
    ├── vite.config.js                   (federation() remote config, exposes widget)
    └── src/components/RecommendationsWidget.jsx  (own mock data, props-only API)
```

## 8. Ports

| App | Port | Command |
|---|---|---|
| react-practice (Vite dev) | 5173 | `npm run dev` |
| react-practice (json-server mock API) | 3001 | `npm run server` |
| smartcart-next-demo | 3001* | `npm run dev` / `npm start` |
| smartcart-recommendations (remote, preview) | 4173 | `npm run preview:remote` |

\* `smartcart-next-demo` and `react-practice`'s `json-server` both default
to port 3001 — **run them at different times**, or change one port, since
they're independent demos not meant to run simultaneously with the mock API.

## 9. Install, run, test, build commands

```bash
# react-practice (host + existing SmartCart app)
cd react-practice
npm install
npm run dev            # Vite dev server, http://localhost:5173
npm run server          # json-server mock API, http://localhost:3001 (separate terminal)
npm run lint
npm run test            # vitest watch mode
npm run test:run        # vitest single run (CI-style)
npm run build            # production build
npm run preview           # preview the production build

# smartcart-next-demo (Day 1-2 SSR demo)
cd smartcart-next-demo
npm install
npm run dev              # http://localhost:3001
npm run lint
npm run build
npm start                 # serve the production build on port 3001

# smartcart-recommendations (Day 3 Module Federation remote)
cd smartcart-recommendations
npm install
npm run dev                # standalone preview of the widget, for local iteration only
npm run preview:remote      # REQUIRED for federation: builds + serves on port 4173
```

**Important:** the remote must be running via `npm run preview:remote`
(build + `vite preview`) — not `npm run dev` — for the host to be able to
load `remoteEntry.js`. Module Federation needs the built output, not the
dev server's unbundled modules.

To see the full integration: start `smartcart-recommendations`'s
`preview:remote`, then `react-practice`'s `npm run server` and `npm run dev`,
then open `http://localhost:5173/products/1`.

## 10. How to prove RecommendationsWidget is remote

1. With the remote running, open DevTools → Network tab while visiting a
   product page (`/products/:id`) in `react-practice`. You'll see a request
   for `http://localhost:4173/remoteEntry.js` — code being fetched from a
   completely different origin/port/build, not bundled into the host.
2. Stop the remote (`Ctrl+C` on its `preview:remote` process) and reload
   the product page: the "Recommended Products" section disappears and is
   replaced by "Recommendations are temporarily unavailable" — proving the
   host has no local copy of that component to fall back on.
3. `curl http://localhost:4173/remoteEntry.js` returns the federation
   runtime bootstrap JS directly — this file only exists in
   `smartcart-recommendations/dist`, never in `react-practice`'s bundle.

## 11. What happens when the remote is stopped

`RemoteRecommendations.jsx` wraps the lazily-loaded widget in an
`ErrorBoundary` (with a custom `fallback`) and a `Suspense` boundary. When
`smartcart-recommendations` isn't reachable, the dynamic `import()` promise
rejects, `React.lazy` turns that into a render-time throw, and the
`ErrorBoundary` catches it and renders "Recommendations are temporarily
unavailable." instead of crashing `ProductDetailsPage`. The rest of the
page (product info, Add to Cart, cart state) is completely unaffected —
this was manually verified by stopping the remote's preview server and
reloading the product page in the browser.

## 12. Common Module Federation errors (and what they mean here)

- **"Port 4173 is already in use"** — another `vite preview`/dev server is
  already bound to that port; stop it first (`preview.strictPort: true` is
  set specifically so this fails loudly instead of silently switching to a
  different port the host wouldn't know about).
- **`Failed to resolve import "recommendations/RecommendationsWidget"`**
  during a Vite transform (e.g. in tests) — this bare specifier is only
  resolvable by the federation plugin at dev/build time; it is not a real
  file. In `vite.config.js`, the federation plugin is disabled in `test`
  mode for this reason, and the dynamic import is isolated into its own
  file (`loadRecommendationsWidget.js`) so tests can mock that file
  directly instead of the virtual module.
- **`Unable to compile federated types` / `tsc` error during build** — the
  plugin's optional `.d.ts` generation feature shells out to `tsc` and
  expects a `tsconfig.json`. Since this is a JS-only project by design,
  `dts: false` is set in both the host's and remote's federation config to
  disable that sub-feature entirely (not to silence a real error — it's
  irrelevant for a project with no TypeScript).
- **"Recommendations are temporarily unavailable" in the browser** — not
  strictly an *error message* from Module Federation, but the intended
  host-side fallback when the remote is unreachable (wrong port, remote
  not built/served, or a network issue). Check that `preview:remote` is
  actually running on port 4173.

## 13. TypeScript

TypeScript was **intentionally not installed or configured** in any of the
three projects. The task requires the implementation to remain JavaScript
and JSX throughout — every source file across `react-practice`,
`smartcart-next-demo`, and `smartcart-recommendations` is `.js`/`.jsx`, and
no `tsconfig.json` exists in any of them. The one place TypeScript's
absence surfaces is the Module Federation plugin's optional DTS
(TypeScript type generation) feature, which is explicitly disabled
(`dts: false`) in both the host and the remote for exactly this reason.
