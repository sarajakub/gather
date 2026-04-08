'use client';

import BottomNav from './BottomNav';
import styles from './MessagesPage.module.css';

export default function MessagesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.subtitle}>Your conversations</p>
      </div>
      
      <div className={styles.emptyState}>
        <svg 
          className={styles.emptyIcon}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p className={styles.emptyText}>No messages yet</p>
        <p className={styles.emptySubtext}>Start offering help to connect with your community</p>
      </div>

      <div className={styles.bottomNavSpacer} />
      <BottomNav activeTab="messages" hasNotification={true} />
    </div>
  );
}
