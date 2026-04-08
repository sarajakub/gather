import React from 'react';
import Link from 'next/link';
import { FeedIcon, MapIcon, MessageIcon, ProfileIcon, PostIcon } from './Icons';
import styles from './BottomNav.module.css';

const BottomNav = ({ activeTab, hasNotification }) => {
  const tabs = [
    { id: 'feed', label: 'Feed', href: '/home', icon: FeedIcon },
    { id: 'map', label: 'Map', href: '/map', icon: MapIcon },
    { id: 'messages', label: 'Messages', href: '/messages', icon: MessageIcon },
    { id: 'profile', label: 'Profile', href: '/profile', icon: ProfileIcon },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <Icon className={styles.icon} />
              <span className={styles.label}>{tab.label}</span>
              {tab.id === 'messages' && hasNotification && (
                <span
                  className={styles.badge}
                  aria-label="1 new notification"
                />
              )}
            </Link>
          );
        })}
      </div>

      <Link
        href="/post"
        className={styles.fab}
        aria-label="Share a need"
        title="Share a need"
      >
        <PostIcon className={styles.fabIcon} />
      </Link>
    </nav>
  );
};

export default BottomNav;
