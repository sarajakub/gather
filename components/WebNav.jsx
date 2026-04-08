'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { hasUnreadInbox } from '@/data/mockCommunity';
import styles from './WebNav.module.css';

const ITEMS = [
  { href: '/home', label: 'Feed' },
  { href: '/commitments', label: 'Commitments' },
  { href: '/messages', label: 'Messages' },
  { href: '/profile', label: 'Profile' },
  { href: '/post', label: 'Post a need' },
];

export default function WebNav({ activePath = '/home', showUnreadDot = true }) {
  const [hasUnread, setHasUnread] = useState(hasUnreadInbox);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('gather-messages');
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return;
      }

      const unread = parsed.some((item) => item.direction === 'inbox' && item.unread);
      setHasUnread(unread);
    } catch {
      setHasUnread(hasUnreadInbox);
    }
  }, []);

  return (
    <header className={styles.topbar}>
      <Link href="/home" className={styles.brand}>
        Gather
      </Link>

      <nav className={styles.desktopNav}>
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${activePath === item.href ? styles.navLinkActive : ''}`}
          >
            {item.label}
            {item.href === '/messages' && showUnreadDot && hasUnread && activePath !== '/messages' && (
              <span className={styles.unreadDot} aria-hidden="true" />
            )}
          </Link>
        ))}
      </nav>

      <select
        className={styles.mobileNavSelect}
        value={activePath}
        onChange={(event) => {
          window.location.href = event.target.value;
        }}
        aria-label="Navigate pages"
      >
        {ITEMS.map((item) => (
          <option key={item.href} value={item.href}>
            {item.label}
          </option>
        ))}
      </select>
    </header>
  );
}
