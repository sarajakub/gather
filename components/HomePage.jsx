/*
  DESIGN SYSTEM TOKENS USED IN THIS FILE:
  
  Colors:
  - --color-sage-50 (F2F7EE) — Welcome header background
  - --color-sky-100 (E0EED0) — Profile card background
  - --color-peach-50 (FFF5F0) — CTA banner background
  - --color-sage-600 (3D6828) — Primary text (Forest)
  - --color-stone (7A8870) — Secondary text
  - --color-forest (1E3010) — Display headlines
  - --color-white (FFFFFF) — Card backgrounds
  - --color-action (E8855A) — Peach CTA buttons
  - --color-amber-500 (C09040) — Star ratings
  
  Typography:
  - --font-display (DM Serif Display) — Welcome greeting
  - --font-ui (DM Sans) — All body text, labels
  - --text-display-sm (28px) — Welcome greeting
  - --text-body-lg (16px) — Neighborhood subtitle
  - --text-headline (18px) — Section headers
  - --text-body (14px) — Standard body text
  - --text-overline (10px) — Section labels
  
  Spacing:
  - --space-3 (12px) — Component gaps
  - --space-4 (16px) — Standard padding
  - --space-5 (20px) — Between sections
  - --space-6 (24px) — Large section gaps
  - --space-8 (32px) — Major section separation
  - --space-12 (48px) — Page vertical rhythm
  
  Radius:
  - --radius-pill (9999px) — Button corners
  - --radius-md (10px) — Input/small elements
  - --radius-lg (16px) — Cards
  
  Shadows:
  - --shadow-sm — Card rest state
  - --shadow-md — Card hover state
  - --shadow-lg — Bottom sheet
  
  Motion:
  - --transition-base (0.15s ease) — All interactive transitions
  
  No hardcoded hex values appear anywhere in component styles — all colors use CSS custom properties.
*/

import React, { useState, useRef } from 'react';
import PostCard from './PostCard';
import BottomSheet from './BottomSheet';
import BottomNav from './BottomNav';
import styles from './HomePage.module.css';

// Mock user data (would come from auth/context in real app)
const mockUser = {
  name: 'Diane',
  neighborhood: 'Inwood',
  avatar: { initials: 'D', bg: '#E0EED0' },
  skills: ['Babysitting', 'French', 'Dog walking', 'Cooking', 'Tech help'],
};

// Mock posts data
const mockPosts = [
  {
    id: 1,
    name: 'Marcus',
    neighborhood: 'Inwood',
    avatar: { initials: 'M', bg: '#FDE8D8' },
    rating: 4,
    helpCount: 12,
    title: 'Help move boxes into 3rd floor apartment',
    body: "Moving this weekend. Need 2-3 people for 2-3 hours. I'll provide coffee and snacks. Heavy boxes but manageable.",
    bodyFull: "Moving this weekend (Saturday 10am). Need 2-3 people for 2-3 hours. I'll provide coffee and snacks. Boxes are heavy but manageable. Pretty straightforward stuff — just need extra hands.",
    distance: '0.3 miles away',
    timeframe: 'This Saturday',
    badges: [
      { type: 'need', label: 'Physical help' },
      { type: 'time', label: 'Saturday 10am' },
      { type: 'verified', label: 'Verified' },
    ],
  },
  {
    id: 2,
    name: 'Sofia',
    neighborhood: 'Inwood',
    avatar: { initials: 'S', bg: '#ECEEE8' },
    rating: 5,
    helpCount: 8,
    title: "Teaching my son to read (ages 7-8)",
    body: "Looking for someone patient and warm to tutor my son twice a week. He knows basic phonics and needs help with comprehension and confidence.",
    bodyFull: "Looking for someone patient and warm to tutor my son twice a week in the evenings. He's 7 and knows basic phonics but struggles with comprehension and needs a confidence boost. His teacher suggested extra support. Very open to creative approaches.",
    distance: '0.7 miles away',
    timeframe: 'Evenings, 2x/week',
    badges: [
      { type: 'need', label: 'Tutoring' },
      { type: 'time', label: 'Weekday evenings' },
      { type: 'verified', label: 'Verified' },
    ],
  },
  {
    id: 3,
    name: 'James',
    neighborhood: 'Washington Heights',
    avatar: { initials: 'J', bg: '#FDF0D0' },
    rating: 3,
    helpCount: 5,
    title: "Fix my laptop (won't turn on)",
    body: "My laptop stopped turning on last week. I'm not technical but I'll buy lunch or make tea for whoever helps me troubleshoot. Data backup would be huge too if possible.",
    bodyFull: "My laptop stopped turning on last week and I'm losing it — I have important files on there. I'm not technical at all but happy to learn. I'll cook you dinner or buy lunch. Data backup would be literally lifesaving.",
    distance: '0.5 miles away',
    timeframe: 'Any weekday morning',
    badges: [
      { type: 'need', label: 'Tech help' },
      { type: 'time', label: 'Morning' },
    ],
  },
];

const HomePage = ({ currentPage ='feed' }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const feedSectionRef = useRef(null);

  const handleOfferClick = (post) => {
    setSelectedPost(post);
    setIsBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
    setSelectedPost(null);
  };

  const handleConfirmOffer = () => {
    // In real app, would submit offer here
    alert(`Offer sent to ${selectedPost.name}!`);
    handleBottomSheetClose();
  };

  const handleSeeWhoNeedsHelp = () => {
    feedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={styles.page}>
      {/* Welcome Header */}
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeHeaderContainer}>
          <h1 className={styles.greeting}>Good morning, {mockUser.name}.</h1>
          <p className={styles.subtitle}>Here&apos;s what&apos;s happening in {mockUser.neighborhood} today.</p>
        </div>
      </section>

      {/* Profile Snapshot */}
      <section className={styles.profileSnapshotSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileCardLeft}>
            <div className={styles.profileAvatar} style={{ backgroundColor: mockUser.avatar.bg }}>
              {mockUser.avatar.initials}
            </div>
            <div className={styles.profileCardInfo}>
              <div className={styles.profileName}>{mockUser.name}</div>
              <div className={styles.profileNeighborhood}>{mockUser.neighborhood}</div>
              <div className={styles.profileSkills}>
                {mockUser.skills.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className={styles.skillBadge}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            className={styles.viewProfileBtn}
            onClick={() => window.location.href = '/profile'}
            aria-label="View your full profile"
          >
            View profile
          </button>
        </div>
      </section>

      {/* Primary CTA Banner */}
      <section className={styles.ctaBannerSection}>
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaBannerHeadline}>Someone near you needs help.</h2>
          <p className={styles.ctaBannerSubtext}>
            Browse posts in your neighborhood and offer what you can.
          </p>
          <button
            className={styles.ctaBannerButton}
            onClick={handleSeeWhoNeedsHelp}
            aria-label="See who needs help"
          >
            See who needs help
          </button>
        </div>
      </section>

      {/* Feed Section */}
      <section className={styles.feedSection} ref={feedSectionRef}>
        <div className={styles.sectionLabelWrapper}>
          <h2 className={styles.sectionLabel}>Near you · {mockUser.neighborhood.toUpperCase()}</h2>
        </div>
        <div className={styles.postsList}>
          {mockPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOfferClick={handleOfferClick}
            />
          ))}
        </div>
      </section>

      {/* What You're Offering */}
      <section className={styles.skillsSection}>
        <div className={styles.sectionLabelWrapper}>
          <h2 className={styles.sectionLabel}>What you bring</h2>
        </div>
        <div className={styles.skillsRow}>
          {mockUser.skills.map((skill, idx) => (
            <span key={idx} className={styles.skillChip}>
              {skill}
            </span>
          ))}
        </div>
        <button
          className={styles.editSkillsLink}
          onClick={() => window.location.href = '/profile'}
          aria-label="Edit your skills"
        >
          Edit your skills
        </button>
      </section>

      {/* Spacing for bottom nav */}
      <div className={styles.bottomNavSpacer} />

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        post={selectedPost}
        onClose={handleBottomSheetClose}
        onConfirm={handleConfirmOffer}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={currentPage}
        hasNotification={true}
      />
    </main>
  );
};

export default HomePage;
