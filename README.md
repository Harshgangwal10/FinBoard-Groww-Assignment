# Next.js Finance Dashboard Builder

A fully-responsive Finance Dashboard Builder built with **Next.js 15+**,
**TypeScript**, **TailwindCSS**, **shadcn/ui**, **Zustand**, and **Chart.js**.

FinBoard enables users to create their own finance monitoring dashboard by
connecting to APIs and displaying real-time financial data through modular widgets.

------------------------------------------------------------------------

## Live Demo  
[Live Demo](https://financedashboard-fawn.vercel.app/)

------------------------------------------------------------------------

## Screenshot

## Card Widget Screenshot

<img width="1910" height="913" alt="card" src="https://github.com/user-attachments/assets/00b9e493-5c50-4baf-8070-0394c4fab4b7" />

## Table Widget Screenshot

<img width="1919" height="883" alt="image" src="https://github.com/user-attachments/assets/aa06dd9a-a3ed-4116-b18c-3b6088b05f75" />





------------------------------------------------------------------------

##  Tech Stack

-   **Next.js 15+**
-   **TypeScript**
-   **TailwindCSS**
-   **shadcn/ui** (for accessible UI components)
-   **Zustand** (for central state management with persistence)
-   **Chart.js** (Candle, Bar, Line charts)
-   **Vercel** for deployment

------------------------------------------------------------------------

## Features Implemented

✔ **Add, update, delete widgets**

✔  **Widget types supported**:
    - Charts - Candle (built with Chart.js)
    - Tables - auto-mapped from API arrays
    - Cards  - simple field-based metric display

✔ **Drag-and-drop (DnD)**  (dashboard rearrangement)

✔ **Field selection & mapping from JSON responses**

✔ **Delete button** for widgets

✔ **Light & dark mode toggle**

✔ **Responsive UI** (mobile → desktop)

✔ **State persistence using Zustand local storage**

✔ **Export/import dashboard configuration**

------------------------------------------------------------------------

##  Setup Instructions

1.  Clone the repository:

    ``` bash
    git clone <your-repo-url>
    cd <your-repo>
    ```

2.  Install dependencies:

    ``` bash
    pnpm install
    # or
    npm install
    ```

3.  Run the development server:

    ``` bash
    pnpm dev
    # or
    npm run dev
    ```

4.  Open <http://localhost:3000> in your browser.

------------------------------------------------------------------------

## Usage

## Adding a Widget

1. Click the "Add Widget" button
2. Enter a widget name (e.g., "Bitcoin Price Tracker")
3. Select widget type (Finance Card, Table, or Chart)
4. Select Provider ( Alpha Vantage, Finnhub )
5. Select Endpoint
6. Set refresh interval in seconds
7. Select Format
8. Test Api
9. Select the fields you want to display from the API response
10. Click "Add Widget"

## Configuring a Widget

1. Click the gear icon (⚙️) on any widget
2. Modify widget name, API URL, refresh interval, or selected fields
3. Click "Save Changes"
   
## Rearranging Widgets

1. Click and hold the drag handle (⋮⋮) on any widget
2. Drag to the desired position
3. Release to drop

## Removing a Widget
1. Click the delete button on any widget
   
------------------------------------------------------------------------

## API Integration Guide

This project connects to two real-time financial data providers:

##  1. FinClub API
**Used for**:

 1. Market summaries
 2. Stock listings
 3. Card metrics
 4. Table mappings

✔ Fetches stock market values

✔ Supports table + card visuals

##  2. Alpha Vantage API

**Used for**:

  1. Global price quotes
  2. Daily/weekly candles
  3. Chart time-series feeds

✔ Global Quote endpoint

✔ Time-series endpoints


**Both APIs are connected using environment variables:**

    NEXT_PUBLIC_FINCLUB_API_KEY=your_key_here
    NEXT_PUBLIC_ALPHA_API_KEY=your_key_here


------------------------------------------------------------------------


## Project Structure

``` bash
src/
│
├── app/                          # Root app directory 
│   ├── api/                      # Server routes / API proxies
│   │   └── fetch/route.ts        # API fetch abstraction layer
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout + theme wrapper
│   └── page.tsx                  # Main dashboard page (renders widget system)
│
├── components/                   # UI and widget building blocks
│   ├── ui/                       # Reusable shadcn/ui components
│   │
│   ├── widgets/                  # dashboard widgets
│   │   ├── candle-chart-widget.tsx   # Candle  charts
│   │   ├── card-widget.tsx           # Finance metric cards
│   │   ├── table-widget.tsx          # Table widget for list data
│   │   ├── widget-grid.tsx           # Drag-and-drop grid container
│   │   └── widget-shell.tsx          # Shared wrapper (title, delete, refresh)
│   ├
│   ├── add-widget-dialog.tsx         # Modal for adding new widgets
│   ├── header.tsx                    # Dashboard header with actions
│   ├── json-explorer.tsx             # Explore API JSON & map fields
│   ├── theme-provider.tsx            # Light/Dark mode provider
│   └── widget-config-dialog.tsx      # Widget configuration editor
│
├── lib/                         
│   ├── json-utils.ts             # Dynamic JSON mapper utilities
│   ├── store.ts                  # Config constants
│   ├── types.ts                  # Shared TS interfaces/types
│   └── utils.ts                  # Formatting helpers (currency, date, etc.)
│
├── public/                       # Static assets
│
└── .env.local                    # API keys & secure environment configs

------------------------------------------------------------------------
