# Trackify

Trackify is a React Native and Expo habit tracker developed for IS4447 student `123122268`.
It uses local SQLite persistence through Drizzle ORM and focuses on habit creation, logging,
targets, insights, and mobile-friendly offline use.

## Project Summary

Trackify supports:

- local register, login, logout, and profile deletion
- habit CRUD with category assignment and optional notes
- habit activity logs with date, measurable count, and completion state
- category management with named colours and icons
- weekly and monthly targets for habits or categories
- daily, weekly, and monthly insights with a bar chart
- streak tracking and summary cards derived from stored logs
- search and category filtering on the habit list
- persisted light, dark, and system theme preference
- local notification reminders
- CSV export of stored habit logs
- seed data for all core tables
- Jest tests for seed logic, reusable form input, and seeded habit rendering

All data is stored locally using SQLite via Drizzle ORM.

## Technology

- React Native
- Expo
- Expo Router
- SQLite
- Drizzle ORM
- Jest
- React Native Testing Library

## Project Structure

- `app/` screen routes and navigation
- `components/` reusable UI and feature components
- `context/` application state and theme providers
- `db/` database client, schema, and seed logic
- `utils/` filtering, insights, auth, export, date, and reminders helpers
- `tests/` unit, component, and integration tests

## Setup

This project is editor-agnostic and can be opened in VS Code, Cursor, PyCharm, or another IDE.
The important part is having Node.js, npm, and a terminal available.

Recommended runtime:

- Node.js 22 LTS

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npx expo start
```

Useful commands:

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```

## Testing

The project includes:

- a unit test for the seed function
- a component test for the reusable `FormField`
- an integration test for the seeded habit list screen
- additional utility tests for filters, insights, export, and auth helpers

## Data Privacy

Trackify is local-only by default. User records are stored on-device using SQLite.
No remote database or secret key is required for the core experience.

## Repository

GitHub repository:

`https://github.com/Dan123122268/IS4447-123122268-Habit-Tracker`
