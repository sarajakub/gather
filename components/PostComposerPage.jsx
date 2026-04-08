'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { REQUEST_CATEGORIES } from '@/data/helpRequests';
import { currentUser } from '@/data/mockCommunity';
import { addLocalRequest } from '@/lib/localRequests';
import styles from './PostComposerPage.module.css';

const CATEGORY_OPTIONS = [...REQUEST_CATEGORIES];
const URGENCY_OPTIONS = ['Open', 'New', 'Urgent'];

function formatTimingLabel(dateValue, timeValue) {
  if (!dateValue) {
    return 'This week';
  }

  const parsed = new Date(`${dateValue}T${timeValue || '12:00'}`);

  if (Number.isNaN(parsed.getTime())) {
    return 'This week';
  }

  const dayLabel = parsed.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  if (!timeValue) {
    return dayLabel;
  }

  const timeLabel = parsed.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${dayLabel} at ${timeLabel}`;
}

export default function PostComposerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    category: CATEGORY_OPTIONS[0],
    neighborhood: currentUser.neighborhood,
    date: '',
    time: '',
    duration: '',
    urgency: 'Open',
    description: '',
    contactPreference: 'In-app messages',
  });

  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.title.trim().length > 4 &&
    form.description.trim().length > 20 &&
    form.date &&
    form.duration.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }

    addLocalRequest({
      title: form.title.trim(),
      category: form.category,
      neighborhood: form.neighborhood.trim(),
      urgency: form.urgency,
      description: form.description.trim(),
      timing: formatTimingLabel(form.date, form.time),
      helperNote: `Posted by ${currentUser.name}.`,
      authorName: currentUser.name,
    });

    setSubmitted(true);
    window.setTimeout(() => {
      router.push('/home');
    }, 700);
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1 className={styles.title}>Share a need</h1>
          <p className={styles.subtitle}>Share what you need, when you need it, and your neighborhood.</p>
        </header>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Post title</span>
              <input
                className={styles.input}
                type="text"
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="What do you need help with?"
              />
            </label>

            <label className={styles.field}>
              <span>Category</span>
              <select
                className={styles.input}
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Neighborhood</span>
              <input
                className={styles.input}
                type="text"
                value={form.neighborhood}
                onChange={(event) => updateField('neighborhood', event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Date needed</span>
              <input
                className={styles.input}
                type="date"
                value={form.date}
                onChange={(event) => updateField('date', event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Time needed</span>
              <input
                className={styles.input}
                type="time"
                value={form.time}
                onChange={(event) => updateField('time', event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Estimated duration</span>
              <input
                className={styles.input}
                type="text"
                value={form.duration}
                onChange={(event) => updateField('duration', event.target.value)}
                placeholder="Example: 2 hours"
              />
            </label>

            <label className={styles.field}>
              <span>Urgency</span>
              <select
                className={styles.input}
                value={form.urgency}
                onChange={(event) => updateField('urgency', event.target.value)}
              >
                {URGENCY_OPTIONS.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgency}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Preferred contact</span>
              <select
                className={styles.input}
                value={form.contactPreference}
                onChange={(event) => updateField('contactPreference', event.target.value)}
              >
                <option>In-app messages</option>
                <option>Phone call</option>
                <option>Text first</option>
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span>Describe the request</span>
            <textarea
              className={styles.textarea}
              rows={6}
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Share enough detail so neighbors know exactly how to help."
            />
          </label>

          <div className={styles.actions}>
            <Link href="/home" className={styles.cancelBtn}>
              Maybe later
            </Link>
            <button type="submit" className={styles.submitBtn} disabled={!isValid}>
              Share a need
            </button>
          </div>

          {submitted && (
            <div className={styles.successBanner}>
              Your request is live. You&apos;ll see it in Home and on your profile.
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
