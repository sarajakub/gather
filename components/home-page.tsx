'use client';

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import BottomNav from "@/components/BottomNav";
import {
  BOROUGH_FILTERS,
  CATEGORY_FILTERS,
  URGENCY_FILTERS,
  helpRequests,
  type BoroughFilter,
  type CategoryFilter,
  type HelpRequest,
  type UrgencyFilter,
} from "@/data/helpRequests";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

const INITIAL_VISIBLE_REQUESTS = 15;

function getUrgencyRank(urgency: HelpRequest["urgency"]) {
  if (urgency === "Urgent") return 0;
  if (urgency === "New") return 1;
  return 2;
}

function getUrgencyBadgeClass(urgency: HelpRequest["urgency"]) {
  if (urgency === "Urgent") return "badge-urgent";
  if (urgency === "New") return "badge-new";
  return "badge-open";
}

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
  const [boroughFilter, setBoroughFilter] = useState<BoroughFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_REQUESTS);

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

  const neighborhoodCount = useMemo(
    () => new Set(helpRequests.map((request) => request.neighborhood)).size,
    [],
  );

  const filteredRequests = useMemo(() => {
    return [...helpRequests]
      .filter((request) => {
        if (boroughFilter !== "All" && request.boroughArea !== boroughFilter) {
          return false;
        }

        if (categoryFilter !== "All" && request.category !== categoryFilter) {
          return false;
        }

        if (urgencyFilter !== "All" && request.urgency !== urgencyFilter) {
          return false;
        }

        return true;
      })
      .sort((left, right) => getUrgencyRank(left.urgency) - getUrgencyRank(right.urgency));
  }, [boroughFilter, categoryFilter, urgencyFilter]);

  const visibleRequests = filteredRequests.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredRequests.length;

  const handleBoroughFilterChange = (nextFilter: BoroughFilter) => {
    setBoroughFilter(nextFilter);
    setVisibleCount(INITIAL_VISIBLE_REQUESTS);
  };

  const handleCategoryFilterChange = (nextFilter: CategoryFilter) => {
    setCategoryFilter(nextFilter);
    setVisibleCount(INITIAL_VISIBLE_REQUESTS);
  };

  const handleUrgencyFilterChange = (nextFilter: UrgencyFilter) => {
    setUrgencyFilter(nextFilter);
    setVisibleCount(INITIAL_VISIBLE_REQUESTS);
  };

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
            </section>

            <section className="surface-card section-card">
              <div className="section-header section-header-tight">
                <div>
                  <p className="eyebrow">Requests that need help</p>
                  <h3 className="section-heading">
                    Lend a hand
                  </h3>
                  <p className="muted-copy request-section-copy">
                    Requests within your neighborhood or all across NYC.
                  </p>
                </div>
                <span className="badge badge-skill">{helpRequests.length} requests</span>
              </div>

              <div className="filter-toolbar">
                <div className="filter-group">
                  <span className="filter-label">Area</span>
                  <div className="filter-chip-row">
                    {BOROUGH_FILTERS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`filter-chip${
                          boroughFilter === option ? " filter-chip-active" : ""
                        }`}
                        onClick={() => handleBoroughFilterChange(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <span className="filter-label">Category</span>
                  <div className="filter-chip-row">
                    {CATEGORY_FILTERS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`filter-chip${
                          categoryFilter === option ? " filter-chip-active" : ""
                        }`}
                        onClick={() => handleCategoryFilterChange(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <span className="filter-label">Urgency</span>
                  <div className="filter-chip-row">
                    {URGENCY_FILTERS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`filter-chip${
                          urgencyFilter === option ? " filter-chip-active" : ""
                        }`}
                        onClick={() => handleUrgencyFilterChange(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="results-summary">
                <span>
                  Showing {visibleRequests.length} of {filteredRequests.length} matching
                  requests
                </span>
                
              </div>

              {filteredRequests.length === 0 ? (
                <div className="request-empty-state">
                  <p className="section-title">No requests match these filters.</p>
                  <p className="muted-copy">
                    Try opening the area or category filters back up to see more
                    neighbors who need help.
                  </p>
                </div>
              ) : (
                <div className="request-list">
                  {visibleRequests.map((request) => (
                    <article key={request.id} className="request-card app-post-card">
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
                        <span className={`badge ${getUrgencyBadgeClass(request.urgency)}`}>
                          {request.urgency}
                        </span>
                        <span className="badge badge-borough">{request.boroughArea}</span>
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
              )}

              {canShowMore ? (
                <div className="show-more-row">
                  <button
                    type="button"
                    className="btn btn-secondary btn-md"
                    onClick={() =>
                      setVisibleCount((currentCount) => currentCount + INITIAL_VISIBLE_REQUESTS)
                    }
                  >
                    Show more requests
                  </button>
                </div>
              ) : null}
            </section>
          </div>

          <aside className="app-home-column app-home-side">
            <section className="surface-card section-card stats-card">
              <p className="eyebrow">This week in Gather</p>
              <div className="stats-grid">
                <div className="card-stat">
                  <div className="card-stat-number">{helpRequests.length}</div>
                  <div className="card-stat-label">Open requests</div>
                </div>
                <div className="card-stat">
                  <div className="card-stat-number">{neighborhoodCount}</div>
                  <div className="card-stat-label">Neighborhoods</div>
                </div>
                <div className="card-stat">
                  <div className="card-stat-number">9</div>
                  <div className="card-stat-label">Need types</div>
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
