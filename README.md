# Next.js Finance Dashboard Builder

A fully-responsive Finance Dashboard Builder built with **Next.js 15+**,
**TypeScript**, **TailwindCSS**, **shadcn/ui**, **Zustand**, and **Chart.js**.

FinBoard enables users to create their own finance monitoring dashboard by
connecting to APIs and displaying real-time financial data through modular widgets.

------------------------------------------------------------------------

## Live Demo  
[Live Demo](https://finance-dashboard-three-umber.vercel.app/)

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
