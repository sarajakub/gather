"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { commitments, messages, people, posts } from '@/data/mockCommunity';
import styles from './CommitmentsPage.module.css';

export default function CommitmentsPage() {
  const [viewMode, setViewMode] = useState('list');
  const [listTab, setListTab] = useState('upcoming');
  const [selectedId, setSelectedId] = useState(null);
  const [rescheduleRequests, setRescheduleRequests] = useState({});
  const [rescheduleDraft, setRescheduleDraft] = useState({ date: '', time: '', note: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get('view');
    const requestedTab = params.get('tab');

    if (requestedView && ['list', 'weekly', 'monthly'].includes(requestedView)) {
      setViewMode(requestedView);
    }

    if (requestedTab && ['upcoming', 'past'].includes(requestedTab)) {
      setListTab(requestedTab);
    }
  }, []);

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

  const currentDate = new Date();

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

  const formatComposerDate = (rawDate) => {
    if (!rawDate) {
      return '';
    }

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) {
      return rawDate;
    }

    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatTimestamp = () => {
    const timeLabel = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `Today, ${timeLabel}`;
  };

  const selectedCommitment =
    allCommitments.find((item) => item.id === selectedId) || allCommitments[0] || null;

  const requestReschedule = (item) => {
    const scheduled = new Date(item.scheduledAt);
    const defaultDate = !Number.isNaN(scheduled.getTime()) ? scheduled.toISOString().slice(0, 10) : '';
    const defaultTime = !Number.isNaN(scheduled.getTime()) ? scheduled.toISOString().slice(11, 16) : '';

    setRescheduleRequests((prev) => ({ ...prev, [item.id]: true }));
    setRescheduleDraft({
      date: defaultDate,
      time: defaultTime,
      note: 'Could we move this to another time that works for both of us?',
    });
  };

  const handleSendReschedule = (item) => {
    const person = people[item.personSlug];
    if (!person || !rescheduleDraft.date || !rescheduleDraft.time || !rescheduleDraft.note.trim()) {
      return;
    }

    let existingMessages = messages;
    try {
      const stored = window.localStorage.getItem('gather-messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          existingMessages = parsed;
        }
      }
    } catch {
      existingMessages = messages;
    }

    const body = [
      `Reschedule request for: ${item.title}.`,
      `Current timing: ${item.when}.`,
      `Proposed new timing: ${formatComposerDate(rescheduleDraft.date)} at ${rescheduleDraft.time}.`,
      rescheduleDraft.note.trim(),
    ].join(' ');

    const nextMessages = [
      ...existingMessages,
      {
        id: `m-${Date.now()}-reschedule`,
        direction: 'sent',
        unread: false,
        createdAt: new Date().toISOString(),
        personSlug: person.slug,
        postId: item.postId || 0,
        postTitle: item.title,
        body,
        timestamp: formatTimestamp(),
      },
    ];

    window.localStorage.setItem('gather-messages', JSON.stringify(nextMessages));
    window.location.href = `/messages?to=${person.slug}`;
  };

  const renderCommitmentCard = (item, options = {}) => {
    const { showTime = false, showInlineProfile = true, compactMeta = false } = options;
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
              {compactMeta ? formatTime(item.scheduledAt) : item.when}
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
    const isRescheduleOpen = Boolean(rescheduleRequests[selectedCommitment.id]);

    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Commitment details</h2>
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
              onClick={() => requestReschedule(selectedCommitment)}
            >
              Request reschedule
            </button>
          </div>

          {isRescheduleOpen && (
            <div className={styles.rescheduleComposer}>
              <p className={styles.composerTitle}>Send request to {person.name}</p>
              <div className={styles.composerGrid}>
                <label className={styles.composerField}>
                  <span>New date</span>
                  <input
                    type="date"
                    value={rescheduleDraft.date}
                    onChange={(event) =>
                      setRescheduleDraft((prev) => ({ ...prev, date: event.target.value }))
                    }
                  />
                </label>
                <label className={styles.composerField}>
                  <span>New time</span>
                  <input
                    type="time"
                    value={rescheduleDraft.time}
                    onChange={(event) =>
                      setRescheduleDraft((prev) => ({ ...prev, time: event.target.value }))
                    }
                  />
                </label>
              </div>

              <label className={styles.composerField}>
                <span>Message</span>
                <textarea
                  rows={3}
                  value={rescheduleDraft.note}
                  onChange={(event) =>
                    setRescheduleDraft((prev) => ({ ...prev, note: event.target.value }))
                  }
                />
              </label>

              <div className={styles.composerActions}>
                <button
                  type="button"
                  className={styles.sendRescheduleBtn}
                  onClick={() => handleSendReschedule(selectedCommitment)}
                  disabled={!rescheduleDraft.date || !rescheduleDraft.time || !rescheduleDraft.note.trim()}
                >
                  Send reschedule message
                </button>
              </div>
            </div>
          )}
        </article>
      </section>
    );
  };

  const renderListView = () => (
    <>
      <section className={styles.section}>
        <div className={styles.listTabs}>
          <button
            type="button"
            className={`${styles.listTabButton} ${listTab === 'upcoming' ? styles.listTabButtonActive : ''}`}
            onClick={() => setListTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            type="button"
            className={`${styles.listTabButton} ${listTab === 'past' ? styles.listTabButtonActive : ''}`}
            onClick={() => setListTab('past')}
          >
            Past
          </button>
        </div>

        {listTab === 'upcoming' ? (
          <div className={styles.list}>
            {upcoming.map((item) =>
              renderCommitmentCard(item, { showTime: true, showInlineProfile: true })
            )}
          </div>
        ) : (
          <div className={styles.list}>
            {completed.map((item) =>
              renderCommitmentCard(item, { showTime: true, showInlineProfile: true })
            )}
          </div>
        )}
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
                    {renderCommitmentCard(item, { showInlineProfile: false, compactMeta: true })}
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
                {renderCommitmentCard(item, { showInlineProfile: false, compactMeta: true })}
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
          <p className={styles.subtitle}>Stay organized, update timing quickly, and keep neighbors in sync.</p>
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
