import React, { useEffect } from 'react';
import styles from './BottomSheet.module.css';

const BottomSheet = ({ isOpen, post, onClose, onConfirm }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close"
      />
      <div className={styles.sheet}>
        <div className={styles.handle} />
        
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar} style={{ backgroundColor: post.avatar.bg }}>
                {post.avatar.initials}
              </div>
              <div className={styles.posterInfo}>
                <div className={styles.name}>{post.name}</div>
                <div className={styles.neighborhood}>{post.neighborhood}</div>
                <div className={styles.rating}>
                  <span className={styles.stars}>{'★'.repeat(post.rating)}</span>
                  <span className={styles.helpCountText}>{post.helpCount} helped</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.badges}>
            {post.badges.map((badge, idx) => (
              <span key={idx} className={`${styles.badge} ${styles[`badge-${badge.type}`]}`}>
                {badge.label}
              </span>
            ))}
          </div>

          <h2 className={styles.title}>{post.title}</h2>
          <p className={styles.body}>{post.bodyFull || post.body}</p>

          <div className={styles.details}>
            {post.distance && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Distance</span>
                <span className={styles.detailValue}>{post.distance}</span>
              </div>
            )}
            {post.timeframe && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Timeframe</span>
                <span className={styles.detailValue}>{post.timeframe}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.primaryCta}
              onClick={onConfirm}
              aria-label={`Confirm offer to help with: ${post.title}`}
            >
              Confirm offer to help
            </button>
            <button
              className={styles.secondaryCta}
              onClick={onClose}
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
