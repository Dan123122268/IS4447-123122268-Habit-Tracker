# Trackify

Trackify is a React Native and Expo habit tracker for IS4447 student `123122268`.
It uses local SQLite persistence through Drizzle ORM.

## Current State

- Habit list/dashboard with search and category filtering
- Add, edit, delete, and log habits
- Categories, habits, logs, targets, users, and settings schema
- Category and target management screens
- Insights screen with daily, weekly, and monthly chart views
- Streak and top-habit summaries from stored logs
- Local account flow with register, login, logout, and delete profile
- Seed data for all core tables
- Reusable UI components for forms, buttons, headers, tags, cards, and progress bars
- Jest tests for seeding, reusable form input, and seeded habit list rendering

## Roadmap

1. Categories and targets
   - Create and edit categories with colours/icons
   - Define weekly/monthly targets per habit or category
   - Show progress and remaining amounts

2. Insights and charts
   - Daily, weekly, and monthly summaries
   - Simple bar or pie chart from stored habit logs
   - Streak calculation from completed logs

3. Advanced features
   - Light/dark mode toggle with persisted setting
   - CSV export of habit logs
   - Local reminders for habit logging
   - Optional public API integration

4. Delivery polish
   - App icon/branding update
   - Expo publish link
   - Demo-video checklist
   - Short report notes for accessibility, architecture, and AI usage

## Development

```bash
npm install
npm test
npm run lint
npx tsc --noEmit
npx expo start
```
