"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { commitments, people, posts } from '@/data/mockCommunity';
import styles from './CommitmentsPage.module.css';

export default function CommitmentsPage() {
  const [viewMode, setViewMode] = useState('list');
  const [selectedId, setSelectedId] = useState(null);
  const [rescheduleRequests, setRescheduleRequests] = useState({});

  const withPost = useMemo(
    () =>
      commitments.map((item) => ({
        ...item,
        post: posts.find((post) => post.id === item.postId) || null,
      })),
    []
  );

  const byMostRecent = (items) =>
    [...items].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

  const upcoming = byMostRecent(withPost.filter((item) => item.status === 'upcoming'));
  const completed = byMostRecent(withPost.filter((item) => item.status === 'completed'));
  const allCommitments = byMostRecent(withPost);

  const currentDate = new Date('2026-04-08T12:00:00Z');

  const startOfWeek = (date) => {
    const value = new Date(date);
    const day = value.getUTCDay();
    const diff = (day + 6) % 7;
    value.setUTCDate(value.getUTCDate() - diff);
    value.setUTCHours(0, 0, 0, 0);
    return value;
  };

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setUTCDate(weekStart.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    const dayItems = byMostRecent(
      allCommitments.filter((item) => item.scheduledAt.slice(0, 10) === key)
    );
    return { date, items: dayItems };
  });

  const monthDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));
  const firstGridDay = startOfWeek(monthDate);
  const monthCells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDay);
    date.setUTCDate(firstGridDay.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    const dayItems = byMostRecent(
      allCommitments.filter((item) => item.scheduledAt.slice(0, 10) === key)
    );
    const inCurrentMonth = date.getUTCMonth() === monthDate.getUTCMonth();
    return { date, items: dayItems, inCurrentMonth };
  });

  const formatDay = (date) =>
    date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  const formatTime = (isoDate) =>
    new Date(isoDate).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });

  const selectedCommitment =
    allCommitments.find((item) => item.id === selectedId) || allCommitments[0] || null;

  const requestReschedule = (id) => {
    setRescheduleRequests((prev) => ({ ...prev, [id]: true }));
  };

  const renderCommitmentCard = (item, options = {}) => {
    const { showTime = false, showInlineProfile = true } = options;
    const person = people[item.personSlug];
    const active = selectedId === item.id;

    return (
      <article key={item.id} className={styles.itemCard}>
        <button
          type="button"
          className={`${styles.itemSummaryButton} ${active ? styles.itemSummaryButtonActive : ''} ${
            !showInlineProfile ? styles.itemSummaryCompact : ''
          }`}
          onClick={() => setSelectedId(item.id)}
        >
          <div>
            <p className={styles.itemTitle}>{item.title}</p>
            <p className={styles.itemMeta}>
              {item.when}
              {showTime ? ` • ${formatTime(item.scheduledAt)}` : ''}
            </p>
          </div>
          {showInlineProfile && (
            <div className={styles.summaryRight}>
              <span className={styles.personLink}>{person.name}</span>
              <span className={styles.expandHint}>{active ? 'Selected' : 'Open details'}</span>
            </div>
          )}
        </button>
      </article>
    );
  };

  const renderSelectedDetails = () => {
    if (!selectedCommitment) {
      return null;
    }

    const person = people[selectedCommitment.personSlug];
    const postTitle = selectedCommitment.post?.title || selectedCommitment.title;
    const postBody =
      selectedCommitment.post?.bodyFull ||
      selectedCommitment.post?.body ||
      'No post details available.';

    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Selected commitment</h2>
        <article className={styles.itemDetailsCard}>
          <p className={styles.detailsLabel}>Original posting</p>
          <p className={styles.detailsTitle}>{postTitle}</p>
          <p className={styles.detailsBody}>{postBody}</p>
          <p className={styles.detailsMeta}>
            {selectedCommitment.when} • {formatTime(selectedCommitment.scheduledAt)}
          </p>
          <div className={styles.detailsActions}>
            <Link className={styles.detailsLink} href={`/people/${person.slug}`}>
              View {person.name}&apos;s profile
            </Link>
            <button
              type="button"
              className={styles.rescheduleBtn}
              onClick={() => requestReschedule(selectedCommitment.id)}
              disabled={rescheduleRequests[selectedCommitment.id]}
            >
              {rescheduleRequests[selectedCommitment.id]
                ? 'Reschedule requested'
                : 'Request reschedule'}
            </button>
          </div>
        </article>
      </section>
    );
  };

  const renderListView = () => (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming</h2>
        <div className={styles.list}>
          {upcoming.map((item) => renderCommitmentCard(item, { showTime: true, showInlineProfile: true }))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Completed</h2>
        <div className={styles.list}>
          {completed.map((item) => renderCommitmentCard(item, { showTime: true, showInlineProfile: true }))}
        </div>
      </section>
    </>
  );

  const renderWeeklyView = () => (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Weekly calendar</h2>
      <div className={styles.weekGrid}>
        {weekDays.map((day) => (
          <article key={day.date.toISOString()} className={styles.calendarDayCard}>
            <p className={styles.calendarDayLabel}>{formatDay(day.date)}</p>
            {day.items.length > 0 ? (
              <div className={styles.calendarDayItems}>
                {day.items.map((item) => (
                  <div key={item.id} className={styles.calendarItemWrap}>
                    {renderCommitmentCard(item, { showTime: true, showInlineProfile: false })}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>No commitments</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );

  const renderMonthlyView = () => (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Monthly calendar</h2>
      <div className={styles.monthGrid}>
        {monthCells.map((cell) => (
          <article
            key={cell.date.toISOString()}
            className={`${styles.monthCell} ${cell.inCurrentMonth ? '' : styles.monthCellMuted}`}
          >
            <p className={styles.monthCellDay}>{cell.date.getUTCDate()}</p>
            {cell.items.map((item) => (
              <div key={item.id} className={styles.monthCellItemWrap}>
                {renderCommitmentCard(item, { showTime: true, showInlineProfile: false })}
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your commitments</h1>
          <p className={styles.subtitle}>Track what you promised and what you completed.</p>
        </header>

        <section className={styles.viewSwitcher}>
          <button
            type="button"
            className={`${styles.switchButton} ${viewMode === 'list' ? styles.switchButtonActive : ''}`}
            onClick={() => setViewMode('list')}
          >
            List view
          </button>
          <button
            type="button"
            className={`${styles.switchButton} ${viewMode === 'weekly' ? styles.switchButtonActive : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`${styles.switchButton} ${viewMode === 'monthly' ? styles.switchButtonActive : ''}`}
            onClick={() => setViewMode('monthly')}
          >
            Monthly
          </button>
        </section>

        {renderSelectedDetails()}

        {viewMode === 'list' && renderListView()}
        {viewMode === 'weekly' && renderWeeklyView()}
        {viewMode === 'monthly' && renderMonthlyView()}
      </div>
    </main>
  );
}
