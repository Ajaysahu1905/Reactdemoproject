# ReactJsGSK — React Learning Hub

A comprehensive React learning project featuring three interconnected applications built with different React patterns and architectures. This monorepo demonstrates **Client-Side Rendering (CSR)**, **Server-Side Rendering (SSR)**, **Module Federation**, and modern React practices.

## 📦 Project Structure

```
ReactJsGSK/
├── react-practice/              SmartCart Pro (Vite + React SPA, CSR Host)
├── smartcart-next-demo/         Next.js Server-Rendered Version (SSR)
├── smartcart-recommendations/   Micro-Frontend Remote (Module Federation)
└── WEEK5_DAY1_TO_DAY4.md       Documentation for Week 5 additions
```

---

## 🚀 Quick Start

Each sub-project is independent and can be run separately or together. Choose based on what you want to learn:

### Option 1: Just the CSR App (react-practice)
```bash
cd react-practice
npm install
npm run server      # Terminal 1: Start mock API on port 3001
npm run dev         # Terminal 2: Start Vite dev server on port 5173
```

### Option 2: Just the SSR App (smartcart-next-demo)
```bash
cd smartcart-next-demo
npm install
npm run dev         # Start Next.js dev server on port 3000
```

### Option 3: Full Stack (CSR Host + SSR + Micro-Frontend)
```bash
# Terminal 1: Start json-server (API)
cd react-practice
npm run server

# Terminal 2: Start Vite CSR app
cd react-practice
npm run dev

# Terminal 3: Start recommendations remote (micro-frontend)
cd smartcart-recommendations
npm run preview:remote

# Terminal 4: Start Next.js SSR app (optional)
cd smartcart-next-demo
npm run dev
```

---

## 📚 Project Descriptions

### 1. **react-practice** — SmartCart Pro (CSR + Module Federation Host)

A **Client-Side Rendered** React 19 + Vite e-commerce demo app with a complete shopping flow.

#### Key Features
- ✅ Browse products by category
- ✅ Full-text search
- ✅ Product details page
- ✅ Shopping cart with persistence
- ✅ User login (demo auth)
- ✅ Checkout with form validation
- ✅ Dark/light theme toggle
- ✅ Micro-frontend integration (recommendations widget)
- ✅ Error boundaries for crash isolation
- ✅ Route-level code splitting with Suspense

#### Tech Stack
| Area | Technology |
|------|-----------|
| Build | Vite 8 |
| UI Framework | React 19.2 + React DOM |
| Component Library | Material-UI (MUI) |
| Routing | react-router-dom 7 |
| HTTP | Axios + interceptors |
| Global State | Redux Toolkit (auth) + Context API (cart) |
| Forms | React Hook Form + Zod |
| Styling | MUI `sx` prop + Emotion |
| Mock API | json-server (port 3001) |
| Testing | Vitest 4 + React Testing Library |
| Micro-frontends | Module Federation (Vite plugin) |
| Linting | ESLint 10 |

#### Architecture Highlights
- **State Management**: Two approaches side by side
  - `CartContext` — Context + `useReducer` pattern
  - `authSlice` — Redux Toolkit with async thunk
- **Data Fetching**: Axios instance with request/response interceptors
- **Theming**: MUI theme provider with localStorage persistence
- **Forms**: React Hook Form with Zod schema validation
- **Module Federation**: `RemoteRecommendations` component loads a remote widget at runtime

#### Folder Structure
```
react-practice/src/smartcart/
├── SmartCartApp.jsx         Entry point with all providers
├── routes/AppRoutes.jsx     Router with lazy-loaded pages + error boundaries
├── store/                   Redux Toolkit auth state
├── context/                 CartContext + ThemeModeContext
├── theme/                   MUI theme configuration
├── api/                     Axios instance + interceptors
├── hooks/                   useFetch, useLocalStorage
├── components/              Reusable components + tests
├── pages/                   Route components
├── data/                    productsResource for use() hook
├── reducers/                cartReducer for Context API
├── test/                    Test setup & utilities
└── styles/                  CSS modules & globals
```

#### Running Scripts
```bash
npm run dev              # Vite dev server (port 5173)
npm run server          # json-server API (port 3001)
npm run build           # Production build
npm run preview         # Serve production build
npm run lint            # ESLint check
npm run test            # Vitest watch mode
npm run test:run        # Vitest run once (CI)
```

#### Key Concepts Demonstrated
- Context API + `useReducer`
- Redux Toolkit with `createAsyncThunk`
- Custom hooks (`useFetch`, `useLocalStorage`)
- Memoization (`useMemo`, `useCallback`, `memo()`)
- `forwardRef` + `useImperativeHandle`
- React 19 `use()` hook + Suspense
- Error boundaries (class component pattern)
- Route-level code splitting
- Module Federation / Micro-frontends
- Axios request/response interceptors
- React Hook Form + Zod validation

**🔗 For detailed docs:** See [`react-practice/README.md`](react-practice/README.md)

---

### 2. **smartcart-next-demo** — Server-Rendered Version

A **Server-Side Rendered** version of SmartCart built with Next.js 15+ (App Router).

#### Key Features
- ✅ Server Components (default) for zero JS on the client
- ✅ Server-rendered product listings (SSR)
- ✅ Static Generation (SSG) for the home page
- ✅ Incremental Static Regeneration (ISR) demo
- ✅ Client Components for interactive features (Add to Cart button)
- ✅ Streaming & Suspense boundaries
- ✅ Dynamic route parameters

#### Tech Stack
| Area | Technology |
|------|-----------|
| Framework | Next.js 15+ (App Router) |
| UI | React Server Components + Client Components |
| Styling | CSS Modules + Tailwind CSS |
| API | Fetch API (with `revalidate` options) |
| Mock Data | External API or hardcoded data |

#### Rendering Strategies
| Page | Strategy | Description |
|------|----------|-------------|
| `/` | Static (SSG) | Prerendered at build time |
| `/products` | Server (SSR) | Rendered fresh on every request (`force-dynamic`) |
| `/products/[id]` | Server (SSR) | Dynamic route with per-request rendering |
| `/products/isr-demo` | Cached (ISR) | Cached for 60s, regenerated on demand |

#### Folder Structure
```
smartcart-next-demo/
├── app/
│   ├── page.jsx              Home page (SSG)
│   ├── layout.jsx            Root layout
│   ├── products/
│   │   ├── page.jsx          Products list (SSR)
│   │   ├── [id]/page.jsx     Product details (SSR)
│   │   ├── isr-demo/page.jsx ISR demo
│   │   └── components/
│   ├── components/
│   │   └── AddToCartButton.jsx  Client Component for interactivity
│   └── ...
├── public/
├── package.json
└── next.config.mjs
```

#### Running Scripts
```bash
npm run dev      # Next.js dev server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

#### Key Concepts Demonstrated
- Next.js 15 App Router
- Server Components (default)
- Client Components (`"use client"` directive)
- Static Site Generation (SSG)
- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)
- Dynamic route segments `[id]`
- Streaming & Suspense
- Metadata & head management

**🔗 For detailed docs:** See [`smartcart-next-demo/README.md`](smartcart-next-demo/README.md)

---

### 3. **smartcart-recommendations** — Micro-Frontend Remote

A **remote application** that serves a recommendations widget via Module Federation. Consumed by `react-practice`.

#### Key Features
- ✅ Micro-frontend pattern (Module Federation)
- ✅ Runtime-loaded remote component
- ✅ Shared dependencies (React, React-DOM as singletons)
- ✅ Independent build & deployment
- ✅ Fault isolation (crashes don't affect host)

#### Tech Stack
| Area | Technology |
|------|-----------|
| Build | Vite 8 |
| UI | React 19 + MUI |
| Module Federation | @module-federation/vite |

#### Running the Remote
```bash
cd smartcart-recommendations
npm install
npm run preview:remote    # Serves on port 4173 (/remoteEntry.js)
```

#### Host Integration
In `react-practice`, the host:
1. Declares `recommendations` remote in `vite.config.js`
2. Dynamically imports the remote in `loadRecommendationsWidget.js`
3. Renders it with `<Suspense>` + `<ErrorBoundary>` in `RemoteRecommendations.jsx`

#### Folder Structure
```
smartcart-recommendations/
├── src/
│   ├── App.jsx           Remote app wrapper
│   ├── RecommendationsWidget.jsx
│   ├── components/
│   └── ...
├── vite.config.js        Module Federation config
├── package.json
└── ...
```

#### Key Concepts Demonstrated
- Module Federation / Micro-frontends
- Runtime-loaded components
- Shared dependencies
- Error isolation with ErrorBoundary
- Independent versioning & deployment

**🔗 For detailed docs:** See [`smartcart-recommendations/README.md`](smartcart-recommendations/README.md)

---

## 🎓 Learning Progression

If you're new to React, follow this path:

1. **Start here:** `react-practice` — Learn React fundamentals
   - Props, state, hooks
   - Context API + useReducer
   - Custom hooks
   - Forms & validation

2. **Next:** Add state management
   - Redux Toolkit in `react-practice`
   - Compare with Context API

3. **Then:** Explore SSR
   - Run `smartcart-next-demo`
   - Compare Client-Side vs Server-Side rendering

4. **Finally:** Advanced patterns
   - Module Federation (`smartcart-recommendations`)
   - Error boundaries
   - Code splitting & Suspense

---

## 📝 Mock API

All projects use a mock API (`json-server`) serving data from `db.json`.

**Endpoints** (on `http://localhost:3001`):
- `GET /products` — All products
- `GET /products/:id` — Single product

**Sample Product:**
```json
{
  "id": 1,
  "title": "Wireless Earbuds",
  "price": 2999,
  "category": "Electronics",
  "image": "https://...",
  "description": "High-quality wireless earbuds..."
}
```

**Categories:** Electronics, Fashion, Home, Accessories

---

## 🧪 Testing

### react-practice
- **Framework:** Vitest 4
- **Library:** React Testing Library
- **Location:** `*.test.jsx` files alongside components

Run tests:
```bash
npm run test        # Watch mode
npm run test:run    # Single run (CI)
```

Example test:
```jsx
import { renderWithProviders } from "../../test/renderWithProviders";
import ProductCard from "./ProductCard";

describe("ProductCard", () => {
  it("renders product name and price", () => {
    const product = { id: 1, title: "Test", price: 999 };
    renderWithProviders(<ProductCard product={product} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("₹999")).toBeInTheDocument();
  });
});
```

---

## 🔧 Common Tasks

### Port Conflicts?
- Vite: `npm run dev -- --port 5174`
- json-server: `npm run server -- --port 3002`
- Next.js: `npm run dev -- -p 3001`

### Clearing Cache
```bash
# Vite
rm -rf react-practice/.vite
rm -rf react-practice/dist

# Next.js
rm -rf smartcart-next-demo/.next

# Node modules
rm -rf node_modules && npm install
```

### ESLint Issues
```bash
npm run lint -- --fix
```

---

## 📖 Additional Resources

### Inside the Monorepo
- [SmartCart Pro (react-practice) Deep Dive](react-practice/README.md)
- [Next.js SSR Demo](smartcart-next-demo/README.md)
- [Micro-Frontends Setup](smartcart-recommendations/README.md)
- [Week 5 Study Notes](WEEK5_DAY1_TO_DAY4.md)

### External Links
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [MUI Component Library](https://mui.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Hook Form](https://react-hook-form.com)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)

---

## 🛠️ Development Workflow

### Adding a New Feature to react-practice
1. Create a branch: `git checkout -b feature/my-feature`
2. Make changes in `src/smartcart/`
3. Write tests alongside components
4. Run tests: `npm run test:run`
5. Lint: `npm run lint -- --fix`
6. Commit: `git add . && git commit -m "Add my feature"`
7. Build & preview: `npm run build && npm run preview`

### Updating Dependencies
```bash
npm outdated              # Check for outdated packages
npm update                # Update to latest compatible
npm audit fix             # Fix security vulnerabilities
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" in tests | Run `npm install` and check `tsconfig.json` / `jsconfig.json` |
| `json-server` not responding | Check it's running on port 3001; restart with `npm run server` |
| Module Federation remote not loading | Ensure remote app is running; check `vite.config.js` remote URL |
| ESLint errors on save | Run `npm run lint -- --fix` or configure pre-commit hook |
| Vite HMR issues | Clear `.vite/` cache and restart dev server |

---

## 📄 License

This project is for learning purposes.

---

## 🙏 Credits

Built as a hands-on React practice project to demonstrate:
- Modern React patterns (hooks, context, suspense)
- State management (Redux Toolkit + Context API)
- Server-Side Rendering (Next.js)
- Micro-frontends (Module Federation)
- Testing best practices
- Developer experience (Vite, ESLint, Vitest)

---

## 🚦 Getting Help

Each sub-project has its own `README.md` with detailed information:
- Questions about **CSR/SPA patterns** → See `react-practice/README.md`
- Questions about **SSR/Next.js** → See `smartcart-next-demo/README.md`
- Questions about **Micro-frontends** → See `smartcart-recommendations/README.md`
- Questions about **Week 5 additions** → See `WEEK5_DAY1_TO_DAY4.md`

Happy learning! 🚀
