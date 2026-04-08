# Gather

Gather is a neighborhood mutual-aid web platform for posting needs, offering help, messaging, and tracking commitments.

The app is built with Next.js (App Router), React, and a shared token-based design system.

## Product Overview

Gather supports a full neighbor-support loop:

- Discover nearby requests in a filterable feed
- Share a need from the posting flow
- Message neighbors to coordinate support
- Track commitments and mark help sessions done
- View profile impact rewards and posted requests

## Current Routes

- `/` - Marketing/landing page
- `/home` - Main requests feed
- `/post` - Share a need
- `/messages` - Conversations and offer/reschedule threads
- `/commitments` - Upcoming/past commitments with detail view
- `/profile` - Current user profile and impact rewards
- `/people/[slug]` - Public neighbor profile
- `/map` - Map placeholder surface
- `/signup` - Conversational signup flow

## Local Data Behavior

This project currently uses seeded mock data plus browser-local persistence for key flows.

- Requests feed source:
	- Seeded requests from `data/helpRequests.ts`
	- User-posted requests stored in localStorage via `lib/localRequests.ts`
- Posted needs:
	- Submitting in `/post` stores a request locally and it appears in `/home`
	- The same posted requests also appear on `/profile` under "Requests you posted"
- Signup/profile data:
	- Stored in localStorage via `lib/localProfile.ts`
- Messages:
	- Thread history stored in localStorage on the messages surface

Local storage keys used:

- `gather-local-help-requests`
- `gather-local-profile`
- `gather-messages`

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript + JavaScript mixed codebase
- CSS Modules + global tokenized styles (`app/globals.css`)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Run production server
npm run lint    # ESLint
```

## Project Structure

```text
app/           Route segments (App Router)
components/    UI surfaces and route-level components
data/          Seed/mock domain data
lib/           Local persistence helpers and utilities
public/        Static assets
```

## Notes

- This is currently a frontend-first product scaffold with local persistence.
- Firebase is present as a dependency, but core app flows are currently local/mock-driven.
- If you need a clean demo reset, clear localStorage for the keys listed above.
