// Isolates the bare Module Federation specifier in its own real file so
// tests can mock this file directly (a normal, resolvable module path)
// instead of fighting Vite's import-analysis over a virtual remote import.
export function loadRecommendationsWidget() {
  return import(/* @vite-ignore */ "recommendations/RecommendationsWidget");
}
