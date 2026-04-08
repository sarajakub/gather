import Link from "next/link";

const recommendedPosts = [
  {
    title: "Need two people to help carry groceries up one flight",
    category: "Errands",
    urgency: "Today, 5:30 PM",
    distance: "0.4 mi away",
    neighborhood: "Bedford-Stuyvesant",
    nearby: "Near Saratoga Park and the Halsey library branch",
    description:
      "Ms. Jackson has limited mobility this week and needs help carrying bags upstairs after a food pantry pickup.",
    match: "92% match",
    color: "peach",
  },
  {
    title: "Looking for laptop help before a housing appointment",
    category: "Tech support",
    urgency: "Tomorrow, 11:00 AM",
    distance: "0.8 mi away",
    neighborhood: "Clinton Hill",
    nearby: "Near Pratt campus and Myrtle Ave cafes",
    description:
      "A neighbor needs help attaching documents, checking email, and joining a video call from their phone.",
    match: "Great for your digital help skills",
    color: "sage",
  },
  {
    title: "Community garden cleanup and seedling swap",
    category: "Outdoor help",
    urgency: "Saturday, 10:00 AM",
    distance: "1.2 mi away",
    neighborhood: "Crown Heights",
    nearby: "Near Brower Park and the farmers market",
    description:
      "A block association is organizing a cleanup day and welcomes neighbors who can lift, plant, or share tools.",
    match: "Close to your usual travel range",
    color: "sage",
  },
] as const;

const nearbyPlaces = [
  {
    name: "Library",
    note: "Good meetup point for tech help",
  },
  {
    name: "Community garden",
    note: "Matches your gardening interest",
  },
  {
    name: "Bus stop",
    note: "Easy arrival for short visits",
  },
  {
    name: "Coffee spot",
    note: "Casual coordination spot",
  },
  {
    name: "Pharmacy",
    note: "Useful for errands and pickups",
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 py-4 text-forest sm:px-6 lg:px-8">
      <div className="surface-card rounded-[24px] px-4 py-4 sm:px-6">
        <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-lg font-medium text-sage-700">
              G
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-stone">
                Gather
              </p>
              <h1 className="text-[18px] font-medium leading-[1.35]">
                Recommended help near you
              </h1>
            </div>
          </div>

          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center gap-2 text-[13px] text-stone"
          >
            <Link className="rounded-full bg-sage-50 px-4 py-2 text-sage-700" href="/">
              Recommended
            </Link>
            <Link className="rounded-full px-4 py-2 hover:bg-sage-50" href="/">
              Map view
            </Link>
            <Link className="rounded-full px-4 py-2 hover:bg-sage-50" href="/">
              Posts only
            </Link>
            <Link className="rounded-full px-4 py-2 hover:bg-sage-50" href="/">
              My profile
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full bg-sage-50 px-4 py-2 text-[12px] text-sage-700 sm:block">
              Matching from your profile first, distance second
            </div>
            <Link
              className="rounded-full bg-peach-500 px-5 py-3 text-[15px] font-medium text-forest shadow-[var(--shadow-sm)] hover:bg-peach-400"
              href="/"
            >
              Post a need
            </Link>
          </div>
        </header>

        <section className="grid gap-5 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-5">
            <div className="section-shell rounded-[24px] p-5 sm:p-6">
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-stone">
                Built around trust
              </p>
              <h2 className="display-text max-w-2xl text-[34px] leading-[1.08] text-forest sm:text-[46px]">
                Neighbor help that feels local, calm, and easy to act on.
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-stone">
                Gather recommends posts using the skills, neighborhood, travel
                time, and availability from your profile. If your profile is
                still empty, the feed falls back to what is closest.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-sage-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-stone">
                    Your profile says
                  </p>
                  <p className="mt-2 text-[16px] font-medium text-forest">
                    Tech help, errands, garden projects
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-stone">
                    Travel range
                  </p>
                  <p className="mt-2 text-[16px] font-medium text-forest">
                    Up to 20 minutes from Bed-Stuy
                  </p>
                </div>
                <div className="rounded-2xl bg-peach-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-stone">
                    Good next step
                  </p>
                  <p className="mt-2 text-[16px] font-medium text-forest">
                    Offer help to the highlighted post
                  </p>
                </div>
              </div>
            </div>

            <section
              aria-label="Map and recommended posts"
              className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]"
            >
              <div className="section-shell rounded-[24px] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-stone">
                      Street-level view
                    </p>
                    <h3 className="mt-1 text-[18px] font-medium text-forest">
                      What&apos;s nearby the selected post
                    </h3>
                  </div>
                  <div className="rounded-full bg-white px-3 py-2 text-[12px] text-stone">
                    3 saved posts
                  </div>
                </div>

                <div className="map-grid relative h-[440px] overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#f8faf5_0%,#eef4e9_100%)]">
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded-full bg-white/90 px-4 py-2 text-[12px] text-stone shadow-[var(--shadow-sm)]">
                    <span>Bedford-Stuyvesant</span>
                    <span>20 min travel radius</span>
                  </div>

                  <div className="absolute left-[12%] top-[18%] h-[130px] w-[180px] rounded-full bg-sage-100/60 blur-2xl" />
                  <div className="absolute right-[8%] top-[38%] h-[180px] w-[180px] rounded-full bg-peach-100/70 blur-3xl" />
                  <div className="absolute bottom-[10%] left-[14%] h-[120px] w-[140px] rounded-full bg-amber-100/80 blur-2xl" />

                  <div className="pin pin-standard left-[22%] top-[24%]">
                    <div className="pin-dot">1</div>
                    <div className="pin-stem" />
                  </div>
                  <div className="pin pin-highlight left-[56%] top-[39%]">
                    <div className="pin-dot">2</div>
                    <div className="pin-stem" />
                  </div>
                  <div className="pin pin-standard left-[76%] top-[23%]">
                    <div className="pin-dot">3</div>
                    <div className="pin-stem" />
                  </div>

                  <div className="nearby-dot left-[48%] top-[28%]">Library</div>
                  <div className="nearby-dot left-[64%] top-[52%]">Coffee shop</div>
                  <div className="nearby-dot left-[37%] top-[58%]">Bus stop</div>
                  <div className="nearby-dot left-[71%] top-[70%]">Pharmacy</div>
                  <div className="nearby-dot left-[18%] top-[68%]">
                    Community garden
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 rounded-[20px] bg-white/95 p-4 shadow-[var(--shadow-md)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="rounded-full bg-peach-100 px-3 py-1 text-[11px] font-medium text-peach-700">
                          Highlighted recommendation
                        </p>
                        <h4 className="mt-3 text-[16px] font-medium text-forest">
                          Need two people to help carry groceries up one flight
                        </h4>
                        <p className="mt-2 text-[13px] leading-[1.55] text-stone">
                          0.4 miles away, close to the library and easy to reach
                          by bus. Great match for your evening availability.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-sage-50 px-3 py-2 text-right text-[11px] text-sage-700">
                        <p className="font-medium">92% match</p>
                        <p>Open today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-stone">
                      Recommended for you
                    </p>
                    <h3 className="mt-1 text-[18px] font-medium text-forest">
                      Sorted by profile match
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-medium">
                    <span className="rounded-full bg-sage-100 px-3 py-2 text-sage-700">
                      Skills
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-stone">
                      Distance
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-stone">
                      Availability
                    </span>
                  </div>
                </div>

                {recommendedPosts.map((post, index) => {
                  const isHighlighted = index === 0;

                  return (
                    <article
                      key={post.title}
                      className={`surface-card rounded-[20px] p-5 ${
                        isHighlighted
                          ? "border-peach-200 bg-peach-50/70"
                          : "hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)]"
                      }`}
                    >
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                            post.color === "peach"
                              ? "bg-peach-100 text-peach-700"
                              : "bg-sage-100 text-sage-700"
                          }`}
                        >
                          {post.category}
                        </span>
                        <span className="rounded-full bg-stone-light px-3 py-1 text-[11px] font-medium text-stone">
                          {post.urgency}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full text-[13px] font-medium ${
                            post.color === "peach"
                              ? "bg-peach-200 text-peach-700"
                              : "bg-sage-100 text-sage-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="text-[16px] font-medium leading-[1.4] text-forest">
                                {post.title}
                              </h4>
                              <p className="mt-1 text-[12px] text-stone">
                                {post.neighborhood} • {post.distance}
                              </p>
                            </div>
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-[#806020]">
                              {post.match}
                            </span>
                          </div>

                          <p className="mt-3 text-[13px] leading-[1.6] text-stone">
                            {post.description}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                            <div>
                              <p className="text-[11px] font-medium text-forest">
                                Nearby
                              </p>
                              <p className="text-[12px] text-stone">{post.nearby}</p>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-[13px] font-medium text-forest hover:bg-stone-light"
                                href="/"
                              >
                                Save
                              </Link>
                              <Link
                                className={`rounded-full px-4 py-2 text-[13px] font-medium ${
                                  isHighlighted
                                    ? "bg-peach-500 text-forest hover:bg-peach-400"
                                    : "bg-sage-600 text-white hover:bg-sage-700"
                                }`}
                                href="/"
                              >
                                {isHighlighted ? "Offer to help" : "View details"}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="section-shell rounded-[24px] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-[18px] font-medium text-sage-700">
                  SJ
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-stone">
                    My profile
                  </p>
                  <h3 className="text-[18px] font-medium text-forest">
                    Sara in Bed-Stuy
                  </h3>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-stone-light p-3 text-center">
                  <p className="text-[22px] font-medium leading-none text-forest">
                    14
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-stone">
                    Helps done
                  </p>
                </div>
                <div className="rounded-2xl bg-stone-light p-3 text-center">
                  <p className="text-[22px] font-medium leading-none text-forest">
                    4.9
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-stone">
                    Rating
                  </p>
                </div>
                <div className="rounded-2xl bg-stone-light p-3 text-center">
                  <p className="text-[22px] font-medium leading-none text-forest">
                    20m
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-stone">
                    Travel
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-medium text-forest">Skills and interests</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-sage-100 px-3 py-2 text-[11px] font-medium text-sage-700">
                    Tech support
                  </span>
                  <span className="rounded-full bg-sage-100 px-3 py-2 text-[11px] font-medium text-sage-700">
                    Errands
                  </span>
                  <span className="rounded-full bg-sage-100 px-3 py-2 text-[11px] font-medium text-sage-700">
                    Gardening
                  </span>
                  <span className="rounded-full bg-peach-100 px-3 py-2 text-[11px] font-medium text-peach-700">
                    Weekday evenings
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-[20px] bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-stone">
                  If your profile is empty
                </p>
                <p className="mt-2 text-[13px] leading-[1.6] text-stone">
                  Gather switches to nearest-first recommendations and invites
                  you to answer a short AI chat to improve the matches.
                </p>
                <Link
                  className="mt-4 inline-flex rounded-full bg-sage-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-sage-700"
                  href="/"
                >
                  Complete profile with AI
                </Link>
              </div>
            </section>

            <section className="section-shell rounded-[24px] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-stone">
                Nearby right now
              </p>
              <h3 className="mt-1 text-[18px] font-medium text-forest">
                Places that make coordination easier
              </h3>

              <ul className="mt-4 space-y-3">
                {nearbyPlaces.map((place) => (
                  <li
                    key={place.name}
                    className="flex items-center justify-between rounded-[18px] bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-forest">
                        {place.name}
                      </p>
                      <p className="text-[12px] text-stone">{place.note}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-[#806020]">
                      Nearby
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[24px] bg-sage-700 p-5 text-white shadow-[var(--shadow-md)]">
              <p className="text-[10px] uppercase tracking-[0.18em] text-sage-100">
                Sign up journey
              </p>
              <h3 className="mt-2 display-text text-[28px] leading-[1.15]">
                Start with a short AI chat, then confirm your profile.
              </h3>
              <p className="mt-3 text-[13px] leading-[1.6] text-sage-100">
                Share what you can help with, your neighborhood, travel time,
                and availability. We turn that into recommendations you can act
                on fast.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/12 px-3 py-2 text-[11px]">
                  Skills
                </span>
                <span className="rounded-full bg-white/12 px-3 py-2 text-[11px]">
                  Travel time
                </span>
                <span className="rounded-full bg-white/12 px-3 py-2 text-[11px]">
                  Availability
                </span>
                <span className="rounded-full bg-white/12 px-3 py-2 text-[11px]">
                  Neighborhood
                </span>
              </div>
            </section>
          </aside>
        </section>

        <footer className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-5 text-[12px] text-stone md:flex-row md:items-center md:justify-between">
          <p>Gather helps neighbors discover the right way to show up locally.</p>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-full px-3 py-2 hover:bg-sage-50" href="/">
              Recommended
            </Link>
            <Link className="rounded-full px-3 py-2 hover:bg-sage-50" href="/">
              Posts
            </Link>
            <Link className="rounded-full px-3 py-2 hover:bg-sage-50" href="/">
              Messages
            </Link>
            <Link className="rounded-full px-3 py-2 hover:bg-sage-50" href="/">
              Profile
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
