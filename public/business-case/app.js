// Make Your Business Case — Phase 1
// Calls research-company edge function, renders editable findings.
(function () {
  "use strict";

  // Read Supabase URL from a meta-injected global if present, otherwise hardcode from build.
  // The publishable URL is public; not a secret.
  const SUPABASE_URL = "https://htmhemgnmqlctvhkqecx.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bWhlbWdubXFsY3R2aGtxZWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODY5NTYsImV4cCI6MjA5MjI2Mjk1Nn0.vDNE1KgFjoiMVeMu44wbtrM9hF0-jpO2XZvdQTRUu00";
  const RESEARCH_URL = `${SUPABASE_URL}/functions/v1/research-company`;

  /** State */
  let research = null;

  /** Field grouping for display */
  const GROUPS = [
    {
      title: "Program",
      confidenceKey: "program_details",
      fields: [
        { key: "has_volunteer_program", label: "Has a volunteer program", type: "bool" },
        { key: "program_name", label: "Program name", type: "text" },
        { key: "program_age_years", label: "Program age (years)", type: "number" },
        { key: "has_champions_or_ambassadors", label: "Has champions or ambassadors", type: "bool" },
        { key: "champion_count_estimate", label: "Champion count (estimate)", type: "text" },
      ],
    },
    {
      title: "Scale",
      confidenceKey: "scale_data",
      fields: [
        { key: "employee_count_estimate", label: "Employee count (estimate)", type: "text" },
        { key: "geographic_scope", label: "Geographic scope", type: "text" },
        { key: "volunteer_participation_rate", label: "Volunteer participation rate", type: "text" },
        { key: "volunteer_hours_reported", label: "Volunteer hours reported", type: "text" },
      ],
    },
    {
      title: "CSR / ESG context",
      confidenceKey: "csr_context",
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

  /** Elements */
  const $ = (id) => document.getElementById(id);
  const els = {
    form: $("company-form"),
    input: $("company-input"),
    btn: $("research-btn"),
    stepResearch: $("step-research"),
    loading: $("research-loading"),
    results: $("research-results"),
    error: $("research-error"),
    errorText: $("research-error-text"),
    container: $("findings-container"),
    copyBtn: $("copy-findings"),
    restartBtn: $("restart"),
    retryBtn: $("error-retry"),
    skipBtn: $("error-skip"),
  };

  /** Show/hide helpers */
  const show = (el) => el.removeAttribute("hidden");
  const hide = (el) => el.setAttribute("hidden", "");

  /** Submit handler */
  els.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = els.input.value.trim();
    if (name.length < 2) return;
    await runResearch(name);
  });

  els.retryBtn.addEventListener("click", () => runResearch(els.input.value.trim()));
  els.skipBtn.addEventListener("click", () => {
    hide(els.error);
    show(els.results);
    research = blankResearch(els.input.value.trim());
    renderFindings();
  });
  els.restartBtn.addEventListener("click", () => {
    hide(els.stepResearch);
    research = null;
    els.input.focus();
    els.input.select();
  });
  els.copyBtn.addEventListener("click", copyAsText);

  async function runResearch(companyName) {
    show(els.stepResearch);
    show(els.loading);
    hide(els.results);
    hide(els.error);
    els.btn.disabled = true;
    els.stepResearch.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const resp = await fetch(RESEARCH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ company_name: companyName }),
      });
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg =
          resp.status === 429
            ? "We're getting a lot of requests right now. Please try again in a minute."
            : resp.status === 402
            ? "AI credits are temporarily exhausted. Please contact contact@realizedworth.com."
            : data.error || "Something went wrong. Please try again.";
        showError(msg);
        return;
      }

      research = data;
      hide(els.loading);
      show(els.results);
      renderFindings();
    } catch (err) {
      console.error(err);
      showError("Network error. Please check your connection and try again.");
    } finally {
      els.btn.disabled = false;
    }
  }

  function showError(msg) {
    hide(els.loading);
    hide(els.results);
    show(els.error);
    els.errorText.textContent = msg;
  }

  function blankResearch(companyName) {
    return {
      company_name: companyName,
      has_volunteer_program: null,
      program_name: null,
      program_age_years: null,
      has_champions_or_ambassadors: null,
      champion_count_estimate: null,
      employee_count_estimate: null,
      geographic_scope: null,
      volunteer_participation_rate: null,
      csr_report_url: null,
      esg_framework: null,
      stated_social_impact_goals: [],
      volunteer_hours_reported: null,
      signature_nonprofit_partners: [],
      cause_areas: [],
      values_or_mission_keywords: [],
      recent_csr_news: null,
      confidence: { program_details: "none", scale_data: "none", csr_context: "none" },
      sources: [],
      researched_at: new Date().toISOString(),
    };
  }

  /** Render findings into DOM (no innerHTML for AI strings) */
  function renderFindings() {
    els.container.replaceChildren();

    GROUPS.forEach((group) => {
      const section = document.createElement("div");
      section.className = "findings-group";

      const heading = document.createElement("h3");
      heading.textContent = `${group.title} · ${(research.confidence?.[group.confidenceKey] || "none").toUpperCase()} confidence`;
      section.appendChild(heading);

      group.fields.forEach((f) => section.appendChild(buildFindingCard(f, group.confidenceKey)));
      els.container.appendChild(section);
    });

    // Sources block
    if (Array.isArray(research.sources) && research.sources.length) {
      const src = document.createElement("div");
      src.className = "findings-group";
      const h = document.createElement("h3");
      h.textContent = "Sources";
      src.appendChild(h);
      const card = document.createElement("div");
      card.className = "finding-card";
      const ul = document.createElement("ul");
      ul.style.margin = "0";
      ul.style.paddingLeft = "1.1rem";
      research.sources.forEach((u) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = u;
        a.textContent = u;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        li.appendChild(a);
        ul.appendChild(li);
      });
      card.appendChild(ul);
      src.appendChild(card);
      els.container.appendChild(src);
    }
  }

  function buildFindingCard(field, groupConfidenceKey) {
    const card = document.createElement("div");
    card.className = "finding-card";

    const header = document.createElement("div");
    header.className = "finding-header";
    const label = document.createElement("span");
    label.className = "finding-label";
    label.textContent = field.label;
    header.appendChild(label);

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.gap = "0.6rem";
    right.style.alignItems = "center";

    const conf = (research.confidence?.[groupConfidenceKey] || "none").toLowerCase();
    const badge = document.createElement("span");
    badge.className = `confidence-badge confidence-${conf}`;
    badge.textContent = conf;
    right.appendChild(badge);

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-toggle";
    editBtn.textContent = "Edit";
    right.appendChild(editBtn);

    header.appendChild(right);
    card.appendChild(header);

    const valueEl = document.createElement("div");
    valueEl.className = "finding-value";
    renderValue(valueEl, field, research[field.key]);
    card.appendChild(valueEl);

    editBtn.addEventListener("click", () => {
      enterEditMode(card, valueEl, editBtn, field);
    });

    return card;
  }

  function renderValue(el, field, value) {
    el.replaceChildren();
    el.classList.remove("empty");

    const isEmpty =
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      el.classList.add("empty");
      el.textContent = "Not found — click Edit to add";
      return;
    }

    if (field.type === "list" && Array.isArray(value)) {
      const ul = document.createElement("ul");
      value.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = String(item);
        ul.appendChild(li);
      });
      el.appendChild(ul);
      return;
    }

    if (field.type === "bool") {
      el.textContent = value ? "Yes" : "No";
      return;
    }

    if (field.type === "url") {
      const a = document.createElement("a");
      a.href = String(value);
      a.textContent = String(value);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      el.appendChild(a);
      return;
    }

    el.textContent = String(value);
  }

  function enterEditMode(card, valueEl, editBtn, field) {
    editBtn.disabled = true;
    valueEl.replaceChildren();

    let inputEl;

    if (field.type === "bool") {
      inputEl = document.createElement("select");
      [
        ["", "—"],
        ["true", "Yes"],
        ["false", "No"],
      ].forEach(([v, t]) => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = t;
        inputEl.appendChild(opt);
      });
      const cur = research[field.key];
      inputEl.value = cur === true ? "true" : cur === false ? "false" : "";
    } else if (field.type === "list") {
      inputEl = document.createElement("textarea");
      inputEl.placeholder = "One item per line";
      inputEl.value = Array.isArray(research[field.key]) ? research[field.key].join("\n") : "";
    } else if (field.type === "number") {
      inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.inputMode = "numeric";
      inputEl.value = research[field.key] != null ? String(research[field.key]) : "";
    } else {
      inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.value = research[field.key] != null ? String(research[field.key]) : "";
    }

    valueEl.appendChild(inputEl);

    const actions = document.createElement("div");
    actions.style.marginTop = "0.5rem";
    actions.style.display = "flex";
    actions.style.gap = "0.5rem";

    const save = document.createElement("button");
    save.type = "button";
    save.className = "btn btn-primary";
    save.style.marginTop = "0";
    save.style.padding = "0.4rem 0.9rem";
    save.style.fontSize = "0.85rem";
    save.textContent = "Save";

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "btn btn-link";
    cancel.style.padding = "0.4rem 0.5rem";
    cancel.textContent = "Cancel";

    actions.appendChild(save);
    actions.appendChild(cancel);
    valueEl.appendChild(actions);

    inputEl.focus();

    save.addEventListener("click", () => {
      const raw = inputEl.value;
      let next;
      if (field.type === "bool") {
        next = raw === "true" ? true : raw === "false" ? false : null;
      } else if (field.type === "list") {
        next = raw.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 10);
      } else if (field.type === "number") {
        const n = parseFloat(raw);
        next = Number.isFinite(n) ? n : null;
      } else {
        next = raw.trim() === "" ? null : raw.trim();
      }
      research[field.key] = next;
      renderValue(valueEl, field, next);
      editBtn.disabled = false;
    });

    cancel.addEventListener("click", () => {
      renderValue(valueEl, field, research[field.key]);
      editBtn.disabled = false;
    });
  }

  /** Copy as text */
  async function copyAsText() {
    const lines = [];
    lines.push(`Company research: ${research.company_name}`);
    lines.push(`Researched: ${research.researched_at}`);
    lines.push("");

    GROUPS.forEach((group) => {
      const conf = (research.confidence?.[group.confidenceKey] || "none").toUpperCase();
      lines.push(`${group.title.toUpperCase()} (${conf} confidence)`);
      group.fields.forEach((f) => {
        const v = research[f.key];
        let str;
        if (v === null || v === undefined || v === "") str = "—";
        else if (Array.isArray(v)) str = v.length ? v.join(", ") : "—";
        else if (typeof v === "boolean") str = v ? "Yes" : "No";
        else str = String(v);
        lines.push(`  ${f.label}: ${str}`);
      });
      lines.push("");
    });

    if (Array.isArray(research.sources) && research.sources.length) {
      lines.push("SOURCES");
      research.sources.forEach((s) => lines.push(`  ${s}`));
    }

    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      els.copyBtn.textContent = "Copied ✓";
      setTimeout(() => (els.copyBtn.textContent = "Copy findings as text"), 1800);
    } catch {
      // Fallback: select textarea
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
      els.copyBtn.textContent = "Copied ✓";
      setTimeout(() => (els.copyBtn.textContent = "Copy findings as text"), 1800);
    }
  }
})();
