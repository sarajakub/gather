"use client";

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
import Link from 'next/link';
import PostCard from './PostCard';
import BottomSheet from './BottomSheet';
import { currentUser, posts } from '@/data/mockCommunity';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const feedSectionRef = useRef(null);

  const visiblePosts = showAllPosts ? posts : posts.slice(0, 3);

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setIsBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
    setSelectedPost(null);
  };

  const handleConfirmOffer = () => {
    if (!selectedPost) {
      return;
    }

    const params = new URLSearchParams({
      to: selectedPost.personSlug,
      postId: String(selectedPost.id),
      postTitle: selectedPost.title,
    });

    handleBottomSheetClose();
    window.location.href = `/messages?${params.toString()}`;
  };

  const handleSeeWhoNeedsHelp = () => {
    setShowAllPosts(true);
    feedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.contentGrid}>
          <section className={styles.mainColumn}>
            <section className={styles.welcomeSection}>
              <div className={styles.welcomeHeaderContainer}>
                <h1 className={styles.greeting}>Good morning, {currentUser.name}.</h1>
                <p className={styles.subtitle}>
                  Here&apos;s what&apos;s happening in {currentUser.neighborhood} today.
                </p>
              </div>
            </section>

            <section className={styles.feedSection} ref={feedSectionRef}>
              <div className={styles.sectionLabelWrapper}>
                <h2 className={styles.sectionLabel}>Near you · {currentUser.neighborhood.toUpperCase()}</h2>
                <p className={styles.sectionMeta}>
                  Showing {visiblePosts.length} of {posts.length} requests
                </p>
              </div>
              <div className={styles.postsList}>
                {visiblePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onOfferClick={handleOpenPost}
                    onOpenPost={handleOpenPost}
                  />
                ))}
              </div>
              {!showAllPosts && (
                <button
                  type="button"
                  className={styles.showAllBtn}
                  onClick={() => setShowAllPosts(true)}
                >
                  Show all posts
                </button>
              )}
            </section>
          </section>

          <aside className={styles.sideColumn}>
            <section className={styles.profileSnapshotSection}>
              <div className={styles.profileCard}>
                <div className={styles.profileCardLeft}>
                  <div className={styles.profileAvatar} style={{ backgroundColor: currentUser.avatarBg }}>
                    {currentUser.initials}
                  </div>
                  <div className={styles.profileCardInfo}>
                    <div className={styles.profileName}>{currentUser.name}</div>
                    <div className={styles.profileNeighborhood}>{currentUser.neighborhood}</div>
                    <div className={styles.profileSkills}>
                      {currentUser.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className={styles.skillBadge}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link className={styles.viewProfileBtn} href="/profile" aria-label="View your full profile">
                  View profile
                </Link>
              </div>
            </section>

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
          </aside>
        </div>
      </div>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        post={selectedPost}
        onClose={handleBottomSheetClose}
        onConfirm={handleConfirmOffer}
      />
    </main>
  );
};

export default HomePage;
