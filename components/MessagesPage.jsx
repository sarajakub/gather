'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { currentUser, people, messages } from '@/data/mockCommunity';
import styles from './MessagesPage.module.css';

export default function MessagesPage({ searchParams = {} }) {
  const toParam = searchParams.to;
  const titleParam = searchParams.postTitle;
  const toSlug = Array.isArray(toParam) ? toParam[0] : toParam || 'marcus';
  const hasOfferContext = Boolean(toParam);
  const postTitle = Array.isArray(titleParam)
    ? titleParam[0]
    : titleParam || 'Community help request';
  const person = people[toSlug] || people.marcus;

  const [threadData, setThreadData] = useState(messages);
  const [query, setQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState(toSlug);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [draft, setDraft] = useState('');
  const [typingSlug, setTypingSlug] = useState(null);
  const replyTimeoutRef = useRef(null);

  const formatTimestamp = () => {
    const timeLabel = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `Today, ${timeLabel}`;
  };

  const buildAutoReply = (slug) => {
    const responseMap = {
      marcus: [
        'That works for me. Thank you for helping out.',
        'Perfect, see you then. I really appreciate it.',
      ],
      sofia: [
        'Amazing, thank you. That time should work well.',
        'Great, I can confirm that schedule on my side.',
      ],
      james: [
        'Thanks so much. I will have everything ready.',
        'Appreciate it. I can meet you at the front entrance.',
      ],
    };

    const options = responseMap[slug] || ['Thanks for the update. That sounds good to me.'];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  };

  const canSend = useMemo(
    () => draft.trim().length > 0 && (!hasOfferContext || (date && time)),
    [date, draft, hasOfferContext, time]
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('gather-messages');
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setThreadData(parsed);
      }
    } catch {
      setThreadData(messages);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('gather-messages', JSON.stringify(threadData));
  }, [threadData]);

  const sortedMessages = useMemo(
    () => [...threadData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [threadData]
  );

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortedMessages.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      const sender = people[item.personSlug];
      const haystack = [
        sender?.name || '',
        item.postTitle,
        item.body,
        item.timestamp,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, sortedMessages]);

  const conversations = useMemo(() => {
    const map = new Map();

    filteredMessages.forEach((item) => {
      map.set(item.personSlug, item);
    });

    return Array.from(map.values()).reverse();
  }, [filteredMessages]);

  useEffect(() => {
    if (hasOfferContext) {
      setSelectedSlug(toSlug);
      return;
    }

    const exists = conversations.some((conversation) => conversation.personSlug === selectedSlug);
    if (!exists && conversations.length > 0) {
      setSelectedSlug(conversations[0].personSlug);
    }
  }, [conversations, hasOfferContext, selectedSlug, toSlug]);

  const activeSlug = hasOfferContext ? toSlug : selectedSlug || toSlug;
  const activePerson = people[activeSlug] || person;

  const threadMessages = useMemo(() => {
    const subset = filteredMessages.filter((item) => item.personSlug === activeSlug);
    return [...subset].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [activeSlug, filteredMessages]);

  useEffect(() => {
    setThreadData((prev) =>
      prev.map((item) =>
        item.personSlug === activeSlug && item.direction === 'inbox'
          ? { ...item, unread: false }
          : item
      )
    );
  }, [activeSlug]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        window.clearTimeout(replyTimeoutRef.current);
      }
      setTypingSlug(null);
    };
  }, []);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    const extraLine = hasOfferContext ? `I can help on ${date} at ${time}.` : '';
    const composedBody = [extraLine, draft.trim()].filter(Boolean).join(' ');

    const timestamp = formatTimestamp();
    const sentAtIso = new Date().toISOString();

    setThreadData((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        direction: 'sent',
        unread: false,
        createdAt: sentAtIso,
        personSlug: activeSlug,
        postId: hasOfferContext ? Number(searchParams.postId || 0) : 0,
        postTitle,
        body: composedBody,
        timestamp,
      },
    ]);

    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
    }

    const targetSlug = activeSlug;
    const targetTitle = postTitle;
    setTypingSlug(targetSlug);
    replyTimeoutRef.current = window.setTimeout(() => {
      setThreadData((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}-auto`,
          direction: 'inbox',
          unread: false,
          createdAt: new Date().toISOString(),
          personSlug: targetSlug,
          postId: hasOfferContext ? Number(searchParams.postId || 0) : 0,
          postTitle: targetTitle,
          body: buildAutoReply(targetSlug),
          timestamp: formatTimestamp(),
        },
      ]);
      setTypingSlug(null);
    }, 1600);

    setDraft('');
    if (hasOfferContext) {
      setDate('');
      setTime('');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.subtitle}>Inbox and sent messages for your neighborhood help requests.</p>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.sidebarCard}>
          <div className={styles.controlsRow}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search messages, names, or posts"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className={styles.conversationList}>
            {conversations.map((item) => {
              const sender = people[item.personSlug] || person;
              const isActive = sender.slug === activeSlug;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.conversationItem} ${isActive ? styles.conversationItemActive : ''}`}
                  onClick={() => setSelectedSlug(sender.slug)}
                >
                  <div className={styles.conversationAvatar} style={{ backgroundColor: sender.avatarBg }}>
                    {sender.initials}
                  </div>
                  <div className={styles.conversationMain}>
                    <div className={styles.conversationTop}>
                      <span className={styles.conversationNameWrap}>
                        <span className={styles.conversationName}>{sender.name}</span>
                        {item.unread && <span className={styles.unreadConversationDot} aria-hidden="true" />}
                      </span>
                      <span className={styles.timeText}>{item.timestamp}</span>
                    </div>
                    <p className={styles.conversationMeta}>{item.postTitle}</p>
                    <p className={styles.conversationPreview}>{item.body}</p>
                  </div>
                </button>
              );
            })}
            {conversations.length === 0 && <p className={styles.noResults}>No messages match your search.</p>}
          </div>
        </section>

        <section className={styles.threadCard}>
          <div className={styles.threadHeader}>
            <Link href={`/people/${activePerson.slug}`} className={styles.threadPersonLink}>
              <div className={styles.threadAvatar} style={{ backgroundColor: activePerson.avatarBg }}>
                {activePerson.initials}
              </div>
              <div>
                <div className={styles.threadName}>{activePerson.name}</div>
                <div className={styles.threadSub}>Tap to view profile</div>
              </div>
            </Link>
          </div>

          <div className={styles.messagesList}>
            {threadMessages.map((item) => {
              const isInbox = item.direction === 'inbox';
              return (
                <article
                  key={item.id}
                  className={`${styles.messageBubble} ${isInbox ? styles.messageBubbleInbox : styles.messageBubbleSent}`}
                >
                  <p className={styles.messageBody}>{item.body}</p>
                  <div className={styles.messageBubbleMeta}>
                    <span className={styles.timeText}>{item.timestamp}</span>
                  </div>
                </article>
              );
            })}
            {typingSlug === activeSlug && (
              <div className={styles.typingRow}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingLabel}>{activePerson.name} is typing...</span>
              </div>
            )}
            {threadMessages.length === 0 && (
              <p className={styles.noResults}>No chat history for this conversation with the current filters.</p>
            )}
          </div>

          {hasOfferContext && (
            <>
              <h2 className={styles.sectionTitle}>Send availability to {activePerson.name}</h2>
              <p className={styles.postTitle}>{postTitle}</p>
              <form className={styles.form} onSubmit={handleSendMessage}>
                <label className={styles.label} htmlFor="offer-date">
                  Date you can help
                </label>
                <input
                  id="offer-date"
                  className={styles.input}
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />

                <label className={styles.label} htmlFor="offer-time">
                  Time you can help
                </label>
                <input
                  id="offer-time"
                  className={styles.input}
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />

                <label className={styles.label} htmlFor="offer-note">
                  Message
                </label>
                <textarea
                  id="offer-note"
                  className={styles.textarea}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={4}
                  placeholder="Write your reply"
                />

                <button type="submit" className={styles.sendBtn} disabled={!canSend}>
                  Send message
                </button>
              </form>
            </>
          )}

          {!hasOfferContext && (
            <form className={styles.form} onSubmit={handleSendMessage}>
              <label className={styles.label} htmlFor="reply-message">
                Reply to {activePerson.name}
              </label>
              <textarea
                id="reply-message"
                className={styles.textarea}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={4}
                placeholder="Write your message"
              />
              <button type="submit" className={styles.sendBtn} disabled={!canSend}>
                Send message
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
