import Link from "next/link";
import { helpRequests } from "@/data/helpRequests";
import styles from "./LandingPage.module.css";

const APP_FEATURES = [
  {
    title: "Find nearby needs quickly",
    description:
      "Browse requests by area, urgency, and category so neighbors can respond to real needs faster.",
  },
  {
    title: "Offer help with one click",
    description:
      "Start support conversations from any request and coordinate details without leaving the app.",
  },
  {
    title: "Stay organized with commitments",
    description:
      "Track upcoming help sessions, reschedule when plans change, and close the loop with reviews.",
  },
  {
    title: "Build community impact",
    description:
      "Unlock perks as you help more neighbors and celebrate the positive difference you make each week.",
  },
];

export default function LandingPage() {
  const neighborhoodCount = new Set(helpRequests.map((request) => request.neighborhood)).size;
  const categoryCount = new Set(helpRequests.map((request) => request.category)).size;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.heroGrid}>
          <article className={styles.heroCard}>
            <p className={styles.eyebrow}>Neighbors helping neighbors</p>
            <h1 className={styles.heroTitle}>Bringing the village back.</h1>
            <p className={styles.heroBody}>
              Gather is a local mutual-aid app that makes it easy to ask for support, offer care, and show
              up for each other every day.
            </p>
            <div className={styles.heroActions}>
              <Link href="/signup" className={styles.primaryCta}>
                Get started
              </Link>
              <Link href="/home" className={styles.secondaryCta}>
                Explore live requests
              </Link>
            </div>
          </article>

          <aside className={styles.statsCard}>
            <p className={styles.eyebrow}>This week in Gather</p>
            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <p className={styles.statNumber}>{helpRequests.length}</p>
                <p className={styles.statLabel}>Open requests</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statNumber}>{neighborhoodCount}</p>
                <p className={styles.statLabel}>Neighborhoods</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statNumber}>{categoryCount}</p>
                <p className={styles.statLabel}>Need types</p>
              </div>
            </div>
          </aside>
        </section>

        <section className={styles.missionSection}>
          <p className={styles.eyebrow}>Mission</p>
          <h2 className={styles.sectionTitle}>Make asking and offering help feel normal, local, and immediate.</h2>
          <p className={styles.sectionBody}>
            Gather is a porch between your door and your neighborhood. It gives people a simple way to wave,
            ask, offer, and follow through when everyday life gets heavy.
          </p>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.featuresHeader}>
            <p className={styles.eyebrow}>Why Gather works</p>
            <h2 className={styles.sectionTitle}>Purpose-built features for real community care</h2>
          </div>
          <div className={styles.featuresGrid}>
            {APP_FEATURES.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureBody}>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
          <h2 className={styles.finalCtaTitle}>Welcome to the neighborhood.</h2>
          <p className={styles.finalCtaBody}>
            Create your profile in minutes and start giving or receiving help with people nearby.
          </p>
          <Link href="/signup" className={styles.primaryCta}>
            Join Gather
          </Link>
        </section>
      </div>
    </main>
  );
}
