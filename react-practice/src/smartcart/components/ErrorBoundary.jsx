import { Component } from "react";

// Error boundaries must be class components — getDerivedStateFromError and
// componentDidCatch have no hook equivalent yet.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Runs right after a descendant throws; returning state here shows
    // the fallback UI on the next render.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Runs during the commit phase — this is the place to log the
    // error somewhere (e.g. an error-tracking service) in a real app.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Optional fallback lets callers (e.g. a remote micro-frontend
      // boundary) show a scoped message instead of the default full page one.
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>This part of the app crashed unexpectedly.</p>
          <button onClick={() => window.location.assign("/")}>
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
