'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { people, messages } from '@/data/mockCommunity';
import styles from './MessagesPage.module.css';

const FALLBACK_AVATAR_BACKGROUNDS = [
  'var(--color-peach-100)',
  'var(--color-sage-100)',
  'var(--color-stone-light)',
  'var(--color-amber-100)',
];
const TIME_OPTIONS = [
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
];

function getInitials(name) {
  if (!name) {
    return '?';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function getAvatarBackground(slug) {
  const seed = Array.from(slug || '').reduce((total, character) => total + character.charCodeAt(0), 0);
  return FALLBACK_AVATAR_BACKGROUNDS[seed % FALLBACK_AVATAR_BACKGROUNDS.length];
}

function buildFallbackPerson({ slug, name, neighborhood }) {
  return {
    slug,
    name: name || 'Neighbor',
    neighborhood: neighborhood || 'NYC',
    initials: getInitials(name || 'Neighbor'),
    avatarBg: getAvatarBackground(slug),
    rating: null,
    helped: null,
    bio: '',
  };
}

function getPersonRecord({ slug, message, toSlug, personName, personNeighborhood }) {
  if (people[slug]) {
    return people[slug];
  }

  const fallbackName =
    message?.personName ||
    (slug === toSlug ? personName : '') ||
    'Neighbor';
  const fallbackNeighborhood =
    message?.personNeighborhood ||
    (slug === toSlug ? personNeighborhood : '') ||
    'NYC';

  return buildFallbackPerson({
    slug,
    name: fallbackName,
    neighborhood: fallbackNeighborhood,
  });
}

function getTodayDateValue() {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localNow.toISOString().slice(0, 10);
}

function getFirstName(name) {
  return name.split(' ').filter(Boolean)[0] || 'there';
}

function getDefaultOfferMessage(name, postTitle) {
  const firstName = getFirstName(name);
  return `Hi ${firstName}! I would be happy to help you with your request${postTitle ? ` for "${postTitle}"` : ''}. Let me know if this time works well for you.`;
}

export default function MessagesPage({ searchParams = {} }) {
  const router = useRouter();
  const toParam = searchParams.to;
  const titleParam = searchParams.postTitle;
  const modeParam = searchParams.mode;
  const nameParam = searchParams.name;
  const neighborhoodParam = searchParams.neighborhood;
  const dateParam = searchParams.date;
  const timeParam = searchParams.time;
  const noteParam = searchParams.note;
  const activityParam = searchParams.activity;
  const postIdParam = searchParams.postId;

  const toSlug = Array.isArray(toParam) ? toParam[0] : toParam || 'marcus';
  const personName = Array.isArray(nameParam) ? nameParam[0] : nameParam || '';
  const personNeighborhood = Array.isArray(neighborhoodParam) ? neighborhoodParam[0] : neighborhoodParam || '';
  const mode = Array.isArray(modeParam) ? modeParam[0] : modeParam || '';
  const postId = Array.isArray(postIdParam) ? postIdParam[0] : postIdParam || 0;
  const hasPostId = Boolean(postId);
  const hasOfferContext = mode === 'reschedule' || mode === 'offer' || hasPostId;
  const isRescheduleContext = mode === 'reschedule';
  const presetDate = Array.isArray(dateParam) ? dateParam[0] : dateParam || '';
  const presetTime = Array.isArray(timeParam) ? timeParam[0] : timeParam || '';
  const presetNote = Array.isArray(noteParam) ? noteParam[0] : noteParam || '';
  const activityTitle = Array.isArray(activityParam) ? activityParam[0] : activityParam || '';
  const postTitle = Array.isArray(titleParam)
    ? titleParam[0]
    : titleParam || activityTitle || 'Community help request';
  const requestedPerson = people[toSlug] || buildFallbackPerson({
    slug: toSlug,
    name: personName,
    neighborhood: personNeighborhood,
  });
  const defaultOfferDate = presetDate || (hasOfferContext ? getTodayDateValue() : '');
  const defaultOfferMessage = presetNote || (
    hasOfferContext
      ? getDefaultOfferMessage(requestedPerson.name, postTitle)
      : ''
  );

  const [threadData, setThreadData] = useState(() => {
    if (typeof window === 'undefined') {
      return messages;
    }

    try {
      const stored = window.localStorage.getItem('gather-messages');
      if (!stored) {
        return messages;
      }

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : messages;
    } catch {
      return messages;
    }
  });
  const [query, setQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState(toSlug);
  const [date, setDate] = useState(defaultOfferDate);
  const [time, setTime] = useState(presetTime);
  const [draft, setDraft] = useState(defaultOfferMessage);
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

      const sender = getPersonRecord({
        slug: item.personSlug,
        message: item,
        toSlug,
        personName,
        personNeighborhood,
      });
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
  }, [personNeighborhood, personName, query, sortedMessages, toSlug]);

  const conversations = useMemo(() => {
    const map = new Map();

    filteredMessages.forEach((item) => {
      if (!map.has(item.personSlug)) {
        map.set(item.personSlug, item);
      }
    });

    return Array.from(map.values());
  }, [filteredMessages]);
  const conversationSlugs = useMemo(
    () => new Set(conversations.map((conversation) => conversation.personSlug)),
    [conversations]
  );
  const activeSlug = hasOfferContext
    ? toSlug
    : conversationSlugs.has(selectedSlug)
      ? selectedSlug
      : conversations[0]?.personSlug || toSlug;
  const activeMessage = useMemo(
    () => sortedMessages.find((item) => item.personSlug === activeSlug) || null,
    [activeSlug, sortedMessages]
  );
  const activePerson = getPersonRecord({
    slug: activeSlug,
    message: activeMessage,
    toSlug,
    personName,
    personNeighborhood,
  }) || requestedPerson;
  const hasKnownProfile = Boolean(people[activeSlug]);

  const threadMessages = useMemo(() => {
    const subset = filteredMessages.filter((item) => item.personSlug === activeSlug);
    return [...subset].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [activeSlug, filteredMessages]);
  const showOfferComposer = hasOfferContext && threadMessages.length === 0;

  const markConversationAsRead = useCallback((slug) => {
    setThreadData((prev) => {
      let didChange = false;

      const next = prev.map((item) => {
        if (item.personSlug === slug && item.direction === 'inbox' && item.unread) {
          didChange = true;
          return { ...item, unread: false };
        }

        return item;
      });

      return didChange ? next : prev;
    });
  }, []);

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

    const extraLine = showOfferComposer
      ? isRescheduleContext
        ? `Reschedule request for ${postTitle}: ${date} at ${time}.`
        : `I can help on ${date} at ${time}.`
      : '';
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
          personName: activePerson.name,
          personNeighborhood: activePerson.neighborhood,
          postId: hasOfferContext ? postId : 0,
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
          personName: activePerson.name,
          personNeighborhood: activePerson.neighborhood,
          postId: hasOfferContext ? postId : 0,
          postTitle: targetTitle,
          body: buildAutoReply(targetSlug),
          timestamp: formatTimestamp(),
        },
      ]);
      setTypingSlug(null);
    }, 1600);

    setDraft('');
    if (showOfferComposer) {
      setDate(getTodayDateValue());
      setTime('');
    }

    router.replace('/messages');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.subtitle}>Talk with neighbors, confirm plans, and keep each other in the loop.</p>
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
              const sender = getPersonRecord({
                slug: item.personSlug,
                message: item,
                toSlug,
                personName,
                personNeighborhood,
              });
              const isActive = sender.slug === activeSlug;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.conversationItem} ${isActive ? styles.conversationItemActive : ''}`}
                  onClick={() => {
                    setSelectedSlug(sender.slug);
                    markConversationAsRead(sender.slug);
                  }}
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
            {conversations.length === 0 && (
              <p className={styles.noResults}>
                No messages yet. Once you offer to help someone or someone replies to your post, you&apos;ll see it here.
              </p>
            )}
          </div>
        </section>

        <section className={styles.threadCard}>
          <div className={styles.threadHeader}>
            {hasKnownProfile ? (
              <Link href={`/people/${activePerson.slug}`} className={styles.threadPersonLink}>
                <div className={styles.threadAvatar} style={{ backgroundColor: activePerson.avatarBg }}>
                  {activePerson.initials}
                </div>
                <div>
                  <div className={styles.threadName}>{activePerson.name}</div>
                  <div className={styles.threadSub}>See their profile</div>
                </div>
              </Link>
            ) : (
              <div className={styles.threadPersonCard}>
                <div className={styles.threadAvatar} style={{ backgroundColor: activePerson.avatarBg }}>
                  {activePerson.initials}
                </div>
                <div>
                  <div className={styles.threadName}>{activePerson.name}</div>
                  <div className={styles.threadSub}>{activePerson.neighborhood}</div>
                </div>
              </div>
            )}
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
              <p className={styles.noResults}>No notes in this thread yet.</p>
            )}
          </div>

          {showOfferComposer && (
            <>
              <h2 className={styles.sectionTitle}>
                {isRescheduleContext
                  ? `Request a new time with ${activePerson.name}`
                  : `Send availability to ${activePerson.name}`}
              </h2>
              <p className={styles.postTitle}>{postTitle}</p>
              <form className={styles.form} onSubmit={handleSendMessage}>
                <label className={styles.label} htmlFor="offer-date">
                  {isRescheduleContext ? 'Proposed new date' : 'Date you can help'}
                </label>
                <input
                  id="offer-date"
                  className={styles.input}
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />

                <label className={styles.label} htmlFor="offer-time">
                  {isRescheduleContext ? 'Proposed new time' : 'Time you can help'}
                </label>
                <select
                  id="offer-time"
                  className={styles.input}
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                >
                  <option value="">
                    {isRescheduleContext ? 'Choose a new time' : 'Choose a time'}
                  </option>
                  {TIME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label className={styles.label} htmlFor="offer-note">
                  {isRescheduleContext ? 'Reason / note' : 'Note'}
                </label>
                <textarea
                  id="offer-note"
                  className={styles.textarea}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={4}
                  placeholder={
                    isRescheduleContext
                      ? 'Share why you need to move the time'
                      : 'Write your note'
                  }
                />

                <button type="submit" className={styles.sendBtn} disabled={!canSend}>
                  Send a note
                </button>
              </form>
            </>
          )}

          {!showOfferComposer && (
            <form className={styles.form} onSubmit={handleSendMessage}>
              <label className={styles.label} htmlFor="reply-message">
                Reply to {activePerson.name}
              </label>
              <input
                id="reply-message"
                className={styles.input}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write your note"
              />
              <button type="submit" className={styles.sendBtn} disabled={!canSend}>
                Send a note
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
