# SmartCart Pro

A React 19 + Vite e-commerce demo app built as a hands-on practice project. It covers a
full shopping flow — browse, search, filter, product details, cart, login, checkout —
and is deliberately written to exercise core React and ecosystem patterns one at a time:
context + reducer, custom hooks, memoization, refs, error boundaries, lazy routes,
Suspense data fetching with `use()`, MUI theming, Axios interceptors, Redux Toolkit, and
React Hook Form + Zod validation.

Product data is served locally by `json-server` from `db.json`.

## Tech stack

| Area | Choice |
| --- | --- |
| Build tool | Vite 8 (`@vitejs/plugin-react`) |
| UI | React 19.2 + react-dom |
| Component library | MUI (`@mui/material`, `@mui/icons-material`) + Emotion |
| Routing | react-router-dom 7 |
| HTTP | Axios, one shared instance with request/response interceptors |
| Global state | Redux Toolkit (auth) + Context/`useReducer` (cart) — intentionally both, see below |
| Forms | React Hook Form + Zod (`@hookform/resolvers`) |
| API | `json-server` reading `db.json` on port 3001 |
| Linting | ESLint 10 + react-hooks / react-refresh plugins |
| Testing | Vitest 4 + React Testing Library + jsdom |
| Micro-frontends | Module Federation (Vite plugin) for runtime remote loading |

## Getting started

Install dependencies:

```bash
npm install
```

The app needs **two processes running at once**. Start the mock API first:

```bash
npm run server
```

Then start the dev server in a second terminal:

```bash
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). Every request goes through
the shared Axios instance at `http://localhost:3001` (see `api/axiosInstance.js`), so if
`json-server` isn't running you'll see the interceptor's fallback message: *"Could not
load data. Make sure json-server is running."*

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run server` | `json-server --watch db.json --port 3001` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run Vitest tests once (CI mode) |

## Routes

| Path | Page | Notes |
| --- | --- | --- |
| `/` | `HomePage` | Hero + 4 featured products, loaded via `use()` + `<Suspense>` |
| `/products` | `ProductsPage` | Search + category filter, both stored in the URL |
| `/products/:id` | `ProductDetailsPage` | Refetches when the `:id` param changes |
| `/login` | `LoginPage` | React Hook Form + Zod, dispatches the `loginUser` Redux thunk |
| `/cart` | `CartPage` | **Protected** — redirects to `/login`; cart table + Clear Cart confirmation dialog |
| `/checkout` | `CheckoutPage` | **Protected** — React Hook Form + Zod, then clears the cart |
| `*` | `NotFoundPage` | Catch-all |

All seven pages are `lazy()`-loaded behind a route-level `<Suspense>` boundary, nested
under a `<Layout>` route that renders `Navbar` + `<Outlet>` + `Footer`. Every individual
route element is also wrapped in its own `<ErrorBoundary>` (see `routes/AppRoutes.jsx`),
so a crash on one page shows a scoped fallback instead of taking down the whole app —
the `Navbar` and `Footer` in `Layout` keep working regardless.

## Project structure

```
src/
├─ App.jsx                     Thin shell — renders <SmartCartApp />
├─ main.jsx                    React entry point
└─ smartcart/
   ├─ SmartCartApp.jsx         Provider → ThemeModeProvider → ErrorBoundary → CartProvider → AppRoutes
   ├─ routes/AppRoutes.jsx     BrowserRouter, lazy + per-route ErrorBoundary-wrapped routes
   ├─ store/
   │  ├─ store.js              configureStore({ auth: authReducer })
   │  └─ authSlice.js          createAsyncThunk("auth/login", ...), user/status/error
   ├─ context/
   │  ├─ CartContext.jsx              items, cartCount, cartTotal, dispatch (Context + useReducer)
   │  ├─ CartContextObject.js         Bare createContext(null) — extracted for react-refresh
   │  ├─ ThemeModeContext.jsx         light/dark mode, mounts MUI ThemeProvider + CssBaseline
   │  └─ ThemeModeContextObject.js    Bare createContext(null) — extracted for react-refresh
   ├─ theme/theme.js           getTheme(mode) — brand palette, shape, typography
   ├─ api/axiosInstance.js     Shared Axios instance + request/response interceptors
   ├─ reducers/cartReducer.js  ADD / REMOVE / INCREASE / DECREASE / CLEAR
   ├─ hooks/
   │  ├─ useFetch.js           { data, loading, error } for a URL, via the Axios instance
   │  └─ useLocalStorage.js    useState that persists to localStorage
   ├─ data/productsResource.js Cached promise for the use() hook, via the Axios instance
   ├─ components/              Navbar, Layout, Footer, ProductCard, PriceTag, CartItem,
   │                           SearchBox, CategoryFilterBar, ProtectedRoute,
   │                           LoadingSpinner, ErrorBoundary, SuspenseProductList,
   │                           RemoteRecommendations (Module Federation consumer),
   │                           + corresponding .test.jsx files
   ├─ pages/                   The seven route components
   ├─ test/                    setupTests.js, renderWithProviders.jsx (shared test utilities)
   ├─ styles/                  A few remaining plain CSS files (see below)
   └─ .../**/*.test.jsx        Component tests alongside their sources
```

### State management — two approaches, side by side

- **`CartContext`** — Context + `useReducer` over `cartReducer`, mirrored into
  `useLocalStorage("smartcart_items")` via an effect. Derived values (`cartCount`,
  `cartTotal`) are computed on each render rather than stored. Kept exactly as-is even
  after Redux Toolkit was introduced, as a deliberate comparison point.
- **`authSlice`** (Redux Toolkit) — replaced the old `AuthContext`. `loginUser` is a
  `createAsyncThunk` that simulates a real async login (delay + validation +
  `rejectWithValue`), giving genuine `idle`/`loading`/`succeeded`/`failed` states instead
  of a synchronous, can't-fail `login()`. State rehydrates from
  `localStorage("smartcart_user")` on store creation.

`cartReducer` handles the quantity edge case: `DECREASE_QUANTITY` filters out any item
that drops to zero, so decrementing the last unit removes the row.

### Auth is a demo, not real security

There is no real backend authentication anywhere in this project — `json-server` has no
auth middleware and checks nothing. `loginUser` generates a fake token
(`demo-token.<username>.<timestamp>`) purely so the Axios request interceptor has
something realistic to attach as `Authorization: Bearer <token>`, and so the response
interceptor's `401` → logout → redirect-to-login path is at least wired up correctly. If
this app ever connects to a real authenticated backend, only the backend needs to start
checking that header — the frontend pattern is already correct.

### Axios instance + interceptors

`api/axiosInstance.js` is the single `axios.create({ baseURL: "http://localhost:3001" })`
— it replaced four separate hardcoded copies of that URL.

- **Request interceptor** — attaches the bearer token above (if logged in) and stamps a
  start time for logging.
- **Response interceptor** — logs every call (`[API] GET /products -> 200 (14ms)`),
  normalizes failures into one consistent user-facing message, and reacts to `401` by
  clearing the session and redirecting to `/login`.

`useFetch` and `productsResource.js` both call through this instance instead of raw
`fetch()`, with the same public contract as before — pages didn't need to change beyond
passing relative paths (`/products`) instead of full URLs.

### Theming

`theme/theme.js` centralizes the brand colors that used to be duplicated as literal hex
codes across several CSS files: accent blue `#2f6fed` (`palette.primary`, buttons,
prices) and navy `#1a1a2e` (`palette.secondary`, `Navbar`/hero/`Footer`). `shape.borderRadius`
and `typography.fontFamily` are also set once here instead of per component.

`ThemeModeContext` holds the current mode in `useLocalStorage("smartcart_theme_mode")` —
reusing the same hook `CartContext` uses — and mounts `ThemeProvider` + `CssBaseline`
around the whole app. The toggle lives in `Navbar` (sun/moon icon button).

`components/PriceTag.jsx` is a small `styled()` example: `ProductCard` and
`ProductDetailsPage` both used to repeat `fontWeight="bold" color="primary"` inline on
their price `Typography`; now both use `<PriceTag>`.

### Forms

`LoginPage` and `CheckoutPage` use `react-hook-form` + a `zod` schema via
`zodResolver`, replacing manual `useState` fields and a single generic error string with
real per-field validation messages. `LoginPage` still focuses the username field on mount
via `useLayoutEffect` — its own ref is chained with React Hook Form's `register()` ref
rather than one replacing the other.

## React & ecosystem concepts demonstrated

The source is heavily commented explaining *why* each pattern was chosen. Highlights:

- **`useMemo` / `useCallback` / `memo` working together** — `ProductsPage` memoizes the
  filtered list, and wraps `onCategoryChange` in `useCallback` so that `memo()` on
  `CategoryFilterBar` can actually skip re-renders.
- **`forwardRef` + `useImperativeHandle`** — `SearchBox` exposes only a `focus()` method
  to its parent instead of the raw `<input>` DOM node (now an MUI `TextField` underneath).
- **`useLayoutEffect` vs `useEffect`** — `LoginPage` focuses the username field before
  the browser paints, so there's no visible frame without the cursor placed.
- **React 19 `use()` + Suspense** — the Home page's featured products come from
  `SuspenseProductList`, which unwraps a promise during render; the `<Suspense>` boundary
  around it *is* the loading state. `ProductsPage`/`ProductDetailsPage` deliberately stay
  on the classic `useFetch` pattern for direct comparison.
- **URL as the source of truth** — Products search and category live in
  `useSearchParams`, not local state.
- **Route-level code splitting + per-route error boundaries** — every page is
  `lazy()`-loaded and individually wrapped in `<ErrorBoundary>`.
- **Error boundaries must be classes** — `ErrorBoundary` uses
  `getDerivedStateFromError` + `componentDidCatch`; there's still no hook equivalent.
- **Custom hooks for deduplication** — `useFetch` and `useLocalStorage`.
- **Context/`useReducer` vs Redux Toolkit** — `CartContext` and `authSlice` sit side by
  side on purpose; see "State management" above.
- **Axios interceptors** — auth header injection, centralized logging, centralized error
  normalization, `401` handling.
- **`createAsyncThunk`** — real async loading/error lifecycle for login.
- **`styled()` vs the `sx` prop** — both are used; `PriceTag` is the one reusable
  `styled()` component, everything else uses `sx`.
- **Schema-validated forms** — React Hook Form + Zod on `LoginPage`/`CheckoutPage`.

Note that `ProductCard` is wrapped in `memo()` but also subscribes to `CartContext`, so
it still re-renders on any cart change — `memo()` only blocks re-renders originating from
the parent.

## Module Federation (Micro-frontends)

`RemoteRecommendations` demonstrates runtime-loaded remote components via Module Federation
(Vite plugin `@module-federation/vite`). The recommendations widget is served by a sibling
app (`smartcart-recommendations` on port 4173) but consumed and rendered here at the host.

- **Host config** — `vite.config.js` declares `recommendations` as a remote; the entry point
  is `http://localhost:4173/remoteEntry.js`, and React/React-DOM are shared (`singleton: true`)
  to avoid duplicates.
- **Dynamic import** — `loadRecommendationsWidget.js` uses `import()` to trigger the lazy
  load; React's `lazy()` and `<Suspense>` handle the async boundary.
- **Error isolation** — `RemoteRecommendations` wraps the remote in an `<ErrorBoundary>` so
  a crash in the remote doesn't take down the host.
- **Test isolation** — `RemoteRecommendations.test.jsx` mocks the loader so tests can run
  without the remote app built or running.

### Running with the remote

1. Clone or set up the `smartcart-recommendations` app alongside this project.
2. In `smartcart-recommendations/`: `npm run preview:remote` (serves on port 4173).
3. In `react-practice/`: `npm run dev` — the app will load the remote on `ProductDetailsPage`.

If the remote isn't available, `RemoteRecommendations` shows a fallback message instead of
crashing.

## Testing

Tests are located alongside their components (e.g., `ProductCard.test.jsx` next to
`ProductCard.jsx`). The Vitest setup runs in jsdom with globals enabled.

- **Setup** — `src/test/setupTests.js` configures the environment; `src/test/renderWithProviders.jsx`
  is a shared helper that wraps components with Redux, MUI theme, router, and cart context,
  so tests exercise components the same way the app does.
- **Running tests** — `npm run test` (watch mode) or `npm run test:run` (CI mode).
- **Mocking Module Federation** — `RemoteRecommendations.test.jsx` mocks the remote loader
  to prove the host's loading + error handling without needing the remote served.

Example test file:

```jsx
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders with providers", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText(/something/i)).toBeInTheDocument();
  });
});
```

## Mock API

`db.json` holds 10 products across four categories (Electronics, Fashion, Home,
Accessories), each with `id`, `title`, `price`, `category`, `image` and `description`.
`json-server` exposes them as:

- `GET http://localhost:3001/products`
- `GET http://localhost:3001/products/:id`

Product images are hot-linked to external URLs, so images need an internet connection
even though the API itself is local. Prices are displayed in ₹ (INR).

## Other practice exercises

The repo also keeps a few smaller standalone exercises from earlier practice. They are
not mounted — to view one, swap the import in `src/App.jsx`:

- `src/props/` — `Parent`/`Child` prop passing, and a `Counter` with increment,
  decrement and reset.
- `src/Todolist/` — a todo list with add, toggle-done, delete, and all/active/done
  filtering.

## Known loose ends

- `CartContextObject.js` and `ThemeModeContextObject.js` are bare `createContext(null)` calls
  extracted from their parent files — this is required by react-refresh/only-export-components,
  which mandates that files used by fast refresh export only components. The context objects
  themselves are then imported and used by the provider components.
- `loadRecommendationsWidget.js` is a wrapper around the Module Federation import; it exists
  as a separate file so tests can mock it directly (a real, resolvable module path) instead of
  fighting Vite's import analysis on the virtual remote specifier.
- `public/products.json` exists but nothing imports it — all fetches point at
  `json-server` via the Axios instance. It predates `db.json`.
- `src/App.jsx` has a commented-out `./smartcart-pro/SmartCartApp` import for a planned
  rewrite; that directory doesn't exist yet.
- `resetProductsResource()` in `data/productsResource.js` is exported but no longer
  called — it existed for a removed demo page's "Refresh Data" button.
- The auth token is a plain, unsigned template string — see "Auth is a demo, not real
  security" above. Don't reuse this pattern against a real backend.
- The `Footer`'s phone number and email are demo placeholders, not a real support line.
