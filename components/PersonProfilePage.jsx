import Link from 'next/link';
import { people, posts } from '@/data/mockCommunity';
import styles from './PersonProfilePage.module.css';

export default function PersonProfilePage({ slug }) {
  const person = people[slug] || null;
  const activePosts = posts.filter((post) => post.personSlug === slug);

  if (!person) {
    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <h1 className={styles.title}>Neighbor not found</h1>
          <Link href="/home" className={styles.backLink}>
            Back to feed
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.card}>
          <div className={styles.hero}>
            <div className={styles.avatar} style={{ backgroundColor: person.avatarBg }}>
              {person.initials}
            </div>
            <div>
              <h1 className={styles.title}>{person.name}</h1>
              <p className={styles.meta}>{person.neighborhood}</p>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{person.rating}</div>
              <div className={styles.statLabel}>Rating</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{person.helped}</div>
              <div className={styles.statLabel}>Helped</div>
            </div>
          </div>

          <p className={styles.bio}>{person.bio}</p>

          <section className={styles.activePostsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Active requests for help</h2>
              <span className={styles.sectionCount}>{activePosts.length}</span>
            </div>

            {activePosts.length > 0 ? (
              <div className={styles.activePostsList}>
                {activePosts.map((post) => (
                  <article key={post.id} className={styles.postItem}>
                    <p className={styles.postTitle}>{post.title}</p>
                    <p className={styles.postMeta}>
                      {post.timeframe} • {post.distance}
                    </p>
                    <p className={styles.postBody}>{post.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No active help requests right now.</p>
            )}
          </section>

          <div className={styles.actions}>
            <Link href={`/messages?to=${person.slug}`} className={styles.primaryBtn}>
              Message {person.name}
            </Link>
            <Link href="/home" className={styles.secondaryBtn}>
              Back to feed
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
