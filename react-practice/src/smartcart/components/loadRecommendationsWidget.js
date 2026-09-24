// Loads the RecommendationsWidget exposed by the
// smartcart-recommendations Module Federation remote.
export function loadRecommendationsWidget() {
  return import("recommendations/RecommendationsWidget");
}