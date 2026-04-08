'use client';

import { useEffect, useState, useTransition } from "react";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

type HelpRequest = {
  category: string;
  title: string;
  description: string;
  neighborhood: string;
  timing: string;
  urgency: string;
};

const requests: HelpRequest[] = [
  {
    category: "Seasonal help",
    title: "Snow shoveling for a neighbor recovering from surgery",
    description:
      "Front walk and one short driveway need clearing before tomorrow morning's appointment.",
    neighborhood: "Maple Grove",
    timing: "Today before 7 pm",
    urgency: "Urgent",
  },
  {
    category: "Harvest share",
    title: "Picking fruit from a backyard tree for the food pantry",
    description:
      "A family has more pears than they can reach and wants help gathering them for donation.",
    neighborhood: "River Park",
    timing: "This weekend",
    urgency: "New",
  },
  {
    category: "Care circle",
    title: "Meal drop-off and porch check-in for a new parent",
    description:
      "Looking for one person to bring soup and another to help carry groceries inside.",
    neighborhood: "South Commons",
    timing: "Tomorrow at lunch",
    urgency: "Open",
  },
];

const navItems = [
  { label: "Home", active: true },
  { label: "Requests", active: false },
  { label: "Offers", active: false },
  { label: "Messages", active: false },
];

function getInitials(name: string | null | undefined) {
  if (!name) return "G";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authPending, startTransition] = useTransition();

  useEffect(() => {
    if (!auth) return;
    const firebaseAuth = auth;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
    });

    return unsubscribe;
  }, []);

  const helperName = user?.displayName?.split(" ")[0] ?? "neighbor";

  const handleGoogleAuth = () => {
    if (!auth) {
      setAuthError(
        "Add your Firebase web config in environment variables to enable Google sign-in.",
      );
      return;
    }
    const firebaseAuth = auth;

    setAuthError(null);
    startTransition(async () => {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(firebaseAuth, provider);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Google sign-in could not be completed.";
        setAuthError(message);
      }
    });
  };

  const handleSignOut = () => {
    if (!auth) return;
    const firebaseAuth = auth;

    setAuthError(null);
    startTransition(async () => {
      try {
        await signOut(firebaseAuth);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Sign out failed.";
        setAuthError(message);
      }
    });
  };

  return (
    <main className="page-shell">
      <div className="ambient-orb ambient-orb-left" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-right" aria-hidden="true" />

      <section className="container gather-stack-lg">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <span className="brand-mark-dot brand-mark-dot-sage" />
              <span className="brand-mark-dot brand-mark-dot-peach" />
              <span className="brand-mark-dot brand-mark-dot-amber" />
            </div>
            <div>
              <p className="eyebrow">Community mutual aid</p>
              <h1 className="brand-wordmark">Gather</h1>
            </div>
          </div>

          {user ? (
            <div className="nav-cluster">
              <nav className="desktop-nav" aria-label="Primary navigation">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className={`nav-pill${item.active ? " nav-pill-active" : ""}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <button
                type="button"
                className="btn btn-ghost btn-md"
                onClick={handleSignOut}
                disabled={authPending}
              >
                {authPending ? "Working..." : "Sign out"}
              </button>
            </div>
          ) : (
            <div className="auth-inline">
              <span className="badge badge-need">Google OAuth</span>
              <button
                type="button"
                className="btn btn-secondary btn-md"
                onClick={handleGoogleAuth}
                disabled={!isFirebaseConfigured || authPending}
              >
                {authPending ? "Connecting..." : "Continue with Google"}
              </button>
            </div>
          )}
        </header>

        <section className="hero card card-lg hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Neighbors helping neighbors</p>
            <h2 className="hero-title">
              Gather people around the everyday needs that make a community feel
              held.
            </h2>
            <p className="hero-body">
              Post requests, show up for someone nearby, and turn small acts of
              care into a stronger local network.
            </p>

            {user ? (
              <div className="welcome-panel">
                <div className="avatar avatar-lg avatar-sage avatar-verified">
                  {getInitials(user.displayName)}
                </div>
                <div className="gather-stack-sm">
                  <p className="section-title">Welcome back, {helperName}.</p>
                  <p className="muted-copy">
                    Your navigation is unlocked, and there are fresh requests
                    waiting for a response nearby.
                  </p>
                </div>
              </div>
            ) : (
              <div className="auth-card">
                <div className="gather-stack-sm">
                  <p className="section-title">Log in or register to join in.</p>
                  <p className="muted-copy">
                    Use Google to create your Gather account and start helping
                    with real neighborhood needs.
                  </p>
                </div>

                <div className="hero-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleGoogleAuth}
                    disabled={!isFirebaseConfigured || authPending}
                  >
                    {authPending ? "Connecting..." : "Log in / Register"}
                  </button>
                  <span className="soft-note">
                    {isFirebaseConfigured
                      ? "Google sign-in is ready."
                      : "Add Firebase env vars to activate sign-in."}
                  </span>
                </div>
              </div>
            )}

            {authError ? (
              <p className="auth-error" role="alert">
                {authError}
              </p>
            ) : null}
          </div>

          <aside className="hero-side card card-md">
            <p className="eyebrow">This week in Gather</p>
            <div className="stats-grid">
              <div className="card-stat">
                <div className="card-stat-number">18</div>
                <div className="card-stat-label">Open requests</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-number">42</div>
                <div className="card-stat-label">Neighbors active</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-number">9</div>
                <div className="card-stat-label">Needs matched</div>
              </div>
            </div>
            <p className="muted-copy">
              Warm introductions, visible needs, and one clear invitation to
              help.
            </p>
          </aside>
        </section>

        <section className="request-section gather-stack-md">
          <div className="section-header">
            <div>
              <p className="eyebrow">Requests that need help</p>
              <h3 className="section-heading">
                A few neighbors who could use a hand right now
              </h3>
            </div>
            <span className="badge badge-skill">Hardcoded examples</span>
          </div>

          <div className="request-grid">
            {requests.map((request) => (
              <article key={request.title} className="card-post request-card">
                <div className="card-post-badges">
                  <span className="badge badge-need">{request.category}</span>
                  <span
                    className={`badge ${
                      request.urgency === "Urgent"
                        ? "badge-urgent"
                        : "badge-new"
                    }`}
                  >
                    {request.urgency}
                  </span>
                </div>

                <div className="card-post-header">
                  <div className="avatar avatar-md avatar-peach">G</div>
                  <div>
                    <h4 className="card-post-title">{request.title}</h4>
                    <p className="request-meta">{request.neighborhood}</p>
                  </div>
                </div>

                <p className="card-post-body">{request.description}</p>

                <div className="card-post-footer">
                  <span className="badge badge-time">{request.timing}</span>
                  <button type="button" className="btn btn-peach-soft btn-sm">
                    Offer to help
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {user ? (
          <nav className="nav-bottom" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`nav-tab${item.active ? " active" : ""}`}
              >
                <span className="nav-tab-icon" aria-hidden="true">
                  {item.label.slice(0, 1)}
                </span>
                <span className="nav-tab-label">{item.label}</span>
              </a>
            ))}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
