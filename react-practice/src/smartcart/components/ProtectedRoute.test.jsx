import { describe, it, expect } from "vitest";
import { Routes, Route } from "react-router-dom";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import ProtectedRoute from "./ProtectedRoute";

function TestApp() {
  return (
    <Routes>
      <Route path="/login" element={<div>Login Page</div>} />
      <Route
        path="/secret"
        element={
          <ProtectedRoute>
            <div>Secret Content</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to /login", () => {
    renderWithProviders(<TestApp />, {
      route: "/secret",
      preloadedState: { auth: { user: null, status: "idle", error: null } },
    });

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    renderWithProviders(<TestApp />, {
      route: "/secret",
      preloadedState: {
        auth: {
          user: { username: "ajay", token: "demo-token" },
          status: "succeeded",
          error: null,
        },
      },
    });

    expect(screen.getByText("Secret Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});
