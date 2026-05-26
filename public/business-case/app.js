// Make Your Business Case — full multi-step flow
(function () {
  "use strict";

  const SUPABASE_URL = "https://htmhemgnmqlctvhkqecx.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bWhlbWdubXFsY3R2aGtxZWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODY5NTYsImV4cCI6MjA5MjI2Mjk1Nn0.vDNE1KgFjoiMVeMu44wbtrM9hF0-jpO2XZvdQTRUu00";
  const RESEARCH_URL = `${SUPABASE_URL}/functions/v1/research-company`;
  const GENERATE_URL = `${SUPABASE_URL}/functions/v1/generate-deck`;
  const SUBMIT_URL = `${SUPABASE_URL}/functions/v1/submit-form`;
  const STORAGE_KEY = "rw_business_case_draft_v2";
  const STORAGE_TTL_MS = 1000 * 60 * 60 * 24; // 24h — drafts auto-expire
  const TOTAL_STEPS = 7;

  /** ---------------- State ---------------- */
  const state = {
    currentStep: 1,
    company_name: "",
    research: null,
    audience: {},
    timing: {},
    fit: { challenges: [], outcomes: [] },
    ask: {},
  };

  /** ---------------- Constants ---------------- */
  const CHALLENGES = [
    "Volunteer events feel transactional",
    "We can't measure real impact",
    "Hard to retain volunteer leaders",
    "Champions burn out",
    "Senior leaders aren't engaged",
    "Inconsistent quality across events",
    "Nonprofit partners feel under-served",
    "Participation rates have plateaued",
    "Skills-based volunteering is hard to scale",
    "DEI commitments aren't showing up in volunteering",
    "ESG reporting is shallow on community impact",
    "Hybrid teams don't connect through events",
    "We rely on a few champions doing too much",
    "We don't know how to train new champions",
    "Volunteers aren't returning",
    "Leadership wants ROI we can't yet show",
    "Champions feel isolated from each other",
    "Our program lacks a clear methodology",
    "Onboarding new volunteers takes too long",
    "Cross-team coordination is heavy",
    "Manager support for time-off is uneven",
    "We can't connect volunteering to retention",
    "We can't articulate our 'why' beyond doing good",
    "Champions feel like coordinators, not leaders",
  ];

  const OUTCOMES = [
    "Stronger leadership pipeline through volunteer roles",
    "Higher participation across the company",
    "Deeper, longer-term nonprofit partnerships",
    "Champions trained to facilitate, not just organize",
    "Measurable retention and engagement gains",
    "ESG / CSR reporting with real depth",
    "Community impact that's actually felt by partners",
    "A unified methodology our team can teach others",
    "Cross-functional connection between teams",
    "Manager-to-employee trust through shared experience",
    "DEI commitments expressed through how we volunteer",
    "Champions who stay and grow rather than burning out",
  ];

  /** ---------------- Helpers ---------------- */
  const $ = (id) => document.getElementById(id);
  const show = (el) => el && el.removeAttribute("hidden");
  const hide = (el) => el && el.setAttribute("hidden", "");

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function persist() {
    try {
      const wrapped = { savedAt: Date.now(), state };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapped));
    } catch {}
  }
  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Backwards-compat: legacy v1 stored state at top level. Drop it — too risky to inherit cross-user data.
      if (!parsed || typeof parsed !== "object" || !parsed.savedAt || !parsed.state) {
        localStorage.removeItem(STORAGE_KEY);
        // Also clear the legacy key if present
        try { localStorage.removeItem("rw_business_case_draft_v1"); } catch {}
        return;
      }
      if (Date.now() - parsed.savedAt > STORAGE_TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      Object.assign(state, parsed.state);
    } catch {}
  }

  function clearStorage() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    try { localStorage.removeItem("rw_business_case_draft_v1"); } catch {}
  }

  /** ---------------- Stepper ---------------- */
  function goToStep(n) {
    state.currentStep = n;
    persist();
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const sec = $(`step-${i}`);
      if (!sec) continue;
      if (i === n) show(sec); else hide(sec);
    }
    hide($("step-done"));
    updateStepperUI();
    window.scrollTo({ top: document.querySelector(".stepper").offsetTop - 12, behavior: "smooth" });
  }

  function updateStepperUI() {
    const lis = document.querySelectorAll(".stepper li");
    lis.forEach((li) => {
      const s = parseInt(li.dataset.step, 10);
      li.classList.toggle("is-current", s === state.currentStep);
      li.classList.toggle("is-done", s < state.currentStep);
    });
  }

  // Wire prev/next buttons
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.matches("[data-prev]")) goToStep(Math.max(1, state.currentStep - 1));
    if (t.matches("[data-next]")) goToStep(Math.min(TOTAL_STEPS, state.currentStep + 1));
  });

  /** ---------------- Step 1: Company ---------------- */
  $("company-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = $("company-input").value.trim();
    if (v.length < 2) return;
    state.company_name = v;
    persist();
    goToStep(2);
    await runResearch(v);
  });

  $("skip-research-btn").addEventListener("click", () => {
    const v = $("company-input").value.trim();
    if (v.length < 2) { $("company-input").focus(); return; }
    state.company_name = v;
    state.research = null;
    persist();
    goToStep(3);
  });

  /** ---------------- Step 2: Research ---------------- */
  async function runResearch(name) {
    show($("research-loading"));
    hide($("research-results"));
    hide($("research-error"));
    hide($("research-nav"));

    try {
      const resp = await fetch(RESEARCH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ company_name: name }),
      });
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg =
          resp.status === 429 ? "We're getting a lot of requests right now. Please try again in a minute." :
          resp.status === 402 ? "AI credits are temporarily exhausted. Please contact nichole@realizedworth.com." :
          (data.error || "Something went wrong. Please try again.");
        showResearchError(msg);
        return;
      }

      state.research = data;
      persist();
      hide($("research-loading"));
      show($("research-results"));
      show($("research-nav"));
      renderFindings();
      prefillFromResearch();
    } catch (err) {
      console.error(err);
      showResearchError("Network error. Please check your connection and try again.");
    }
  }

  function showResearchError(msg) {
    hide($("research-loading"));
    hide($("research-results"));
    show($("research-error"));
    show($("research-nav"));
    $("research-error-text").textContent = msg;
  }

  $("error-retry").addEventListener("click", () => runResearch(state.company_name));
  $("error-skip").addEventListener("click", () => { state.research = null; persist(); goToStep(3); });

  const FIND_GROUPS = [
    {
      title: "Program", confidenceKey: "program_details",
      fields: [
        { key: "has_volunteer_program", label: "Has a volunteer program", type: "bool" },
        { key: "program_name", label: "Program name", type: "text" },
        { key: "program_age_years", label: "Program age (years)", type: "number" },
        { key: "has_champions_or_ambassadors", label: "Has champions or ambassadors", type: "bool" },
        { key: "champion_count_estimate", label: "Champion count (estimate)", type: "text" },
      ],
    },
    {
      title: "Scale", confidenceKey: "scale_data",
      fields: [
        { key: "employee_count_estimate", label: "Employee count (estimate)", type: "text" },
        { key: "geographic_scope", label: "Geographic scope", type: "text" },
        { key: "volunteer_participation_rate", label: "Volunteer participation rate", type: "text" },
        { key: "volunteer_hours_reported", label: "Volunteer hours reported", type: "text" },
      ],
    },
    {
      title: "CSR / ESG context", confidenceKey: "csr_context",
      fields: [
        { key: "csr_report_url", label: "CSR report URL", type: "url" },
        { key: "esg_framework", label: "ESG framework", type: "text" },
        { key: "stated_social_impact_goals", label: "Stated social impact goals", type: "list" },
        { key: "signature_nonprofit_partners", label: "Signature nonprofit partners", type: "list" },
        { key: "cause_areas", label: "Cause areas", type: "list" },
        { key: "values_or_mission_keywords", label: "Values / mission keywords", type: "list" },
        { key: "recent_csr_news", label: "Recent CSR news", type: "text" },
      ],
    },
  ];

  function renderFindings() {
    const c = $("findings-container");
    c.replaceChildren();
    if (!state.research) return;

    FIND_GROUPS.forEach((group) => {
      const section = document.createElement("div");
      section.className = "findings-group";
      const heading = document.createElement("h3");
      const conf = (state.research.confidence?.[group.confidenceKey] || "none").toUpperCase();
      heading.textContent = `${group.title} · ${conf} confidence`;
      section.appendChild(heading);
      group.fields.forEach((f) => section.appendChild(buildFindingCard(f, group.confidenceKey)));
      c.appendChild(section);
    });

    if (Array.isArray(state.research.sources) && state.research.sources.length) {
      const src = document.createElement("div");
      src.className = "findings-group";
      const h = document.createElement("h3"); h.textContent = "Sources"; src.appendChild(h);
      const card = document.createElement("div"); card.className = "finding-card";
      const ul = document.createElement("ul");
      state.research.sources.forEach((u) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = u; a.textContent = u; a.target = "_blank"; a.rel = "noopener noreferrer";
        li.appendChild(a); ul.appendChild(li);
      });
      card.appendChild(ul); src.appendChild(card); c.appendChild(src);
    }
  }

  function buildFindingCard(field, groupConfKey) {
    const card = document.createElement("div");
    card.className = "finding-card";

    const header = document.createElement("div");
    header.className = "finding-header";
    const label = document.createElement("span");
    label.className = "finding-label";
    label.textContent = field.label;
    header.appendChild(label);

    const right = document.createElement("div");
    right.style.display = "flex"; right.style.gap = "0.6rem"; right.style.alignItems = "center";
    const conf = (state.research.confidence?.[groupConfKey] || "none").toLowerCase();
    const badge = document.createElement("span");
    badge.className = `confidence-badge confidence-${conf}`;
    badge.textContent = conf;
    right.appendChild(badge);

    const editBtn = document.createElement("button");
    editBtn.type = "button"; editBtn.className = "edit-toggle"; editBtn.textContent = "Edit";
    right.appendChild(editBtn);

    header.appendChild(right);
    card.appendChild(header);

    const valueEl = document.createElement("div");
    valueEl.className = "finding-value";
    renderValue(valueEl, field, state.research[field.key]);
    card.appendChild(valueEl);

    editBtn.addEventListener("click", () => enterEditMode(card, valueEl, editBtn, field));
    return card;
  }

  function renderValue(el, field, value) {
    el.replaceChildren(); el.classList.remove("empty");
    const empty = value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    if (empty) { el.classList.add("empty"); el.textContent = "Not found — click Edit to add"; return; }
    if (field.type === "list" && Array.isArray(value)) {
      const ul = document.createElement("ul");
      value.forEach((v) => { const li = document.createElement("li"); li.textContent = String(v); ul.appendChild(li); });
      el.appendChild(ul); return;
    }
    if (field.type === "bool") { el.textContent = value ? "Yes" : "No"; return; }
    if (field.type === "url") {
      const a = document.createElement("a");
      a.href = String(value); a.textContent = String(value); a.target = "_blank"; a.rel = "noopener noreferrer";
      el.appendChild(a); return;
    }
    el.textContent = String(value);
  }

  function enterEditMode(card, valueEl, editBtn, field) {
    editBtn.disabled = true;
    valueEl.replaceChildren();
    let inputEl;
    if (field.type === "bool") {
      inputEl = document.createElement("select");
      [["", "—"], ["true", "Yes"], ["false", "No"]].forEach(([v, t]) => {
        const o = document.createElement("option"); o.value = v; o.textContent = t; inputEl.appendChild(o);
      });
      const cur = state.research[field.key];
      inputEl.value = cur === true ? "true" : cur === false ? "false" : "";
    } else if (field.type === "list") {
      inputEl = document.createElement("textarea");
      inputEl.placeholder = "One item per line";
      inputEl.value = Array.isArray(state.research[field.key]) ? state.research[field.key].join("\n") : "";
    } else if (field.type === "number") {
      inputEl = document.createElement("input"); inputEl.type = "text"; inputEl.inputMode = "numeric";
      inputEl.value = state.research[field.key] != null ? String(state.research[field.key]) : "";
    } else {
      inputEl = document.createElement("input"); inputEl.type = "text";
      inputEl.value = state.research[field.key] != null ? String(state.research[field.key]) : "";
    }
    valueEl.appendChild(inputEl);

    const actions = document.createElement("div");
    actions.style.cssText = "margin-top:0.5rem;display:flex;gap:0.5rem;";
    const save = document.createElement("button");
    save.type = "button"; save.className = "btn btn-primary";
    save.style.cssText = "padding:0.4rem 0.9rem;font-size:0.85rem;";
    save.textContent = "Save";
    const cancel = document.createElement("button");
    cancel.type = "button"; cancel.className = "btn btn-link";
    cancel.style.padding = "0.4rem 0.5rem";
    cancel.textContent = "Cancel";
    actions.append(save, cancel);
    valueEl.appendChild(actions);
    inputEl.focus();

    save.addEventListener("click", () => {
      const raw = inputEl.value;
      let next;
      if (field.type === "bool") next = raw === "true" ? true : raw === "false" ? false : null;
      else if (field.type === "list") next = raw.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 10);
      else if (field.type === "number") { const n = parseFloat(raw); next = Number.isFinite(n) ? n : null; }
      else next = raw.trim() === "" ? null : raw.trim();
      state.research[field.key] = next;
      persist();
      renderValue(valueEl, field, next);
      editBtn.disabled = false;
    });
    cancel.addEventListener("click", () => { renderValue(valueEl, field, state.research[field.key]); editBtn.disabled = false; });
  }

  function prefillFromResearch() {
    if (!state.research) return;
    // headcount
    if (state.research.employee_count_estimate && !state.fit.headcount_bracket) {
      const n = parseInt(String(state.research.employee_count_estimate).replace(/[^0-9]/g, ""), 10);
      if (Number.isFinite(n)) {
        const sel = $("headcount_bracket");
        if (n < 500) sel.value = "lt500";
        else if (n < 5000) sel.value = "500_5k";
        else if (n < 20000) sel.value = "5k_20k";
        else if (n < 50000) sel.value = "20k_50k";
        else sel.value = "50k_plus";
        state.fit.headcount_bracket = sel.value;
      }
    }
    // champions
    if (state.research.has_champions_or_ambassadors === true && !state.fit.has_champions) {
      const r = document.querySelector('input[name="has_champions"][value="yes"]');
      if (r) { r.checked = true; state.fit.has_champions = "yes"; }
    } else if (state.research.has_champions_or_ambassadors === false && !state.fit.has_champions) {
      const r = document.querySelector('input[name="has_champions"][value="no"]');
      if (r) { r.checked = true; state.fit.has_champions = "no"; }
    }
    persist();
  }

  /** ---------------- Step 3: Audience ---------------- */
  $("audience-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = String(fd.get("presenter_email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    state.audience = {
      presenter_name: String(fd.get("presenter_name") || "").trim(),
      presenter_email: email,
      presenter_role: String(fd.get("presenter_role") || "").trim(),
      audience_role: String(fd.get("audience_role") || ""),
      decision_maker: String(fd.get("decision_maker") || "").trim(),
    };
    persist();
    goToStep(4);
  });

  /** ---------------- Step 4: Timing ---------------- */
  $("timing-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    state.timing = {
      preferred_city: String(fd.get("preferred_city") || ""),
      preferred_quarter: String(fd.get("preferred_quarter") || ""),
      seats_requested: String(fd.get("seats_requested") || ""),
    };
    persist();
    goToStep(5);
  });

  /** ---------------- Step 5: Fit ---------------- */
  function buildCheckboxGrid(containerId, items, name, max) {
    const grid = $(containerId);
    grid.replaceChildren();
    shuffle(items).forEach((label) => {
      const wrap = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.name = name; cb.value = label;
      const txt = document.createElement("span"); txt.textContent = label;
      wrap.append(cb, txt);
      cb.addEventListener("change", () => {
        const checked = grid.querySelectorAll(`input[name="${name}"]:checked`);
        if (checked.length > max) { cb.checked = false; return; }
        wrap.classList.toggle("is-checked", cb.checked);
      });
      grid.appendChild(wrap);
    });
  }

  $("fit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const challenges = Array.from(document.querySelectorAll('input[name="challenges"]:checked')).map((i) => i.value);
    const outcomes = Array.from(document.querySelectorAll('input[name="outcomes"]:checked')).map((i) => i.value);
    const headcount = $("headcount_bracket").value;
    const champ = (document.querySelector('input[name="has_champions"]:checked') || {}).value || "";
    const train = (document.querySelector('input[name="has_formal_training"]:checked') || {}).value || "";
    if (!headcount) { alert("Please pick a headcount bracket."); return; }
    state.fit = {
      headcount_bracket: headcount,
      has_champions: champ,
      has_formal_training: train,
      challenges,
      outcomes,
    };
    persist();
    goToStep(6);
  });

  /** ---------------- Step 6: Ask ---------------- */
  $("ask-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    state.ask = {
      sponsor_name: String(fd.get("sponsor_name") || "").trim(),
      budget_range: String(fd.get("budget_range") || ""),
      primary_ask: String(fd.get("primary_ask") || "").trim(),
      extra_notes: String(fd.get("extra_notes") || "").trim(),
    };
    persist();
    renderReview();
    goToStep(7);
  });

  /** ---------------- Step 7: Review ---------------- */
  const LABELS = {
    audience_role: {
      ceo: "CEO / President", chro: "CHRO / Chief People Officer", cfo: "CFO / Finance leadership",
      csr_lead: "CSR / Sustainability leadership", hr_director: "HR / People director",
      dei_lead: "DEI / Inclusion leadership", comms_lead: "Communications / Brand",
      manager: "Direct manager", committee: "A committee or working group", other: "Other",
    },
    preferred_city: {
      washington_dc: "Washington DC (September 24–25, 2026)",
      atlanta: "Atlanta (October 14–15, 2026)", seattle: "Seattle (Fall 2026)",
      future: "Philadelphia / Minneapolis (future)", request_other: "Request a different city", flexible: "Flexible",
    },
    preferred_quarter: {
      q1_2026: "Q1 2026", q2_2026: "Q2 2026", q3_2026: "Q3 2026", q4_2026: "Q4 2026", "2027": "Sometime in 2027",
    },
    seats_requested: {
      "2_5": "2–5 seats", "6_12": "6–12 seats", "13_18": "13–18 seats", "19_30": "19–30 seats",
      "30_plus": "More than 30", exploring: "Just exploring",
    },
    headcount_bracket: {
      lt500: "Under 500", "500_5k": "500 – 5,000", "5k_20k": "5,000 – 20,000",
      "20k_50k": "20,000 – 50,000", "50k_plus": "More than 50,000",
    },
    has_champions: { yes: "Yes, formally", informal: "Informally", no: "Not yet" },
    has_formal_training: { yes: "Yes", some: "Some, ad-hoc", no: "No" },
    budget_range: {
      under_5k: "Under $5,000", "5k_15k": "$5,000–$15,000", "15k_30k": "$15,000–$30,000",
      "30k_60k": "$30,000–$60,000", "60k_plus": "More than $60,000", no_budget: "No budget yet",
    },
  };
  const decode = (group, key) => (LABELS[group] && LABELS[group][key]) || key || "";

  function renderReview() {
    const root = $("review-summary");
    root.replaceChildren();

    const blocks = [
      {
        title: "Company",
        rows: [
          ["Company", state.company_name],
          ["Research", state.research ? `${(state.research.confidence?.program_details || "none").toUpperCase()} program confidence · ${(state.research.confidence?.csr_context || "none").toUpperCase()} CSR confidence` : "Skipped"],
        ],
        editStep: 1,
      },
      {
        title: "Audience",
        rows: [
          ["Your name", state.audience.presenter_name],
          ["Your email", state.audience.presenter_email],
          ["Your role", state.audience.presenter_role],
          ["Audience", decode("audience_role", state.audience.audience_role)],
          ["Approves budget", state.audience.decision_maker],
        ],
        editStep: 3,
      },
      {
        title: "City & timing",
        rows: [
          ["Campus", decode("preferred_city", state.timing.preferred_city)],
          ["Backup quarter", decode("preferred_quarter", state.timing.preferred_quarter)],
          ["Seats", decode("seats_requested", state.timing.seats_requested)],
        ],
        editStep: 4,
      },
      {
        title: "Program fit",
        rows: [
          ["Headcount", decode("headcount_bracket", state.fit.headcount_bracket)],
          ["Champions", decode("has_champions", state.fit.has_champions)],
          ["Formal training", decode("has_formal_training", state.fit.has_formal_training)],
          ["Challenges", (state.fit.challenges || []).join(" · ")],
          ["Desired outcomes", (state.fit.outcomes || []).join(" · ")],
        ],
        editStep: 5,
      },
      {
        title: "Sponsor & ask",
        rows: [
          ["Internal sponsor", state.ask.sponsor_name],
          ["Budget range", decode("budget_range", state.ask.budget_range)],
          ["The ask", state.ask.primary_ask],
          ["Extra notes", state.ask.extra_notes],
        ],
        editStep: 6,
      },
    ];

    blocks.forEach((b) => {
      const div = document.createElement("div");
      div.className = "review-block";
      const h = document.createElement("h4"); h.textContent = b.title; div.appendChild(h);
      const dl = document.createElement("dl");
      b.rows.forEach(([k, v]) => {
        const dt = document.createElement("dt"); dt.textContent = k; dl.appendChild(dt);
        const dd = document.createElement("dd");
        if (v && String(v).trim() !== "") { dd.textContent = String(v); }
        else { dd.classList.add("empty"); dd.textContent = "—"; }
        dl.appendChild(dd);
      });
      div.appendChild(dl);
      const edit = document.createElement("button");
      edit.type = "button"; edit.className = "edit-toggle review-edit";
      edit.textContent = "Edit this section";
      edit.addEventListener("click", () => goToStep(b.editStep));
      div.appendChild(edit);
      root.appendChild(div);
    });
  }

  /** ---------------- Build payload ---------------- */
  function buildPayload() {
    return {
      company_name: state.company_name,
      presenter_name: state.audience.presenter_name || null,
      presenter_email: state.audience.presenter_email || null,
      presenter_role: state.audience.presenter_role || null,
      audience_role: state.audience.audience_role || null,
      decision_maker: state.audience.decision_maker || null,
      preferred_city: state.timing.preferred_city || null,
      preferred_quarter: state.timing.preferred_quarter || null,
      seats_requested: state.timing.seats_requested || null,
      headcount_bracket: state.fit.headcount_bracket || null,
      has_champions: state.fit.has_champions || null,
      has_formal_training: state.fit.has_formal_training || null,
      selected_challenges: state.fit.challenges || [],
      desired_outcomes: state.fit.outcomes || [],
      sponsor_name: state.ask.sponsor_name || null,
      budget_range: state.ask.budget_range || null,
      primary_ask: state.ask.primary_ask || null,
      extra_notes: state.ask.extra_notes || null,
      research_snapshot: state.research || null,
    };
  }

  /** Save a draft + mirror to RW team's Google Sheet (best-effort, non-blocking) */
  async function saveDraft(payload) {
    try {
      await fetch(SUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ type: "business_case", data: payload }),
      });
    } catch (err) {
      console.warn("Draft save failed (non-critical):", err);
    }
  }

  /** Decode base64 string to a Blob. */
  function base64ToBlob(base64, mime) {
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  /** Trigger a browser download from a blob URL (call from a user gesture for reliability). */
  function triggerDownload(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { a.remove(); }, 1500);
  }

  // Staged files from the most recent generation
  let stagedFiles = { pptx: null, html: null };

  function revokeStaged() {
    if (stagedFiles.pptx && stagedFiles.pptx.url) URL.revokeObjectURL(stagedFiles.pptx.url);
    if (stagedFiles.html && stagedFiles.html.url) URL.revokeObjectURL(stagedFiles.html.url);
    stagedFiles = { pptx: null, html: null };
  }

  function wireDownloadButton(btnId, key) {
    const btn = $(btnId);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const file = stagedFiles[key];
      if (!file) return;
      triggerDownload(file.url, file.filename);
    });
  }

  async function generateAndDownload() {
    const btn = $("download-btn");
    const status = $("submit-status");
    if (btn) { btn.disabled = true; btn.textContent = "Generating your deck…"; }
    show(status); status.textContent = "Tailoring copy and building both PowerPoint and HTML versions — this takes 15–25 seconds.";

    const payload = buildPayload();
    saveDraft(payload); // fire and forget

    try {
      const resp = await fetch(GENERATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg =
          resp.status === 429 ? "We're getting a lot of requests right now. Please try again in a minute." :
          resp.status === 402 ? "AI credits are temporarily exhausted. Please email nichole@realizedworth.com." :
          (data.error || "Something went wrong generating the deck. Please try again.");
        status.textContent = msg;
        if (btn) { btn.disabled = false; btn.textContent = "Try again"; }
        return;
      }

      const pptx = data.pptx || (data.base64 ? { base64: data.base64, filename: data.filename } : null);
      const html = data.html || null;
      const PPTX_MIME = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

      // Stage blobs so the user can click to download from a fresh user gesture.
      revokeStaged();
      try {
        if (pptx && pptx.base64) {
          stagedFiles.pptx = {
            url: URL.createObjectURL(base64ToBlob(pptx.base64, PPTX_MIME)),
            filename: pptx.filename || "RW_Business_Case.pptx",
          };
        }
        if (html && html.base64) {
          stagedFiles.html = {
            url: URL.createObjectURL(base64ToBlob(html.base64, "text/html")),
            filename: html.filename || "RW_Business_Case.html",
          };
        }
      } catch (decodeErr) {
        console.error("Failed to decode generated files", decodeErr);
        status.textContent = "Your deck generated, but we couldn't prepare the download. Please try again or email nichole@realizedworth.com.";
        if (btn) { btn.disabled = false; btn.textContent = "Try again"; }
        return;
      }

      if (!stagedFiles.pptx && !stagedFiles.html) {
        status.textContent = "The server returned an empty deck. Please try again.";
        if (btn) { btn.disabled = false; btn.textContent = "Try again"; }
        return;
      }

      // Enable per-file download buttons on the done step.
      const pptxBtn = $("download-pptx-btn");
      const htmlBtn = $("download-html-btn");
      if (pptxBtn) pptxBtn.disabled = !stagedFiles.pptx;
      if (htmlBtn) htmlBtn.disabled = !stagedFiles.html;

      status.textContent = "Your files are ready below — click each to download.";
      if (btn) { btn.disabled = false; btn.textContent = "Regenerate"; }
      hide($("step-7"));
      show($("step-done"));
      document.querySelectorAll(".stepper li").forEach((li) => li.classList.add("is-done"));

      // Attempt a single auto-download of the PPTX. Browsers allow one download per
      // user gesture; the explicit buttons are the reliable path if this is blocked.
      if (stagedFiles.pptx) {
        try { triggerDownload(stagedFiles.pptx.url, stagedFiles.pptx.filename); } catch (_) { /* user can click button */ }
      }

      // Submission succeeded — clear local draft so the next visitor starts clean.
      clearStorage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      status.textContent = "Network error. Please try again.";
      if (btn) { btn.disabled = false; btn.textContent = "Try again"; }
    }
  }

  $("download-btn").addEventListener("click", generateAndDownload);
  wireDownloadButton("download-pptx-btn", "pptx");
  wireDownloadButton("download-html-btn", "html");
  const againBtn = $("download-again-btn");
  if (againBtn) againBtn.addEventListener("click", () => { revokeStaged(); goToStep(7); });


  /** ---------------- Init ---------------- */
  function rehydrateFormFields() {
    if (state.company_name) $("company-input").value = state.company_name;
    const a = state.audience || {};
    if (a.presenter_name) $("presenter_name").value = a.presenter_name;
    if (a.presenter_email) $("presenter_email").value = a.presenter_email;
    if (a.presenter_role) $("presenter_role").value = a.presenter_role;
    if (a.audience_role) $("audience_role").value = a.audience_role;
    if (a.decision_maker) $("decision_maker").value = a.decision_maker;
    const t = state.timing || {};
    if (t.preferred_city) $("preferred_city").value = t.preferred_city;
    if (t.preferred_quarter) $("preferred_quarter").value = t.preferred_quarter;
    if (t.seats_requested) $("seats_requested").value = t.seats_requested;
    const f = state.fit || {};
    if (f.headcount_bracket) $("headcount_bracket").value = f.headcount_bracket;
    if (f.has_champions) {
      const r = document.querySelector(`input[name="has_champions"][value="${f.has_champions}"]`);
      if (r) r.checked = true;
    }
    if (f.has_formal_training) {
      const r = document.querySelector(`input[name="has_formal_training"][value="${f.has_formal_training}"]`);
      if (r) r.checked = true;
    }
    (f.challenges || []).forEach((v) => {
      const cb = document.querySelector(`input[name="challenges"][value="${cssEscape(v)}"]`);
      if (cb) { cb.checked = true; cb.parentElement.classList.add("is-checked"); }
    });
    (f.outcomes || []).forEach((v) => {
      const cb = document.querySelector(`input[name="outcomes"][value="${cssEscape(v)}"]`);
      if (cb) { cb.checked = true; cb.parentElement.classList.add("is-checked"); }
    });
    const k = state.ask || {};
    if (k.sponsor_name) $("sponsor_name").value = k.sponsor_name;
    if (k.budget_range) $("budget_range").value = k.budget_range;
    if (k.primary_ask) $("primary_ask").value = k.primary_ask;
    if (k.extra_notes) $("extra_notes").value = k.extra_notes;

    if (state.research) renderFindings();
  }

  function cssEscape(s) {
    return String(s).replace(/["\\]/g, "\\$&");
  }

  function init() {
    restore();
    buildCheckboxGrid("challenges-grid", CHALLENGES, "challenges", 5);
    buildCheckboxGrid("outcomes-grid", OUTCOMES, "outcomes", 4);
    rehydrateFormFields();
    if (state.currentStep && state.currentStep >= 1 && state.currentStep <= TOTAL_STEPS) {
      // Don't skip into research mid-load if we never had research
      const start = state.currentStep === 2 && !state.research ? 1 : state.currentStep;
      goToStep(start);
    } else {
      goToStep(1);
    }
    if (state.currentStep === 7) renderReview();

    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (!confirm("Clear this draft and start over?")) return;
        clearStorage();
        Object.assign(state, {
          currentStep: 1, company_name: "", research: null,
          audience: {}, timing: {}, fit: { challenges: [], outcomes: [] }, ask: {},
        });
        location.reload();
      });
    }
  }

  init();
})();
