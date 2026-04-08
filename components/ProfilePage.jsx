'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const [profile] = useState({
    name: 'Diane',
    neighborhood: 'Inwood',
    initials: 'D',
    avatar: { bg: '#E0EED0' },
    helped: 8,
    rating: 4.9,
    travelTime: '20 min',
    skills: ['Babysitting', 'French', 'Dog walking', 'Cooking', 'Tech help'],
    languages: ['English', 'French', 'Spanish'],
    availability: ['Weekday evenings', 'Saturday mornings'],
  });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/home" className={styles.backBtn} aria-label="Back">
          ← Back
        </Link>
        <h1>Your Profile</h1>
      </header>

      <section className={styles.profileHero}>
        <div className={styles.avatarLarge} style={{ backgroundColor: profile.avatar.bg }}>
          {profile.initials}
        </div>
        <div className={styles.profileTitle}>
          <h2>{profile.name}</h2>
          <p className={styles.neighborhood}>{profile.neighborhood}</p>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <div className={styles.stat}>
          <div className={styles.statNumber}>{profile.helped}</div>
          <div className={styles.statLabel}>Times helped</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>{profile.rating}</div>
          <div className={styles.statLabel}>Rating</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>{profile.travelTime}</div>
          <div className={styles.statLabel}>Travel range</div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Skills you offer</h3>
          <button className={styles.editBtn}>Edit</button>
        </div>
        <div className={styles.tags}>
          {profile.skills.map((skill) => (
            <span key={skill} className={styles.tag}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Languages</h3>
          <button className={styles.editBtn}>Edit</button>
        </div>
        <div className={styles.tags}>
          {profile.languages.map((lang) => (
            <span key={lang} className={styles.tag}>
              {lang}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Your availability</h3>
          <button className={styles.editBtn}>Edit</button>
        </div>
        <div className={styles.tags}>
          {profile.availability.map((time) => (
            <span key={time} className={`${styles.tag} ${styles.tagTime}`}>
              {time}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <button className={styles.logoutBtn}>Sign out</button>
      </section>

      <div className={styles.bottomNavSpacer} />
      <BottomNav activeTab="profile" hasNotification={true} />
    </main>
  );
};

export default ProfilePage;
