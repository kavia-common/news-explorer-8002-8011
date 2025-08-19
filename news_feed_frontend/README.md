# News Explorer Frontend (React)

A modern and minimalistic React app for browsing, searching, filtering, viewing, and bookmarking news articles. This initial version uses placeholder data and is ready for backend integration.

## Features

- Browse a responsive news feed (grid)
- Search and filter by category
- View article details in a modal
- Bookmark articles (saved to localStorage)
- Responsive layout (header, sidebar, main content)
- Light theme by default, optional dark theme toggle
- Environment variable scaffolding for API

## Getting Started

Install dependencies and start the dev server:
- npm install
- npm start

Open http://localhost:3000 to view it in your browser.

## Environment Variables

Copy .env.example to .env and set variables as needed:
- REACT_APP_API_BASE_URL=<your_backend_base_url>

Note: Do not commit your .env file.

## Project Structure

- src/App.js — main UI implementation (header, sidebar, feed, modal)
- src/App.css — styles and theme variables
- src/index.js — entry point
- .env.example — environment variable scaffold

## Theming

Colors are defined via CSS variables in src/App.css. Primary palette:
- Primary: #1a73e8
- Secondary: #e8eaed
- Accent: #ff7043

## Future Backend Integration

Replace placeholder data in App.js with real API calls to REACT_APP_API_BASE_URL endpoints. Fetch logic can be added where STUB_ARTICLES is currently used.

## Scripts

- npm start — start dev server
- npm run build — build for production
- npm test — run tests
