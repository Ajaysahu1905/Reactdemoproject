import { useState, useEffect } from "react";
import { api } from "../api/axiosInstance";

// Fetches a URL and returns {data, loading, error} via the shared Axios
// instance — friendly errors and request logging live in axiosInstance.js.
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Tracks the url a fetch was last started for. Comparing it during
  // render (React's "adjusting state when a prop changes" pattern) resets
  // loading/error the moment `url` changes, without calling setState
  // synchronously inside the effect itself.
  const [trackedUrl, setTrackedUrl] = useState(url);

  if (url !== trackedUrl) {
    setTrackedUrl(url);
    setLoading(!!url);
    setError("");
  }

  useEffect(() => {
    // If there's no url yet (e.g. still waiting on a param),
    // don't attempt a fetch.
    if (!url) return;

    let ignore = false;

    api
      .get(url)
      .then((response) => {
        if (ignore) return;
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, loading, error };
}
