'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { commitments, people } from '@/data/mockCommunity';
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
    id: 'block-ally',
    title: 'Block Ally',
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

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'Diane',
    neighborhood: 'Inwood',
    initials: 'D',
    avatar: { bg: 'var(--color-sage-100)' },
    helped: 8,
    rating: 4.9,
    travelTime: '20 min',
    skills: ['Translation', 'French', 'Cooking', 'Tech help', 'Errand running'],
    languages: ['English', 'French', 'Spanish'],
    availability: ['Weekday evenings', 'Saturday mornings'],
  });

  const [activeEditor, setActiveEditor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [draftValues, setDraftValues] = useState([]);
  const [openRewardLevelId, setOpenRewardLevelId] = useState(null);

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

  const openEditor = (field) => {
    setActiveEditor(field);
    setSearchQuery('');
    setDraftValues(profile[field]);
  };

  const cancelEditor = () => {
    setActiveEditor(null);
    setSearchQuery('');
    setDraftValues([]);
  };

  const saveEditor = () => {
    if (!activeEditor) {
      return;
    }

    setProfile((prev) => ({
      ...prev,
      [activeEditor]: draftValues,
    }));
    cancelEditor();
  };

  const toggleDraftValue = (value) => {
    setDraftValues((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const getFilteredOptions = (field) => {
    const options = EDITABLE_FIELDS[field].options;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery)
    );
  };

  const renderEditableSection = (field, isTimeTag = false) => {
    const isOpen = activeEditor === field;
    const values = profile[field];
    const filteredOptions = getFilteredOptions(field);

    return (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>{EDITABLE_FIELDS[field].label}</h3>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => (isOpen ? cancelEditor() : openEditor(field))}
          >
            {isOpen ? 'Close' : 'Edit'}
          </button>
        </div>

        <div className={styles.tags}>
          {values.map((value) => (
            <span
              key={value}
              className={`${styles.tag} ${isTimeTag ? styles.tagTime : ''}`}
            >
              {value}
            </span>
          ))}
        </div>

        {isOpen && (
          <div className={styles.editorPanel}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={`Search ${EDITABLE_FIELDS[field].label.toLowerCase()}`}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />

            <div className={styles.optionList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const selected = draftValues.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.optionItem} ${selected ? styles.optionItemSelected : ''}`}
                      onClick={() => toggleDraftValue(option)}
                    >
                      <span>{option}</span>
                      <span className={styles.optionState}>{selected ? 'Selected' : 'Add'}</span>
                    </button>
                  );
                })
              ) : (
                <p className={styles.noResults}>No matching options</p>
              )}
            </div>

            <div className={styles.editorActions}>
              <button type="button" className={styles.cancelBtn} onClick={cancelEditor}>
                Cancel
              </button>
              <button type="button" className={styles.saveBtn} onClick={saveEditor}>
                Save changes
              </button>
            </div>
          </div>
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

          <div className={styles.rewardBarTrack}>
            <div className={styles.rewardBarFill} style={{ width: `${stageProgress}%` }} />
          </div>

          <div className={styles.levelSignals}>
            {REWARD_LEVELS.map((level, index) => {
              const unlocked = profile.helped >= level.requiredHelps;
              const isCurrent = index === currentLevelIndex;
              const isNext = Boolean(nextLevel && nextLevel.id === level.id);
              const showPopover = openRewardLevelId === level.id;

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

                  {showPopover && isNext && (
                    <div className={styles.rewardPopover} role="status">
                      <p className={styles.rewardPopoverTitle}>Next unlock perks</p>
                      {level.rewards.map((reward) => (
                        <p key={reward} className={styles.rewardPopoverItem}>
                          {reward}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {renderEditableSection('skills')}
        {renderEditableSection('languages')}
        {renderEditableSection('availability', true)}

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
              <p className={styles.emptyCommitments}>No completed commitments yet.</p>
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
          <button className={styles.logoutBtn}>Sign out</button>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
