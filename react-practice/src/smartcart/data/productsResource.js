import { api } from "../api/axiosInstance";

// use() needs a stable promise across re-renders — a new one each render
// would loop Suspense forever, so this module caches it once (a "resource").
// Goes through the shared Axios instance, so it also gets the auth header + logging.
let productsPromise = null;

export function getProductsResource() {
  if (!productsPromise) {
    productsPromise = api.get("/products").then((response) => response.data);
  }
  return productsPromise;
}

// Lets other code (e.g. a "refresh" button) force the next call to
// getProductsResource() to fetch fresh data instead of the cached one.
export function resetProductsResource() {
  productsPromise = null;
}
