'use client';

import styles from './MapPage.module.css';

export default function MapPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Map</h1>
        <p className={styles.subtitle}>See nearby requests at a glance</p>
      </div>
      
      <div className={styles.mapPlaceholder}>
        <svg 
          className={styles.mapIcon}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path d="M12 2C7.58 2 4 5.58 4 10c0 6 8 12 8 12s8-6 8-12c0-4.42-3.58-8-8-8zm0 10.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <p className={styles.placeholderText}>No posts on the map right now.</p>
        <p className={styles.placeholderSubtext}>Try the home feed for requests just outside your usual area.</p>
      </div>
    </div>
  );
}
