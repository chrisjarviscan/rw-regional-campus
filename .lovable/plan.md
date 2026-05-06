## Make Your Business Case — phased build

The uploaded spec is ~1000 lines covering research + multi-step form + personalized PPTX. Building it all at once is risky: if research produces weak data, the rest is wasted. Recommend three phases. **This plan covers Phase 1 in detail; Phases 2–3 are scoped but built only after Phase 1 is validated.**

### Where it lives

Standalone HTML at `public/business-case/index.html`, served at `https://rw-regional-campus.lovable.app/business-case/`. Self-contained — own CSS, own JS, no React. Uses RW brand tokens (Hero Navy, Hero Orange, Roboto) inline so it matches the main site visually.

A small "Make Your Business Case" link added to the main site footer so people can find it.

### AI provider

Lovable AI (no API key needed). Model: `google/gemini-2.5-pro` with Google Search grounding for the research call. The Anthropic + native `web_search` flow from the doc is replaced with Gemini grounded search — same outcome (real URLs, real findings, citations), zero secret setup for you.

All AI calls go through a Supabase edge function `research-company`. The browser never sees the API key. CORS limited to the published domain + preview.

---

## Phase 1 — Research engine + minimal shell (this build)

**Goal:** prove the AI can produce useful, accurate, structured findings about a real company, and let the user review/edit them.

### 1. Edge function: `research-company`

- Accepts `{ company_name }`, validates with zod (length 2–120, trimmed).
- Calls Lovable AI Gateway with Gemini 2.5 Pro + Google Search grounding.
- System prompt = the structured-output spec from the doc (CompanyResearch schema, confidence rules, "use null, never fabricate", max 5 items per array, etc.).
- Uses tool-calling for structured output (not "please return JSON") so we get reliable parsed data.
- Returns `CompanyResearch` JSON exactly matching the doc's interface, plus `researched_at` and `sources[]` extracted from grounding metadata.
- Handles 429 (rate limit) and 402 (credits) with friendly messages surfaced to the UI.
- In-memory IP rate limit (10 req / 10 min) since the tool is public and the AI calls cost money.

### 2. Tool shell: `public/business-case/index.html`

Single HTML file, RW-branded. Sections:

- **Step 1 — Company name** (single input + "Research my company" button).
- **Step 1.5 — Research findings** with three states: loading (skeleton + status text), results (finding cards with confidence badges, inline edit, "Looks good" / "Skip"), error (friendly fallback to manual entry).
- **Step 2 — placeholder** for now ("Coming soon — for now, your research is below"), with a "Copy findings as text" button so the output is useful even before the form/PPTX exist.

`renderResearchFindings()` builds DOM with `createElement` (no `innerHTML` with user/AI strings). Confidence badges color-coded per the doc spec.

### 3. Footer link on main site

Add a small "Make Your Business Case" link to `Footer.tsx` nav, pointing to `/business-case/`.

### Phase 1 deliverable

You give it a real company name (e.g. "Ford Motor Company", "Salesforce"), get back accurate, sourced findings with confidence badges, can edit any field, and can copy the result as text. That's a useful tool on its own and proves the AI piece works before we invest in the rest.

---

## Phase 2 — Multi-step form (later, separate build)

After Phase 1 is validated:
- Steps 2–6 from the doc: presenter info, audience/decision-makers, current program state, asks (budget, sponsorship, time), success metrics.
- Research findings pre-fill relevant fields.
- Local storage persistence so refresh doesn't lose progress.
- Add a second edge function `business-case-coach` that takes the assembled form data and returns suggested wording / sharper framing for the deck (Lovable AI, no grounding needed).

## Phase 3 — Personalized PPTX (later, separate build)

After Phase 2:
- PptxGenJS in the browser. Slides 2, 7, 11 personalized from research; remaining slides from form data.
- RW palette (Hero Navy + Hero Orange), Roboto, real photos via `<img>` from `src/assets`.
- Download button generates and saves the .pptx client-side.

---

## Technical notes

**Files created in Phase 1:**
- `supabase/functions/research-company/index.ts` — edge function (Lovable AI proxy)
- `public/business-case/index.html` — standalone tool
- `public/business-case/styles.css` — RW-branded styles
- `public/business-case/app.js` — research call + render + edit logic
- edit `src/components/Footer.tsx` — add link

**No new secrets needed.** `LOVABLE_API_KEY` is already in the project.

**No DB tables** in Phase 1. (Phase 2 may add a `business_case_drafts` table for resume-from-link.)

**Verify_jwt:** function deployed with `verify_jwt = false` so the public tool can call it without a session.

**Cost guardrail:** in-memory IP rate limit + max_tokens cap (~2048) keep AI spend bounded.

```text
public/business-case/
  index.html        Step 1, 1.5, 2 placeholder
  styles.css        RW tokens + skeleton/finding-card styles
  app.js            fetch → render → edit → copy

supabase/functions/research-company/
  index.ts          zod validate → Lovable AI grounded call → CompanyResearch JSON
```

Approve and I'll build Phase 1.
