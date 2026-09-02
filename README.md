# The Duty Clock — frontend

Plans a trip against the 70-hour / 8-day HOS cycle and renders the result as a
route map plus a federal-format driver's daily log sheet for every calendar day
the trip touches.

Routing, geocoding and HOS scheduling all happen server-side. This app takes the
planned trip and draws it.

## Running it

Requires Node 20.19+ (see `.nvmrc`).

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at the Django API
npm run dev
```

Run the checks with `npm run lint`, `npm test` and `npm run build`.

`VITE_API_BASE_URL` defaults to `http://localhost:8000` when unset.

## Routes

| Route | What it is |
| --- | --- |
| `/` | The trip form — current location, pickup, dropoff, cycle hours used. |
| `/trips/:id` | Map, trip summary and one log sheet per day. Refresh-safe. |

Submitting the form `POST`s to `/api/trips/plan` and navigates to `/trips/:id`,
so every planned trip has a shareable URL. Loading that URL cold re-fetches
through `GET /api/trips/:id`. There is no trip list or history.

The form generates one `Idempotency-Key` for each distinct normalized payload
and reuses it when that same submission is attempted again. This lets the API
return the previously created trip after an uncertain network response without
repeating ORS work or inserting another database row.

## How the log sheet is built

`lib/time.js` → `splitSegmentsByDay()` takes the backend's flat, chronological
segment list and clips every segment at each midnight it crosses, so a drive
from 22:00 to 03:00 becomes a piece on each of the two sheets. Any part of a day
the backend did not report is filled in as off duty, which is what keeps the
duty line unbroken and every sheet's row totals adding to 24:00.

`useDaySheets()` memoizes that split and adds each day's per-status totals.
`LogGrid.jsx` hand-draws the 24-hour × 4-row grid in SVG — hour boundaries,
quarter-hour ticks, and the duty status as one continuous step-line — and prints
the row totals down the right edge. `RemarksStrip.jsx` lists the reported status
changes for that day underneath.

Timestamps are UTC. The API sends UTC instants and no home-terminal timezone, so
sheets are UTC calendar days; re-reading them in the viewer's local zone would
slide the duty line away from the times the backend actually returned.

## Design system

Every colour, font and radius is defined once and referenced everywhere — no
component holds a hex value.

- `lib/designTokens.js` — the raw palette, the two font stacks (Inter for UI,
  JetBrains Mono for anything tabular), the radius and layout sizes.
- `theme.js` — builds the MUI theme from those tokens: palette, type scale,
  shape, and component defaults. Cards are outlined rather than elevated, and
  Leaflet's own popup/zoom/attribution chrome is restyled here so the map sits
  inside the same system as everything drawn with MUI.
- `lib/constants.js` — `STATUS_COLORS`, the one duty-status palette, imported by
  the log grid, the status chips, the remarks strip and the map. A status looks
  the same everywhere it appears.

| Status | Colour |
| --- | --- |
| Off duty | slate `#6B7A7E` |
| Sleeper berth | indigo `#5B5FA6` |
| Driving | teal `#0B4F5C` |
| On duty | amber `#B5762C` |

Inside the SVG the hierarchy is deliberate: quarter-hour ticks are the lightest
mark, hour lines sit above them, midnight and noon are heavier still, and the
duty step-line is the heaviest and the only coloured element — so the data is
never mistaken for the form it is drawn on. Hovering a segment shows its exact
start–end time and location.

## State

Server state lives in TanStack Query (`usePlanTrip`, `useTripPlan`), keyed by
trip id. There is no client state that outlives a page, so there is no global
store. The four form fields are local `useState`.

## Data fetching

Trips are immutable server-side — the API creates and reads them, never updates
them — so the trip query uses `staleTime: Infinity`. A trip already in the cache
is never refetched, including the copy the plan mutation seeds on success, so
arriving at `/trips/:id` from the form costs no extra request.

`useTripPlan` takes React Query's `signal` and hands it to Axios. That is what
makes a request cancellable: React Query only aborts a fetch on unmount if the
query function actually consumed the signal. Without it, navigating away left a
~106 KB response downloading for a page nobody was looking at, which the Django
dev server reports as a broken pipe.

`shouldRetryRequest` (in `api/client.js`) is the retry policy: cancellations and
4xx responses are answers, not failures, so they are never retried. A 5xx or a
transport error still retries once, so a genuine outage is not hidden.

`npm test` covers these behaviours — request counts for direct navigation, the
seeded-cache path, cancellation on unmount, deduplication, 4xx handling, and
StrictMode — against a stubbed Axios adapter, so the real client -> hook chain is
exercised without a network.

## Stack

React 19 · Vite · MUI (+ `@mui/icons-material`) · TanStack Query · React Router ·
react-leaflet + OpenStreetMap tiles · PropTypes.
