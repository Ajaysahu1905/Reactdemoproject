import "@testing-library/jest-dom/vitest";

// Node's own experimental webstorage global can shadow jsdom's real
// localStorage on globalThis, leaving a stub without get/setItem.
// Replace it with a plain in-memory Storage-compatible polyfill so
// code that reads/writes localStorage (e.g. authSlice, useLocalStorage)
// works the same in tests as it does in a real browser.
function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() {
      return store.size;
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
  };
}

Object.defineProperty(globalThis, "localStorage", {
  value: createMemoryStorage(),
  writable: true,
  configurable: true,
});
