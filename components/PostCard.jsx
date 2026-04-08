import React from 'react';
import Link from 'next/link';
import styles from './PostCard.module.css';

const PostCard = ({ post, onOfferClick, onOpenPost }) => {
  const { avatar, name, neighborhood, rating, helpCount, badges, title, body, distance, personSlug } = post;

  return (
    <div className={styles.card} role="article">
      <Link href={`/people/${personSlug}`} className={styles.posterBar}>
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar} style={{ backgroundColor: avatar.bg }}>
              {avatar.initials}
            </div>
            <div className={styles.posterInfo}>
              <div className={styles.name}>{name}</div>
              <div className={styles.neighborhood}>{neighborhood}</div>
              <div className={styles.rating}>
                <span className={styles.stars}>{'★'.repeat(rating)}</span>
                <span className={styles.helpCountText}>{helpCount} helped</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <button type="button" className={styles.postContentButton} onClick={() => onOpenPost(post)}>
        <div className={styles.badges}>
          {badges.map((badge, idx) => (
            <span key={idx} className={`${styles.badge} ${styles[`badge-${badge.type}`]}`}>
              {badge.label}
            </span>
          ))}
        </div>

        <div className={styles.title}>{title}</div>

        <div className={styles.body}>{body}</div>
      </button>

      <div className={styles.footer}>
        <div className={styles.distance}>{distance}</div>
        <button
          className={styles.ctaButton}
          onClick={() => onOfferClick(post)}
          aria-label={`Offer to help with: ${title}`}
        >
          Offer to help
        </button>
      </div>
    </div>
  );
};

export default PostCard;
