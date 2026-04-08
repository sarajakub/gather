import Link from 'next/link';
import { people } from '@/data/mockCommunity';
import styles from './PersonProfilePage.module.css';

export default function PersonProfilePage({ slug }) {
  const person = people[slug] || null;

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
