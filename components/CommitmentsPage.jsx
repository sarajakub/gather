import Link from 'next/link';
import WebNav from './WebNav';
import { commitments, people } from '@/data/mockCommunity';
import styles from './CommitmentsPage.module.css';

export default function CommitmentsPage() {
  const upcoming = commitments.filter((item) => item.status === 'upcoming');
  const completed = commitments.filter((item) => item.status === 'completed');

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <WebNav activePath="/commitments" />
        <header className={styles.header}>
          <h1 className={styles.title}>Your commitments</h1>
          <p className={styles.subtitle}>Track what you promised and what you completed.</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming</h2>
          <div className={styles.list}>
            {upcoming.map((item) => {
              const person = people[item.personSlug];
              return (
                <article key={item.id} className={styles.itemCard}>
                  <div>
                    <p className={styles.itemTitle}>{item.title}</p>
                    <p className={styles.itemMeta}>{item.when}</p>
                  </div>
                  <Link className={styles.personLink} href={`/people/${person.slug}`}>
                    {person.name}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Completed</h2>
          <div className={styles.list}>
            {completed.map((item) => {
              const person = people[item.personSlug];
              return (
                <article key={item.id} className={styles.itemCard}>
                  <div>
                    <p className={styles.itemTitle}>{item.title}</p>
                    <p className={styles.itemMeta}>{item.when}</p>
                  </div>
                  <Link className={styles.personLink} href={`/people/${person.slug}`}>
                    {person.name}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
