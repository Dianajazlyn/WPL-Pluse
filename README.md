# WPL Pulse — Women's Premier League Dashboard

A live-style dashboard for tracking Women's Premier League (WPL) cricket stats — standings, top run scorers, top wicket takers, and season form — built with React and Recharts.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features

- **Standings** — points table with matches played, wins, losses, net run rate, and recent match results
- **Run Scorers** — bar chart and stats table for top batters (runs, average, strike rate, high score)
- **Wicket Takers** — bar chart and stats table for top bowlers (wickets, economy, average, best figures)
- **Points Progression** — line chart tracking each team's points across the season, plus a radar chart comparing teams head-to-head

## Tech Stack

- [React](https://react.dev/)
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/wpl-dashboard.git
   cd wpl-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open the local URL printed in your terminal (usually `http://localhost:5173`).

## Data

The dashboard currently uses **sample data** for demonstration purposes. To connect it to real WPL stats:

1. Replace the sample data objects (`TEAMS`, `RUN_SCORERS`, `WICKET_TAKERS`, `MATCH_TREND`, `RECENT_MATCHES`) near the top of `App.jsx` with your own data.
2. Or wire up a CSV/API data source and map it into the same shape.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Built as a personal analytics/portfolio project exploring sports data visualization.
