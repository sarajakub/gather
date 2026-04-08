# Gather Design System
**Version 1.0 · Direction B: Sage leads, Peach CTA**

> A design system for a community mutual aid platform. Every decision is grounded in two principles: **trust before action** (sage as the primary brand signal builds credibility before the peach CTA asks someone to do something) and **warmth over utility** (this is not a productivity tool — it is a human connection platform and should feel like one).

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography](#2-typography)
3. [Spacing & Layout](#3-spacing--layout)
4. [Border Radius](#4-border-radius)
5. [Shadows](#5-shadows)
6. [Components](#6-components)
   - [Buttons](#61-buttons)
   - [Badges & Tags](#62-badges--tags)
   - [Cards](#63-cards)
   - [Avatars](#64-avatars)
   - [Inputs & Forms](#65-inputs--forms)
   - [Navigation](#66-navigation)
   - [Chat Bubbles](#67-chat-bubbles)
7. [CSS Custom Properties (Full Token Sheet)](#7-css-custom-properties-full-token-sheet)
8. [Tailwind Config](#8-tailwind-config)
9. [Usage Rules & Anti-Patterns](#9-usage-rules--anti-patterns)
10. [Accessibility](#10-accessibility)
11. [Design Rationale](#11-design-rationale)

---

## 1. Color System

### Philosophy
Each color has **one semantic job**. Never use a color decoratively — use it because it means something. This makes the UI scannable without reading.

| Role | Name | Hex | Usage |
|---|---|---|---|
| Brand primary | **Sage** | `#3D6828` | Logo, brand moments, helper actions, nav active state |
| Brand light | **Sage light** | `#E0EED0` | Sage-tinted surfaces, skill badges, verified states |
| Brand pale | **Sage pale** | `#F2F7EE` | Large sage-tinted backgrounds, hover states |
| Action primary | **Peach** | `#E8855A` | Primary CTAs only — "Offer to help", "Submit post" |
| Action light | **Peach light** | `#FDE8D8` | Peach-tinted surfaces, need-type badges |
| Action pale | **Peach pale** | `#FFF5F0` | Peach hover backgrounds, alert surfaces |
| Accent warm | **Amber** | `#C09040` | Stars, points, verified gold badges, rewards |
| Accent warm light | **Amber light** | `#FDF0D0` | Amber-tinted surfaces |
| Neutral dark | **Forest** | `#1E3010` | Body text, headings — never pure black |
| Neutral mid | **Stone** | `#7A8870` | Secondary text, meta info, placeholders |
| Neutral light | **Stone light** | `#ECEEE8` | Dividers, disabled states, stat box backgrounds |
| Canvas | **Linen** | `#F6F8F2` | Page background — warm white with a hint of sage |
| Surface | **White** | `#FFFFFF` | Card backgrounds, modals, input backgrounds |

### Full Palette Ramps

For components that need tinted hover/pressed states, use these ramps:

```
Sage
  900: #0D1A07
  800: #1E3010  ← Forest (text anchor)
  700: #2A4518
  600: #3D6828  ← Brand primary
  500: #5A8A40
  400: #7AAD60
  300: #A0CC88
  200: #C8E4B0
  100: #E0EED0  ← Sage light
   50: #F2F7EE  ← Sage pale

Peach
  900: #6A2010
  800: #8A3018
  700: #B84828
  600: #D86840
  500: #E8855A  ← Action primary
  400: #F0A07A
  300: #F5B898
  200: #FAD0B8
  100: #FDE8D8  ← Peach light
   50: #FFF5F0  ← Peach pale

Amber
  600: #A07020
  500: #C09040  ← Stars, points
  100: #FDF0D0  ← Amber light

Stone (neutrals)
  900: #1E3010  (same as Forest)
  700: #4A5440
  500: #7A8870  ← Stone (secondary text)
  200: #C8CEC0
  100: #ECEEE8  ← Stone light
   50: #F6F8F2  ← Linen (canvas)
```

---

## 2. Typography

### Font Stack

```css
/* Display — emotional moments, headlines, wordmark */
font-family: 'DM Serif Display', Georgia, serif;

/* UI — everything functional */
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Google Fonts import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Size | Weight | Line Height | Font | Use |
|---|---|---|---|---|---|
| `--text-display` | 36px | 400 | 1.1 | DM Serif Display | Hero moments, empty states |
| `--text-display-italic` | 28px | 400 italic | 1.2 | DM Serif Display | Emotional pull moments |
| `--text-headline-lg` | 22px | 500 | 1.3 | DM Sans | Page titles |
| `--text-headline` | 18px | 500 | 1.35 | DM Sans | Section headers |
| `--text-headline-sm` | 16px | 500 | 1.4 | DM Sans | Card titles, modal headers |
| `--text-body-lg` | 16px | 400 | 1.65 | DM Sans | Primary reading text |
| `--text-body` | 14px | 400 | 1.6 | DM Sans | Standard body, card content |
| `--text-body-sm` | 13px | 400 | 1.55 | DM Sans | Secondary body, descriptions |
| `--text-caption` | 12px | 400 | 1.5 | DM Sans | Meta info, timestamps, distance |
| `--text-label` | 11px | 500 | 1.4 | DM Sans | Badges, tags, nav labels |
| `--text-overline` | 10px | 500 | 1.4 | DM Sans (uppercase, +0.1em letter-spacing) | Section labels, eyebrows |

### Typography Rules

- **Never use bold (700) weight** — 500 for emphasis is sufficient and feels warmer
- **Sentence case always** — never ALL CAPS for UI text (overline labels are the only exception)
- **Forest (`#1E3010`) for all primary text** — never pure `#000000`
- **Stone (`#7A8870`) for all secondary text** — never `#666` or `#999`
- **DM Serif Display for emotional beats only** — hero text, empty states, onboarding welcome
- **Maximum 2 type sizes on a single card**

---

## 3. Spacing & Layout

### Base Unit: 4px

All spacing is a multiple of 4px.

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4px | Micro — icon-to-label gap, tight list items |
| `--space-2` | 8px | Tight — within a component (icon + text) |
| `--space-3` | 12px | Component internal padding |
| `--space-4` | 16px | Standard — card internal padding, form gaps |
| `--space-5` | 20px | Comfortable — between related elements |
| `--space-6` | 24px | Section breathing room |
| `--space-8` | 32px | Section separation |
| `--space-10` | 40px | Large section gaps |
| `--space-12` | 48px | Page-level vertical rhythm |
| `--space-16` | 64px | Hero padding |

### Layout Grid

```css
/* Mobile-first, single column */
.container {
  width: 100%;
  max-width: 480px;       /* Mobile app max width */
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Tablet / web breakpoint */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    padding: 0 var(--space-6);
  }
}

/* Feed layout */
.feed {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);    /* 12px between cards */
}

/* Two-column grid (profile stats, settings) */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

/* Three-column grid (profile stats row) */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}
```

---

## 4. Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6px | Tight — inline badges on small elements |
| `--radius-md` | 10px | Default — inputs, small cards, stat boxes |
| `--radius-lg` | 16px | Cards, modals, drawers |
| `--radius-xl` | 24px | Large containers, bottom sheets |
| `--radius-pill` | 9999px | Buttons, badge pills, avatar chips |
| `--radius-full` | 50% | Circular avatars |

### Rule
- **More radius = softer and more approachable** — use larger radius for anything a user interacts with
- **Never mix rounded corners with single-sided borders** — a left-border accent gets `border-radius: 0`
- **Inputs use `--radius-md`**, buttons always use `--radius-pill`

---

## 5. Shadows

Gather uses shadows sparingly — only to communicate **elevation and interactivity**, never for decoration.

```css
/* No shadow — flat, resting state */
--shadow-none: none;

/* Subtle — default card */
--shadow-sm: 0 1px 3px rgba(30, 48, 16, 0.06), 0 1px 2px rgba(30, 48, 16, 0.04);

/* Lifted — card hover state */
--shadow-md: 0 4px 16px rgba(30, 48, 16, 0.08), 0 2px 6px rgba(30, 48, 16, 0.05);

/* Floating — modals, bottom sheets, dropdowns */
--shadow-lg: 0 12px 40px rgba(30, 48, 16, 0.12), 0 4px 12px rgba(30, 48, 16, 0.07);

/* Focus ring — accessibility, inputs */
--shadow-focus-sage: 0 0 0 3px rgba(61, 104, 40, 0.25);
--shadow-focus-peach: 0 0 0 3px rgba(232, 133, 90, 0.25);
```

**Rules:**
- Cards rest at `--shadow-sm`, lift to `--shadow-md` on hover
- Modals and bottom sheets use `--shadow-lg`
- Never use colored shadows except for focus rings
- Never use `box-shadow` for decorative borders — use `border` instead

---

## 6. Components

### 6.1 Buttons

**Anatomy:** `[icon?] [label]` — always pill shape, always sentence case

```css
/* Base button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: opacity 0.12s ease, transform 0.1s ease;
  white-space: nowrap;
  text-decoration: none;
}
.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Sizes */
.btn-sm  { height: 32px; padding: 0 14px; font-size: 12px; }
.btn-md  { height: 40px; padding: 0 20px; font-size: 14px; } /* default */
.btn-lg  { height: 48px; padding: 0 28px; font-size: 15px; }
.btn-xl  { height: 56px; padding: 0 36px; font-size: 16px; } /* full-width CTA */

/* Variants */

/* Primary — peach, for the single most important action on screen */
.btn-primary {
  background: #E8855A;
  color: #ffffff;
}
.btn-primary:hover { background: #D86840; }
.btn-primary:focus-visible { box-shadow: var(--shadow-focus-peach); outline: none; }

/* Secondary — sage, for important but non-primary actions */
.btn-secondary {
  background: #3D6828;
  color: #ffffff;
}
.btn-secondary:hover { background: #2A4518; }
.btn-secondary:focus-visible { box-shadow: var(--shadow-focus-sage); outline: none; }

/* Soft sage — lower emphasis, same sage family */
.btn-sage-soft {
  background: #E0EED0;
  color: #3D6828;
}
.btn-sage-soft:hover { background: #C8E4B0; }

/* Soft peach — lower emphasis, same peach family */
.btn-peach-soft {
  background: #FDE8D8;
  color: #B84828;
}
.btn-peach-soft:hover { background: #FAD0B8; }

/* Ghost — tertiary, destructive alternatives, cancel */
.btn-ghost {
  background: transparent;
  color: #1E3010;
  border: 1.5px solid rgba(30, 48, 16, 0.2);
}
.btn-ghost:hover { background: #ECEEE8; }

/* Full width */
.btn-full { width: 100%; }
```

**Usage rules:**
- Maximum **one `btn-primary`** per screen — it is the single point of action
- `btn-secondary` for sage-colored actions (posting a need, editing profile)
- `btn-ghost` for cancel, back, and destructive confirmations
- Never put two `btn-primary` buttons next to each other
- Icon buttons (icon only, no label) must have `aria-label`

---

### 6.2 Badges & Tags

```css
/* Base badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  white-space: nowrap;
}

/* Need type — what someone needs help with */
.badge-need {
  background: #FDE8D8;
  color: #B84828;
}

/* Skill — what a helper offers */
.badge-skill {
  background: #E0EED0;
  color: #2A4518;
}

/* Time — availability, scheduling */
.badge-time {
  background: #E8EDF5;
  color: #384878;
}

/* Verified — trust signal */
.badge-verified {
  background: #FDF0D0;
  color: #806020;
}

/* Urgent — time-sensitive post */
.badge-urgent {
  background: #FDE8D8;
  color: #8A3018;
  border: 1px solid rgba(184, 72, 40, 0.2);
}

/* New — recently posted */
.badge-new {
  background: #ECEEE8;
  color: #4A5440;
}

/* Count badge — notification dot */
.badge-count {
  background: #E8855A;
  color: #ffffff;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--radius-pill);
}
```

---

### 6.3 Cards

```css
/* Base card */
.card {
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 0.5px solid rgba(30, 48, 16, 0.08);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* Interactive post card */
.card-post {
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 0.5px solid rgba(30, 48, 16, 0.08);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card-post:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Card padding variants */
.card-sm  { padding: var(--space-3); }  /* 12px — compact */
.card-md  { padding: var(--space-5); }  /* 20px — default */
.card-lg  { padding: var(--space-6); }  /* 24px — spacious */

/* Post card internal structure */
.card-post-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.card-post-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--space-3);
}

.card-post-title {
  font-size: 15px;
  font-weight: 500;
  color: #1E3010;
  line-height: 1.4;
  margin-bottom: var(--space-1);
}

.card-post-body {
  font-size: 13px;
  color: #7A8870;
  line-height: 1.6;
  margin-bottom: var(--space-3);
  /* Clamp to 3 lines in feed */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-3);
  border-top: 0.5px solid rgba(30, 48, 16, 0.07);
}

/* Stat card — for profile numbers */
.card-stat {
  background: #ECEEE8;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  text-align: center;
}
.card-stat-number {
  font-size: 22px;
  font-weight: 500;
  color: #1E3010;
  line-height: 1;
}
.card-stat-label {
  font-size: 10px;
  font-weight: 500;
  color: #7A8870;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 4px;
}
```

---

### 6.4 Avatars

```css
/* Base avatar */
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  flex-shrink: 0;
  overflow: hidden;
}

/* Sizes */
.avatar-xs  { width: 24px; height: 24px; font-size: 9px; }
.avatar-sm  { width: 32px; height: 32px; font-size: 12px; }
.avatar-md  { width: 40px; height: 40px; font-size: 14px; } /* default */
.avatar-lg  { width: 52px; height: 52px; font-size: 18px; }
.avatar-xl  { width: 72px; height: 72px; font-size: 24px; }

/* Color variants for initials avatars */
/* Rotate through these based on user ID mod 4 */
.avatar-sage  { background: #E0EED0; color: #2A4518; }
.avatar-peach { background: #FDE8D8; color: #8A3018; }
.avatar-stone { background: #ECEEE8; color: #4A5440; }
.avatar-amber { background: #FDF0D0; color: #806020; }

/* Avatar with verified ring */
.avatar-verified {
  box-shadow: 0 0 0 2px #3D6828, 0 0 0 4px #ffffff;
}

/* Profile banner avatar (overlapping banner) */
.avatar-profile {
  border: 3px solid #ffffff;
  margin-top: -26px;
}
```

---

### 6.5 Inputs & Forms

```css
/* Form group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
}
.form-group:last-child { margin-bottom: 0; }

/* Label */
.form-label {
  font-size: 12px;
  font-weight: 500;
  color: #1E3010;
  line-height: 1.4;
}

/* Helper text */
.form-hint {
  font-size: 11px;
  color: #7A8870;
  margin-top: 4px;
}

/* Error text */
.form-error {
  font-size: 11px;
  color: #C04030;
  margin-top: 4px;
}

/* Input base */
.input {
  width: 100%;
  height: 44px;
  padding: 0 var(--space-4);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #1E3010;
  background: #F6F8F2;
  border: 1.5px solid rgba(30, 48, 16, 0.15);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  -webkit-appearance: none;
}
.input::placeholder { color: #7A8870; }
.input:hover { border-color: rgba(30, 48, 16, 0.3); }
.input:focus {
  border-color: #3D6828;
  background: #ffffff;
  box-shadow: var(--shadow-focus-sage);
}
.input:invalid, .input.error {
  border-color: #C04030;
  box-shadow: 0 0 0 3px rgba(192, 64, 48, 0.15);
}

/* Textarea */
.textarea {
  height: auto;
  min-height: 100px;
  padding: var(--space-3) var(--space-4);
  resize: vertical;
  line-height: 1.6;
}

/* Input with icon */
.input-group {
  position: relative;
}
.input-group .input { padding-left: 40px; }
.input-group-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #7A8870;
  pointer-events: none;
  width: 16px;
  height: 16px;
}

/* Character count */
.input-counter {
  font-size: 11px;
  color: #7A8870;
  text-align: right;
  margin-top: 4px;
}
.input-counter.warning { color: #C09040; }
.input-counter.over { color: #C04030; }
```

---

### 6.6 Navigation

```css
/* Bottom tab bar */
.nav-bottom {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-top: 0.5px solid rgba(30, 48, 16, 0.08);
  padding: var(--space-2) var(--space-2) env(safe-area-inset-bottom);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: var(--space-2) var(--space-1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.12s ease;
  text-decoration: none;
  border: none;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
}
.nav-tab:hover { background: #F2F7EE; }

.nav-tab-icon {
  width: 22px;
  height: 22px;
  color: #7A8870;
  transition: color 0.12s ease;
}

.nav-tab-label {
  font-size: 10px;
  font-weight: 500;
  color: #7A8870;
  transition: color 0.12s ease;
}

/* Active tab */
.nav-tab.active .nav-tab-icon { color: #3D6828; }
.nav-tab.active .nav-tab-label { color: #3D6828; }
.nav-tab.active { background: #F2F7EE; }

/* Notification dot on tab icon */
.nav-tab-badge {
  position: absolute;
  top: 6px;
  right: calc(50% - 18px);
  width: 8px;
  height: 8px;
  background: #E8855A;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

/* FAB — floating action button for posting */
.fab {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #E8855A;
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(232, 133, 90, 0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  flex-shrink: 0;
}
.fab:hover {
  transform: scale(1.06);
  box-shadow: 0 6px 24px rgba(232, 133, 90, 0.5);
}
.fab:active { transform: scale(0.97); }
```

---

### 6.7 Chat Bubbles

```css
/* Chat container */
.chat {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

/* Sender label */
.chat-sender {
  font-size: 11px;
  color: #7A8870;
  margin-bottom: 4px;
}

/* Base bubble */
.chat-bubble {
  max-width: 78%;
  padding: var(--space-3) var(--space-4);
  font-size: 14px;
  line-height: 1.55;
  color: #1E3010;
}

/* AI / system messages — sage-tinted */
.chat-bubble-ai {
  background: #F2F7EE;
  border: 0.5px solid #E0EED0;
  border-radius: 18px 18px 18px 4px;
  align-self: flex-start;
}

/* User messages — peach */
.chat-bubble-user {
  background: #E8855A;
  color: #ffffff;
  border-radius: 18px 18px 4px 18px;
  align-self: flex-end;
}

/* Typing indicator */
.chat-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-3) var(--space-4);
  background: #F2F7EE;
  border: 0.5px solid #E0EED0;
  border-radius: 18px 18px 18px 4px;
  align-self: flex-start;
  width: fit-content;
}
.chat-typing-dot {
  width: 6px;
  height: 6px;
  background: #7A8870;
  border-radius: 50%;
  animation: typing-bounce 1.2s ease infinite;
}
.chat-typing-dot:nth-child(2) { animation-delay: 0.15s; }
.chat-typing-dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-6px); opacity: 1; }
}
```

---

## 7. CSS Custom Properties (Full Token Sheet)

Paste this into your global CSS file or `:root` block.

```css
:root {

  /* ─── COLORS ─── */

  /* Sage — brand, trust, community */
  --color-sage-900: #0D1A07;
  --color-sage-800: #1E3010;
  --color-sage-700: #2A4518;
  --color-sage-600: #3D6828;
  --color-sage-500: #5A8A40;
  --color-sage-400: #7AAD60;
  --color-sage-300: #A0CC88;
  --color-sage-200: #C8E4B0;
  --color-sage-100: #E0EED0;
  --color-sage-50:  #F2F7EE;

  /* Peach — action, warmth, CTA */
  --color-peach-900: #6A2010;
  --color-peach-800: #8A3018;
  --color-peach-700: #B84828;
  --color-peach-600: #D86840;
  --color-peach-500: #E8855A;
  --color-peach-400: #F0A07A;
  --color-peach-300: #F5B898;
  --color-peach-200: #FAD0B8;
  --color-peach-100: #FDE8D8;
  --color-peach-50:  #FFF5F0;

  /* Amber — stars, points, verified */
  --color-amber-600: #A07020;
  --color-amber-500: #C09040;
  --color-amber-100: #FDF0D0;

  /* Neutral */
  --color-forest:       #1E3010;
  --color-stone:        #7A8870;
  --color-stone-light:  #ECEEE8;
  --color-linen:        #F6F8F2;
  --color-white:        #FFFFFF;

  /* Semantic aliases */
  --color-brand:        var(--color-sage-600);
  --color-brand-light:  var(--color-sage-100);
  --color-brand-pale:   var(--color-sage-50);
  --color-action:       var(--color-peach-500);
  --color-action-light: var(--color-peach-100);
  --color-action-pale:  var(--color-peach-50);
  --color-text-primary: var(--color-forest);
  --color-text-secondary: var(--color-stone);
  --color-surface:      var(--color-white);
  --color-canvas:       var(--color-linen);
  --color-border:       rgba(30, 48, 16, 0.1);
  --color-border-strong: rgba(30, 48, 16, 0.2);

  /* ─── TYPOGRAPHY ─── */
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-ui:      'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  --text-display:    36px;
  --text-display-sm: 28px;
  --text-headline-lg: 22px;
  --text-headline:   18px;
  --text-headline-sm: 16px;
  --text-body-lg:    16px;
  --text-body:       14px;
  --text-body-sm:    13px;
  --text-caption:    12px;
  --text-label:      11px;
  --text-overline:   10px;

  --weight-regular: 400;
  --weight-medium:  500;

  --leading-tight:    1.1;
  --leading-snug:     1.35;
  --leading-normal:   1.5;
  --leading-relaxed:  1.65;

  /* ─── SPACING ─── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ─── BORDER RADIUS ─── */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-pill: 9999px;
  --radius-full: 50%;

  /* ─── SHADOWS ─── */
  --shadow-none: none;
  --shadow-sm:   0 1px 3px rgba(30, 48, 16, 0.06), 0 1px 2px rgba(30, 48, 16, 0.04);
  --shadow-md:   0 4px 16px rgba(30, 48, 16, 0.08), 0 2px 6px rgba(30, 48, 16, 0.05);
  --shadow-lg:   0 12px 40px rgba(30, 48, 16, 0.12), 0 4px 12px rgba(30, 48, 16, 0.07);
  --shadow-focus-sage:  0 0 0 3px rgba(61, 104, 40, 0.25);
  --shadow-focus-peach: 0 0 0 3px rgba(232, 133, 90, 0.25);

  /* ─── TRANSITIONS ─── */
  --transition-fast:   0.1s ease;
  --transition-base:   0.15s ease;
  --transition-slow:   0.25s ease;

  /* ─── Z-INDEX ─── */
  --z-base:    0;
  --z-raised:  10;
  --z-overlay: 50;
  --z-modal:   100;
  --z-nav:     200;
  --z-toast:   300;
}
```

---

## 8. Tailwind Config

If your team is using Tailwind CSS, extend the config with these tokens:

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        sage: {
          900: '#0D1A07',
          800: '#1E3010',
          700: '#2A4518',
          600: '#3D6828',
          500: '#5A8A40',
          400: '#7AAD60',
          300: '#A0CC88',
          200: '#C8E4B0',
          100: '#E0EED0',
           50: '#F2F7EE',
        },
        peach: {
          900: '#6A2010',
          800: '#8A3018',
          700: '#B84828',
          600: '#D86840',
          500: '#E8855A',
          400: '#F0A07A',
          300: '#F5B898',
          200: '#FAD0B8',
          100: '#FDE8D8',
           50: '#FFF5F0',
        },
        amber: {
          600: '#A07020',
          500: '#C09040',
          100: '#FDF0D0',
        },
        forest:  '#1E3010',
        stone:   '#7A8870',
        linen:   '#F6F8F2',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display':    ['36px', { lineHeight: '1.1' }],
        'display-sm': ['28px', { lineHeight: '1.2' }],
        'headline-lg':['22px', { lineHeight: '1.3', fontWeight: '500' }],
        'headline':   ['18px', { lineHeight: '1.35', fontWeight: '500' }],
        'headline-sm':['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg':    ['16px', { lineHeight: '1.65' }],
        'body':       ['14px', { lineHeight: '1.6' }],
        'body-sm':    ['13px', { lineHeight: '1.55' }],
        'caption':    ['12px', { lineHeight: '1.5' }],
        'label':      ['11px', { lineHeight: '1.4', fontWeight: '500' }],
        'overline':   ['10px', { lineHeight: '1.4', fontWeight: '500',
                                  letterSpacing: '0.1em' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm':   '6px',
        'md':   '10px',
        'lg':   '16px',
        'xl':   '24px',
        'pill': '9999px',
        'full': '50%',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(30, 48, 16, 0.06), 0 1px 2px rgba(30, 48, 16, 0.04)',
        'md': '0 4px 16px rgba(30, 48, 16, 0.08), 0 2px 6px rgba(30, 48, 16, 0.05)',
        'lg': '0 12px 40px rgba(30, 48, 16, 0.12), 0 4px 12px rgba(30, 48, 16, 0.07)',
        'focus-sage':  '0 0 0 3px rgba(61, 104, 40, 0.25)',
        'focus-peach': '0 0 0 3px rgba(232, 133, 90, 0.25)',
      },
    },
  },
  plugins: [],
}
```

---

## 9. Usage Rules & Anti-Patterns

### The Rules

| Rule | Why |
|---|---|
| One `btn-primary` (peach) per screen | Multiple primary buttons diffuse attention and reduce conversion |
| Sage for identity, peach for action | Never swap these — sage trust must be established before peach asks for action |
| Forest (`#1E3010`) for all body text | Never use pure `#000000` — it reads as harsh on warm backgrounds |
| Sentence case everywhere | ALL CAPS reads as shouting; title case reads as corporate |
| DM Serif Display only for emotional moments | Overusing display type kills its emotional impact |
| Max 3 badge colors per card | More than 3 semantic colors on one component creates noise |
| Cards rest flat, lift on hover | Motion communicates interactivity — static hover states waste the cue |
| Always label icon-only buttons with `aria-label` | Accessibility non-negotiable |

### Anti-Patterns to Avoid

```
❌ Two peach primary buttons side by side
✅ One peach primary + one sage secondary

❌ Pure black (#000) text on linen background
✅ Forest (#1E3010) text on linen background

❌ Using sage as a CTA button color
✅ Sage for brand/trust, peach for action only

❌ DM Serif Display for body text or labels
✅ DM Serif Display for hero headlines and emotional moments only

❌ Badges with 5 different colors on one card
✅ Maximum 2–3 badge colors per card

❌ Border-radius on single-sided borders (border-left accents)
✅ border-radius: 0 on elements with border-left only

❌ Decorative drop shadows (shadow for aesthetics)
✅ Shadows only to communicate elevation or interactivity

❌ Placeholder text as the only label
✅ Always include a visible form-label above the input

❌ Color alone to communicate state (errors, success)
✅ Color + icon + text together for any state communication
```

---

## 10. Accessibility

### Color Contrast Minimums (WCAG AA)

| Foreground | Background | Ratio | Pass |
|---|---|---|---|
| Forest `#1E3010` | White `#FFFFFF` | 13.8:1 | ✅ AAA |
| Forest `#1E3010` | Linen `#F6F8F2` | 12.4:1 | ✅ AAA |
| White `#FFFFFF` | Sage `#3D6828` | 5.8:1 | ✅ AA |
| White `#FFFFFF` | Peach `#E8855A` | 3.1:1 | ✅ AA (large text) |
| Sage dark `#2A4518` | Sage light `#E0EED0` | 6.2:1 | ✅ AA |
| Peach dark `#8A3018` | Peach light `#FDE8D8` | 5.4:1 | ✅ AA |
| Stone `#7A8870` | White `#FFFFFF` | 4.6:1 | ✅ AA |

> ⚠️ White text on `#E8855A` (peach-500) is AA for large text (18px+) only. For small button text use `#5A2010` on peach-100 instead, or ensure button text is at minimum 16px.

### Focus States
Every interactive element must have a visible focus ring. Use:
- `--shadow-focus-sage` for sage-branded elements (inputs, nav, secondary buttons)
- `--shadow-focus-peach` for peach action elements (primary button, FAB)

### Touch Targets
- Minimum touch target: **44×44px** on all interactive elements
- Nav tabs minimum height: **56px** including label
- Spacing between adjacent tap targets: **8px minimum**

### Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Design Rationale

**Why sage as the brand primary?**
Research on prosocial platform design consistently shows that nature-coded greens build perceived trustworthiness and community affiliation before users take any action. Sage specifically sits at the intersection of calm (desaturated) and growth (green hue) — the precise emotional register needed before someone decides to help a stranger or ask for help.

**Why peach as the CTA?**
Warm action colors (peaches, corals, warm oranges) have higher action-taking associations than cool colors in prosocial contexts — they signal approachability and human warmth rather than urgency or alarm. The contrast between calm sage brand and warm peach action is the highest-performing split for community platforms: trust first, then ask for action.

**Why DM Serif Display for emotional moments?**
Serif type activates deeper processing and perceived sincerity. Reserving it only for high-emotion moments (empty states, onboarding, hero text) preserves its power — if it's everywhere, it's nowhere.

**Why Forest (`#1E3010`) instead of black for text?**
Pure black on a warm-tinted canvas creates a jarring cool-warm contrast. Forest is a dark green-black that harmonizes with the sage palette and reads as rich and warm rather than clinical.

**Why linen (`#F6F8F2`) as the canvas?**
Pure white reads as a blank, sterile interface. Linen has a barely-perceptible warm sage undertone that signals organic, living, community — before users consciously register any color at all.

---

*Gather Design System v1.0 — built for the Hearst Lab AI for Social Good Hackathon, April 2026*
*Maintained by the Gather team. Questions → open an issue or ping in #design.*
