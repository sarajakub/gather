'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { commitments, currentUser, people } from '@/data/mockCommunity';
import { clearLocalProfile, loadLocalProfile } from '@/lib/localProfile';
import { loadLocalRequests } from '@/lib/localRequests';
import styles from './ProfilePage.module.css';

const SKILL_OPTIONS = [
  'Cooking',
  'Tutoring math',
  'Writing support',
  'Tech help',
  'Phone setup',
  'Computer repair',
  'Grocery pickup',
  'Meal prep',
  'Elder check-ins',
  'Yard cleanup',
  'Moving help',
  'Furniture assembly',
  'Bike repair',
  'Translation',
  'Ride sharing',
  'Laundry help',
  'Errand running',
  'Resume support',
  'Interview prep',
  'Event setup',
];

const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'Mandarin',
  'Cantonese',
  'Arabic',
  'Hindi',
  'Bengali',
  'Portuguese',
  'Russian',
  'Korean',
  'Japanese',
  'Vietnamese',
  'Urdu',
  'Tagalog',
  'Italian',
  'German',
  'Turkish',
  'Polish',
  'American Sign Language',
  'Haitian Creole',
  'Hebrew',
];

const AVAILABILITY_OPTIONS = [
  'Early mornings',
  'Weekday mornings',
  'Weekday afternoons',
  'Weekday evenings',
  'Late nights',
  'Saturday mornings',
  'Saturday afternoons',
  'Saturday evenings',
  'Sunday mornings',
  'Sunday afternoons',
  'Sunday evenings',
  'Early afternoons',
  'Lunch break',
  'Overnight emergencies',
  'On-call weekends',
  'Flexible schedule',
  'Twice a month',
  'Once a week',
  'Daily short tasks',
  'Holiday availability',
];

const EDITABLE_FIELDS = {
  skills: {
    label: 'Skills you offer',
    options: SKILL_OPTIONS,
  },
  languages: {
    label: 'Languages',
    options: LANGUAGE_OPTIONS,
  },
  availability: {
    label: 'Your availability',
    options: AVAILABILITY_OPTIONS,
  },
};

const REWARD_LEVELS = [
  {
    id: 'starter',
    title: 'Starter Circle',
    requiredHelps: 0,
    rewards: ['Community shoutout badge'],
  },
  {
    id: 'neighbor-spark',
    title: 'Neighbor Spark',
    requiredHelps: 5,
    rewards: ['Free Dunkin coffee'],
  },
  {
    id: 'block-angel',
    title: 'Block Angel',
    requiredHelps: 12,
    rewards: ['MTA subway pass (1 day)'],
  },
  {
    id: 'community-anchor',
    title: 'Community Anchor',
    requiredHelps: 22,
    rewards: ['Free Dunkin coffee', 'MTA subway pass (7 day)'],
  },
  {
    id: 'gather-champion',
    title: 'Gather Champion',
    requiredHelps: 36,
    rewards: ['Priority partner rewards bundle'],
  },
];

const DEFAULT_PROFILE = {
  name: currentUser.name,
  neighborhood: currentUser.neighborhood,
  initials: currentUser.initials,
  avatar: { bg: currentUser.avatarBg, imageUrl: null },
  helped: currentUser.helped,
  rating: currentUser.rating,
  travelTime: '20 min',
  skills: currentUser.skills,
  languages: ['English', 'French', 'Spanish'],
  availability: ['Weekday evenings', 'Saturday mornings'],
  needs: [],
  tenure: null,
  extraContext: null,
  matchingOptIn: null,
  notificationsOptIn: null,
};

function dedupeValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function mapStoredProfileToViewModel(storedProfile) {
  const offerLabels = dedupeValues(
    (storedProfile.offers ?? []).flatMap((offer) =>
      (offer.tags ?? []).map((tag) => tag.label)
    )
  );
  const needLabels = dedupeValues((storedProfile.needs ?? []).map((need) => need.label));

  return {
    ...DEFAULT_PROFILE,
    neighborhood: storedProfile.location?.value || DEFAULT_PROFILE.neighborhood,
    avatar: {
      ...DEFAULT_PROFILE.avatar,
      imageUrl: storedProfile.profilePhoto?.previewUrl || null,
    },
    skills: offerLabels.length > 0 ? offerLabels : DEFAULT_PROFILE.skills,
    needs: needLabels,
    tenure: storedProfile.tenure,
    extraContext: storedProfile.extraContext,
    matchingOptIn: storedProfile.preferences?.matchingOptIn ?? null,
    notificationsOptIn: storedProfile.preferences?.notificationsOptIn ?? null,
  };
}

const ProfilePage = () => {
  const [profile, setProfile] = useState(() => {
    const storedProfile = loadLocalProfile();
    return storedProfile ? mapStoredProfileToViewModel(storedProfile) : DEFAULT_PROFILE;
  });

  const [openRewardLevelId, setOpenRewardLevelId] = useState(null);
  const [showPerkWallet, setShowPerkWallet] = useState(false);
  const [showRedeemPass, setShowRedeemPass] = useState(false);
  const [postedNeeds] = useState(() => loadLocalRequests());

  const byMostRecent = (items) =>
    [...items].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

  const myUpcomingCommitments = byMostRecent(
    commitments.filter((item) => item.status === 'upcoming')
  );
  const myCompletedCommitments = byMostRecent(
    commitments.filter((item) => item.status === 'completed')
  );

  const previouslyHelped = myCompletedCommitments.reduce((acc, item) => {
    if (!acc.find((entry) => entry.slug === item.personSlug)) {
      const person = people[item.personSlug];
      if (person) {
        acc.push({
          slug: person.slug,
          name: person.name,
          count: myCompletedCommitments.filter(
            (commitment) => commitment.personSlug === person.slug
          ).length,
        });
      }
    }
    return acc;
  }, []);

  const myPostedNeeds = postedNeeds.filter((item) => item.authorName === profile.name);

  const currentLevelIndex = REWARD_LEVELS.reduce(
    (bestIndex, level, index) =>
      profile.helped >= level.requiredHelps ? index : bestIndex,
    0
  );
  const currentLevel = REWARD_LEVELS[currentLevelIndex];
  const nextLevel = REWARD_LEVELS[currentLevelIndex + 1] || null;
  const currentThreshold = currentLevel.requiredHelps;
  const nextThreshold = nextLevel ? nextLevel.requiredHelps : currentThreshold;
  const helpsInCurrentStage = profile.helped - currentThreshold;
  const helpsNeededInStage = Math.max(nextThreshold - currentThreshold, 1);
  const stageProgress = nextLevel
    ? Math.min((helpsInCurrentStage / helpsNeededInStage) * 100, 100)
    : 100;
  const unlockedRewards = REWARD_LEVELS.filter((level) => profile.helped >= level.requiredHelps)
    .flatMap((level) => level.rewards)
    .filter(Boolean);
  const redeemPassCode = `GATHER-${String(profile.helped).padStart(2, '0')}-${currentLevelIndex + 1}`;
  const activeRewardLevel =
    REWARD_LEVELS.find((level) => level.id === openRewardLevelId) || nextLevel;

  const handleSignOut = () => {
    clearLocalProfile();
    setProfile(DEFAULT_PROFILE);
    window.location.href = '/';
  };

  const handleAddProfileValue = (field, value) => {
    if (!value) {
      return;
    }

    setProfile((prev) => {
      const existing = prev[field] || [];

      if (existing.includes(value)) {
        return prev;
      }

      return {
        ...prev,
        [field]: [...existing, value],
      };
    });
  };

  const handleRemoveProfileValue = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((entry) => entry !== value),
    }));
  };

  const renderEditableSection = (field, isTimeTag = false) => {
    const values = profile[field];
    const availableOptions = EDITABLE_FIELDS[field].options.filter(
      (option) => !values.includes(option)
    );

    return (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>{EDITABLE_FIELDS[field].label}</h3>
        </div>

        <div className={styles.dropdownRow}>
          <label className={styles.dropdownLabel} htmlFor={`${field}-dropdown`}>
            Add from list
          </label>
          <select
            id={`${field}-dropdown`}
            className={styles.dropdownSelect}
            defaultValue=""
            onChange={(event) => {
              const nextValue = event.target.value;
              handleAddProfileValue(field, nextValue);
              event.target.value = '';
            }}
          >
            <option value="" disabled>
              Choose an option
            </option>
            {availableOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {values.length > 0 ? (
          <div className={styles.tags}>
            {values.map((value) => (
              <button
                key={value}
                type="button"
                className={`${styles.tagButton} ${isTimeTag ? styles.tagButtonTime : ''}`}
                onClick={() => handleRemoveProfileValue(field, value)}
                aria-label={`Remove ${value}`}
              >
                <span>{value}</span>
                <span className={styles.tagRemove}>x</span>
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.noResults}>No selections yet.</p>
        )}
      </section>
    );
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1>Your Profile</h1>
        </header>

        <section className={styles.profileHero}>
          {profile.avatar.imageUrl ? (
            <Image
              src={profile.avatar.imageUrl}
              alt={`${profile.name} profile`}
              width={88}
              height={88}
              unoptimized
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarLarge} style={{ backgroundColor: profile.avatar.bg }}>
              {profile.initials}
            </div>
          )}
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

        <section className={styles.rewardSection}>
          <div className={styles.rewardHeader}>
            <div>
              <p className={styles.rewardEyebrow}>Community impact rewards</p>
              <h3 className={styles.rewardTitle}>{currentLevel.title}</h3>
            </div>
            <p className={styles.rewardStatus}>
              {nextLevel
                ? `${nextLevel.requiredHelps - profile.helped} more helps to ${nextLevel.title}`
                : 'Top level unlocked'}
            </p>
          </div>

          <div className={styles.rewardActions}>
            <button
              type="button"
              className={styles.perkCountBtn}
              onClick={() => {
                setShowPerkWallet((prev) => !prev);
                setShowRedeemPass(false);
                setOpenRewardLevelId(null);
              }}
            >
              {unlockedRewards.length} perks unlocked
            </button>
            <button
              type="button"
              className={styles.redeemBtn}
              onClick={() => {
                setShowRedeemPass((prev) => !prev);
                setShowPerkWallet(false);
                setOpenRewardLevelId(null);
              }}
            >
              Redeem perks
            </button>
          </div>

          <div className={styles.rewardBarTrack}>
            <div className={styles.rewardBarFill} style={{ width: `${stageProgress}%` }} />
          </div>

          <div className={styles.levelSignals}>
            {REWARD_LEVELS.map((level, index) => {
              const unlocked = profile.helped >= level.requiredHelps;
              const isCurrent = index === currentLevelIndex;
              const isNext = Boolean(nextLevel && nextLevel.id === level.id);

              return (
                <div key={level.id} className={styles.levelSignalWrap}>
                  <button
                    type="button"
                    className={`${styles.levelSignal} ${unlocked ? styles.levelSignalUnlocked : ''} ${
                      isCurrent ? styles.levelSignalCurrent : ''
                    } ${isNext ? styles.levelSignalNext : ''}`}
                    onMouseEnter={() => isNext && setOpenRewardLevelId(level.id)}
                    onMouseLeave={() => isNext && setOpenRewardLevelId(null)}
                    onFocus={() => isNext && setOpenRewardLevelId(level.id)}
                    onBlur={() => isNext && setOpenRewardLevelId(null)}
                    onClick={() =>
                      isNext && setOpenRewardLevelId((prev) => (prev === level.id ? null : level.id))
                    }
                    aria-label={`${level.title}, unlocks at ${level.requiredHelps} helps`}
                  >
                    <span className={styles.levelSignalLabel}>{level.requiredHelps}</span>
                  </button>
                  <p className={styles.levelTitle}>{level.title}</p>
                </div>
              );
            })}
          </div>

          {activeRewardLevel && activeRewardLevel.id === nextLevel?.id && (
            <div className={styles.rewardDetailPanel}>
              <p className={styles.rewardPopoverTitle}>Next unlock: {activeRewardLevel.title}</p>
              <div className={styles.rewardDetailChips}>
                {activeRewardLevel.rewards.map((reward) => (
                  <span key={reward} className={styles.rewardDetailChip}>
                    {reward}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showPerkWallet && (
            <div className={styles.perkWallet}>
              <div className={styles.perkWalletHeader}>
                <p className={styles.perkWalletTitle}>Unlocked perks</p>
                <span className={styles.perkWalletCount}>{unlockedRewards.length}</span>
              </div>
              <div className={styles.perkChips}>
                {unlockedRewards.map((reward) => (
                  <span key={reward} className={styles.perkChip}>
                    {reward}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showRedeemPass && (
            <div className={styles.redeemPassCard}>
              <div className={styles.redeemPassTop}>
                <div>
                  <p className={styles.perkWalletTitle}>Redeem in person</p>
                  <p className={styles.redeemPassCopy}>
                    Show this pass to a partner or neighbor in person to redeem a perk.
                  </p>
                </div>
                <div className={styles.redeemCode}>{redeemPassCode}</div>
              </div>
              <div className={styles.redeemPassBody}>
                <span className={styles.redeemTag}>Valid perks</span>
                <span className={styles.redeemTag}>{unlockedRewards.slice(0, 2).join(' · ')}</span>
              </div>
            </div>
          )}
        </section>

        {renderEditableSection('skills')}
        {renderEditableSection('languages')}
        {renderEditableSection('availability', true)}

        {profile.needs.length > 0 ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Current needs</h3>
            </div>
            <div className={styles.tags}>
              {profile.needs.map((value) => (
                <span key={value} className={styles.tag}>
                  {value}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Requests you posted</h3>
          </div>

          {myPostedNeeds.length > 0 ? (
            <div className={styles.postedNeedsList}>
              {myPostedNeeds.map((item) => (
                <article key={item.id} className={styles.postedNeedItem}>
                  <div>
                    <p className={styles.postedNeedTitle}>{item.title}</p>
                    <p className={styles.postedNeedMeta}>
                      {item.neighborhood} • {item.timing}
                    </p>
                  </div>
                  <span className={styles.postedNeedChip}>{item.category}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.emptyCommitments}>You haven&apos;t posted a request yet.</p>
          )}
        </section>

        {profile.tenure || profile.extraContext || profile.matchingOptIn || profile.notificationsOptIn ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Signup details</h3>
            </div>
            <div className={styles.detailList}>
              {profile.tenure ? (
                <p className={styles.detailRow}>
                  <strong>Neighborhood tenure:</strong> {profile.tenure}
                </p>
              ) : null}
              {profile.matchingOptIn ? (
                <p className={styles.detailRow}>
                  <strong>Matching:</strong> {profile.matchingOptIn}
                </p>
              ) : null}
              {profile.notificationsOptIn ? (
                <p className={styles.detailRow}>
                  <strong>Notifications:</strong> {profile.notificationsOptIn}
                </p>
              ) : null}
              {profile.extraContext ? (
                <p className={styles.detailRow}>
                  <strong>Extra context:</strong> {profile.extraContext}
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Your commitments</h3>
          </div>

          <div className={styles.subSection}>
            <h4 className={styles.subSectionTitle}>People you&apos;ve helped</h4>
            {previouslyHelped.length > 0 ? (
              <div className={styles.helpedList}>
                {previouslyHelped.map((person) => (
                  <article key={person.slug} className={styles.helpedItem}>
                    <p className={styles.helpedName}>{person.name}</p>
                    <p className={styles.helpedMeta}>
                      {person.count} {person.count === 1 ? 'commitment' : 'commitments'} completed
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.emptyCommitments}>You haven&apos;t helped anyone yet, but you will.</p>
            )}
          </div>

          <div className={styles.subSection}>
            <h4 className={styles.subSectionTitle}>Upcoming</h4>
          <div className={styles.commitmentList}>
            {myUpcomingCommitments.map((item) => {
              const person = people[item.personSlug];
              return (
                <article key={item.id} className={styles.commitmentItem}>
                  <div>
                    <p className={styles.commitmentTitle}>{item.title}</p>
                    <p className={styles.commitmentMeta}>{item.when}</p>
                  </div>
                  <span className={styles.commitmentPerson}>{person.name}</span>
                </article>
              );
            })}
          </div>

            <div className={styles.commitmentActions}>
              <Link href="/commitments?view=list&tab=upcoming" className={styles.moreBtn}>
                See more
              </Link>
              <Link href="/commitments?view=list&tab=past" className={styles.moreBtnSecondary}>
                View past
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <button type="button" className={styles.logoutBtn} onClick={handleSignOut}>
            Sign out
          </button>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
