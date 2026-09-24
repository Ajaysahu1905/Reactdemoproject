import axios from "axios";

// One shared Axios instance instead of fetch() calls that hardcoded the
// base URL in four files — callers now pass relative paths ("/products").
export const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Attaches a bearer token when logged in. Honest caveat: json-server has
// no auth middleware and ignores this header — it demonstrates the real pattern regardless (see authSlice.js).
api.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };

  const storedUser = localStorage.getItem("smartcart_user");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Logs every request/response in one place and normalizes failures into
// one friendly message instead of each call site inventing its own.
api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    console.log(
      `[API] ${response.config.method.toUpperCase()} ${response.config.url} -> ${response.status} (${duration}ms)`
    );
    return response;
  },
  (error) => {
    const { config, response } = error;
    const duration = config?.metadata ? Date.now() - config.metadata.startTime : 0;
    console.error(
      `[API] ${config?.method?.toUpperCase()} ${config?.url} -> ${response?.status ?? "network error"} (${duration}ms)`
    );

    // A 401 means the token was rejected — clear the session and send the
    // user to /login. json-server never actually returns this, but a real backend would.
    if (response?.status === 401) {
      localStorage.removeItem("smartcart_user");
      window.location.assign("/login");
    }

    const message = response
      ? "Something went wrong talking to the server."
      : "Could not load data. Make sure json-server is running.";

    return Promise.reject(new Error(message));
  }
);
