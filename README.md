# Ledgerly Finance Dashboard

Ledgerly is a responsive finance management frontend prototype built for Task 2. It uses static mock data and local React state to demonstrate the core product experience without a backend, database, authentication, or cloud infrastructure.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Included flows

- Dashboard overview with balance, income, expenses, savings, recent transactions, spending trend, and category breakdown.
- Transactions screen with local search and category filtering.
- Add expense modal with local state updates and toast feedback.
- Responsive sidebar navigation with mobile drawer behavior.
- Placeholder-ready Analytics, Accounts, and Settings surfaces for future backend work.

## Project structure

```text
src/app/
  page.tsx       # Dashboard UI, mock data, charts, and local interactions
  globals.css    # Design tokens, typography, responsive foundations
```

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS v4, Recharts, and Lucide React.

## Product notes

The prototype intentionally uses local state and static data. The next implementation phase can replace the data arrays and form handlers with API calls while preserving the current interaction model.
