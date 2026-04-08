'use client';

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import BottomNav from "@/components/BottomNav";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

type HelpRequest = {
  authorName: string;
  category: string;
  title: string;
  description: string;
  neighborhood: string;
  timing: string;
  urgency: string;
  distance: string;
  helperNote: string;
};

const requests: HelpRequest[] = [
  {
    authorName: "Maya Johnson",
    category: "Seasonal help",
    title: "Snow shoveling for a neighbor recovering from surgery",
    description:
      "Front walk and one short driveway need clearing before tomorrow morning's appointment.",
    neighborhood: "Maple Grove",
    timing: "Today before 7 pm",
    urgency: "Urgent",
    distance: "0.4 miles away",
    helperNote: "Best fit for neighbors available this evening",
  },
  {
    authorName: "Luis Ramirez",
    category: "Harvest share",
    title: "Picking fruit from a backyard tree for the food pantry",
    description:
      "A family has more pears than they can reach and wants help gathering them for donation.",
    neighborhood: "River Park",
    timing: "This weekend",
    urgency: "New",
    distance: "0.8 miles away",
    helperNote: "Great for outdoor help and donation runs",
  },
  {
    authorName: "Aisha Carter",
    category: "Care circle",
    title: "Meal drop-off and porch check-in for a new parent",
    description:
      "Looking for one person to bring soup and another to help carry groceries inside.",
    neighborhood: "South Commons",
    timing: "Tomorrow at lunch",
    urgency: "Open",
    distance: "1.1 miles away",
    helperNote: "A simple way to support a family this week",
  },
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

function getDisplayName(user: User | null) {
  if (!user?.displayName?.trim()) return "Gather member";
  return user.displayName.trim();
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
  const displayName = getDisplayName(user);

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
    <main className="app-shell">
      <div className="ambient-orb ambient-orb-left" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-right" aria-hidden="true" />

      <div className="app-frame app-frame-feed">
        <section className="app-home-grid">
          <div className="app-home-column">
            <section className="surface-card app-hero-card">
              <p className="eyebrow">Neighbors helping neighbors</p>
              <h2 className="hero-title">
                The space to gather around the help your community needs.
              </h2>
              <p className="hero-body">
                Discover nearby requests, step in where you can, and make local
                care feel easy to act on.
              </p>

              {user ? (
                <div className="profile-snapshot">
                  <div className="profile-snapshot-main">
                    <div className="avatar avatar-lg avatar-sage avatar-verified">
                      {getInitials(user.displayName)}
                    </div>
                    <div className="gather-stack-sm">
                      <p className="section-title">Welcome back, {helperName}.</p>
                      <p className="muted-copy">
                        Your feed is ready with a few requests that match the kind
                        of help neighbors often need first.
                      </p>
                      <p className="soft-note">Signed in as {displayName}</p>
                    </div>
                  </div>
                  <div className="profile-snapshot-actions">
                    <Link href="/profile" className="text-link">
                      View profile
                    </Link>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={handleSignOut}
                      disabled={authPending}
                    >
                      {authPending ? "Working..." : "Sign out"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-card auth-card-compact">
                  <div className="gather-stack-sm">
                    <p className="section-title">Log in or register to join in.</p>
                    <p className="muted-copy">
                      Use Google to create your Gather account and unlock your
                      neighborhood feed, messages, and profile.
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
            </section>

            <section className="surface-card section-card">
              <div className="section-header section-header-tight">
                <div>
                  <p className="eyebrow">Requests that need help</p>
                  <h3 className="section-heading">
                    A few neighbors who could use a hand right now
                  </h3>
                </div>
                <span className="badge badge-skill">Live-feel preview</span>
              </div>

              <div className="request-list">
                {requests.map((request) => (
                  <article key={request.title} className="request-card app-post-card">
                    <div className="card-post-header">
                      <div className="avatar avatar-md avatar-peach">
                        {getInitials(request.authorName)}
                      </div>
                      <div>
                        <p className="card-post-author">{request.authorName}</p>
                        <h4 className="card-post-title">{request.title}</h4>
                        <p className="request-meta">
                          {request.neighborhood} · {request.distance}
                        </p>
                      </div>
                    </div>

                    <div className="card-post-badges">
                      <span className="badge badge-need">{request.category}</span>
                      <span className="badge badge-time">{request.timing}</span>
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

                    <p className="card-post-body">{request.description}</p>

                    <div className="card-post-footer">
                      <span className="soft-note">{request.helperNote}</span>
                      <Link href="/messages" className="btn btn-peach-soft btn-sm">
                        Offer to help
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="app-home-column app-home-side">
            <section className="surface-card section-card stats-card">
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
            </section>
          </aside>
        </section>
      </div>

      <BottomNav activeTab="feed" hasNotification={true} />
    </main>
  );
}
