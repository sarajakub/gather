'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { loadLocalRequests } from "@/lib/localRequests";

const INITIAL_VISIBLE_REQUESTS = 15;
const SORT_OPTIONS = ["Recommended", "Distance"] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

function getUrgencyRank(urgency: HelpRequest["urgency"]) {
  if (urgency === "Urgent") return 0;
  if (urgency === "New") return 1;
  return 2;
}

function getDistanceValue(distance: string) {
  const match = distance.match(/[\d.]+/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function getUrgencyBadgeClass(urgency: HelpRequest["urgency"]) {
  if (urgency === "Urgent") return "badge-urgent";
  if (urgency === "New") return "badge-new";
  return "badge-open";
}

function getCategoryLabel(category: HelpRequest["category"]) {
  const categoryEmojiMap: Record<HelpRequest["category"], string> = {
    "Food support": "🍲",
    "Outdoor help": "🌿",
    "Moving help": "📦",
    Errands: "🛍️",
    "Home help": "🪜",
    "Community volunteering": "🤝",
    "Family support": "🏡",
    "Tech help": "💻",
    "Care visits": "💛",
  };

  return `${categoryEmojiMap[category]} ${category}`;
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

function getPersonSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getOfferHref(request: HelpRequest) {
  const params = new URLSearchParams({
    to: getPersonSlug(request.authorName),
    name: request.authorName,
    neighborhood: request.neighborhood,
    postId: request.id,
    postTitle: request.title,
    mode: "offer",
  });

  return `/messages?${params.toString()}`;
}

export default function HomePage() {
  const [boroughFilter, setBoroughFilter] = useState<BoroughFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("Recommended");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_REQUESTS);
  const [localRequests, setLocalRequests] = useState<HelpRequest[]>([]);

  useEffect(() => {
    setLocalRequests(loadLocalRequests());
  }, []);

  const allRequests = useMemo(
    () => [...localRequests, ...helpRequests],
    [localRequests],
  );

  const neighborhoodCount = useMemo(
    () => new Set(allRequests.map((request) => request.neighborhood)).size,
    [allRequests],
  );

  const filteredRequests = useMemo(() => {
    return [...allRequests]
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
      .sort((left, right) => {
        if (sortOption === "Distance") {
          const distanceDifference =
            getDistanceValue(left.distance) - getDistanceValue(right.distance);

          if (distanceDifference !== 0) {
            return distanceDifference;
          }
        }

        const urgencyDifference =
          getUrgencyRank(left.urgency) - getUrgencyRank(right.urgency);

        if (urgencyDifference !== 0) {
          return urgencyDifference;
        }

        return getDistanceValue(left.distance) - getDistanceValue(right.distance);
      });
  }, [allRequests, boroughFilter, categoryFilter, urgencyFilter, sortOption]);

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

  const handleSortOptionChange = (nextSortOption: SortOption) => {
    setSortOption(nextSortOption);
    setVisibleCount(INITIAL_VISIBLE_REQUESTS);
  };

  return (
    <main className="app-shell">
      <div className="ambient-orb ambient-orb-left" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-right" aria-hidden="true" />

      <div className="app-frame app-frame-feed">
        <section className="app-home-grid">
          <div className="app-home-column">
            <section className="surface-card section-card">
              <div className="section-header section-header-tight">
                <div>
                  <p className="eyebrow">Near you</p>
                  <h3 className="section-heading">
                    Lend a hand
                  </h3>
                  <p className="muted-copy request-section-copy">
                    Real requests from nearby neighbors and across NYC.
                  </p>
                </div>
                <span className="badge badge-skill">{allRequests.length} requests</span>
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

                <div className="filter-group">
                  <span className="filter-label">Sort</span>
                  <div className="filter-chip-row">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`filter-chip${
                          sortOption === option ? " filter-chip-active" : ""
                        }`}
                        onClick={() => handleSortOptionChange(option)}
                      >
                        {option === "Distance" ? "Distance away" : option}
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
                <span>
                  Sorted by {sortOption === "Distance" ? "distance away" : "recommended"}
                </span>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="request-empty-state">
                  <p className="section-title">Nothing nearby right now.</p>
                  <p className="muted-copy">
                    Try opening up your filters, check back soon, or share a need.
                  </p>
                  <div className="show-more-row">
                    <Link href="/post" className="btn btn-primary btn-md">
                      Share a need
                    </Link>
                  </div>
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
                        <span className="badge badge-need">
                          {getCategoryLabel(request.category)}
                        </span>
                        <span className="badge badge-time">{request.timing}</span>
                        <span className={`badge ${getUrgencyBadgeClass(request.urgency)}`}>
                          {request.urgency}
                        </span>
                        <span className="badge badge-borough">{request.boroughArea}</span>
                      </div>

                      <p className="card-post-body">{request.description}</p>

                      <div className="card-post-footer">
                        <span className="soft-note">{request.helperNote}</span>
                        <Link
                          href={getOfferHref(request)}
                          className="btn btn-peach-soft btn-sm"
                        >
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
                  <div className="card-stat-number">{allRequests.length}</div>
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
