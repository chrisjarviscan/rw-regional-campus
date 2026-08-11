# Campus Detail Pages — DC First

Angela's read is right: people can't say yes until they know when the days start and end, where they'll be, and whether they need a hotel. The fix is a detail page per campus, built one at a time starting with Washington, DC, reviewable on a hidden URL before anything is linked publicly.

## What we build first

A Washington, DC campus page at `/campus/washington-dc`, not linked from the nav or the city cards until you approve it. You and Angela can open the URL directly and share it with the team.

Page sections, in order:

1. **Header** — city, dates, "Registration Open" badge, host partner (Nestlé USA), registration deadline, and a "Reserve My Seats" button that opens the same reservation modal used on the landing page.
2. **At a glance** — a compact facts strip: Day 1 start/end, Day 2 start/end, venue name and neighborhood, nearest airport, whether an overnight stay is expected, dress code, meals included.
3. **Detailed agenda with times** — the existing Day 1 / Day 2 timeline, with a time next to each block.
4. **Venue & getting there** — address, transit/parking notes, and a hotel guidance paragraph (a recommended block if we have one, otherwise "most participants stay near the venue; here's the area").
5. **The volunteer experience** — nonprofit partner and what the Day 1 immersion involves. Rendered only when we have the content, so the page ships without it.
6. **Travel & logistics FAQ** — three or four short questions: Do I need to stay overnight? What time can I book my flight home? What's included? Can I send more than one person?
7. **Closing CTA** — reserve seats, plus the info-session link.

## Then the others

Once the DC page reads the way you want, the same template gets filled for Atlanta (Kilpatrick Townsend, Oct 7–8) and Seattle (Adobe, Oct 21–22). Bay Area gets a lighter version once dates firm up. Only when a page is approved do we add "View campus details" to that city's card and to the nav.

## Landing-page change

Small one: the shared agenda gets a "typical day" time range at the top of each day column (for example, Day 1 8:30am–5:00pm) with a note that exact times are confirmed per campus. Each city card links to its detail page for the specifics. This keeps the landing page from getting heavier while answering the first question people ask.

## What I need from you

Upload the Dropbox files straight into the chat — that is the best way; I can read PDFs, Word, PowerPoint, and spreadsheets directly. For DC specifically:

- The run-of-show / working agenda with times
- Venue name, address, and anything you tell people about parking, transit, or nearby hotels
- Whether Day 1 has an evening component that affects travel plans
- Nonprofit partner and volunteer activity, if confirmed (skip if not — the section stays hidden)

If a field is unknown, I'll leave it out rather than guess. Nothing invented.

## Preview

Everything is built in the editor preview first. When it's ready, we publish so the page is reachable at `campuses.realizedworth.com/campus/washington-dc` while staying unlinked from the nav, the city cards, and the sitemap, and marked `noindex` so it doesn't show up in search. You share that URL with Angela, we iterate, and only then do we link it.

## Technical notes

- New route `/campus/:slug` in `src/App.tsx`, rendering a new `src/pages/CampusDetail.tsx`.
- A single `src/data/campuses.ts` becomes the source of truth for city, dates, status, partner, deadline, venue, times, and travel copy. `CitiesSection.tsx` reads from it too, so dates stop drifting between the cards and the modals.
- Optional fields (venue, nonprofit, agenda times) render conditionally; a campus with no detail content simply has no link.
- `ReserveSeatsModal` and `RegistrationModal` are reused as-is.
- Per-page `Helmet` with `noindex` while in draft; removed and added to `sitemap.xml` when we go live.
