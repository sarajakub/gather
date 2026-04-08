'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './PostComposerPage.module.css';

const CATEGORY_OPTIONS = [
  'Childcare',
  'Elder support',
  'Food + groceries',
  'Moving + lifting',
  'Tutoring',
  'Tech help',
  'Transportation',
  'Pet care',
  'Home tasks',
];

const URGENCY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'];

export default function PostComposerPage() {
  const [form, setForm] = useState({
    title: '',
    category: CATEGORY_OPTIONS[0],
    neighborhood: 'Inwood',
    date: '',
    time: '',
    duration: '',
    urgency: 'Medium',
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
    form.time &&
    form.duration.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1 className={styles.title}>Create a post</h1>
          <p className={styles.subtitle}>Share what you need, when you need it, and where.</p>
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
              Cancel
            </Link>
            <button type="submit" className={styles.submitBtn} disabled={!isValid}>
              Publish post
            </button>
          </div>

          {submitted && (
            <div className={styles.successBanner}>
              Post published. Neighbors can now respond in your messages.
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
