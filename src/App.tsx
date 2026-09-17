import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Plus,
  Minus,
  Menu,
  Copy,
  Check,
  Download,
  Play,
  FileText,
  Code2,
} from "lucide-react";
import type { Receipt } from "./types";
import {
  content,
  OutLink,
  Missing,
  ResourceLink,
  FieldValue,
  SectionLabel,
  MediaFrame,
  Modal,
  ProjectDetails,
  ReceiptDetails,
  Github,
  Linkedin,
} from "./components";
const navItems = [
  { id: "work", label: "Work" },
  { id: "proof", label: "Proof" },
  { id: "capabilities", label: "Capabilities" },
  { id: "archive", label: "Archive" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
type Mode = "observe" | "explore" | "read";

export default function App() {
  const [mode, setMode] = useState<Mode>("observe");
  const [reduced, setReduced] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [active, setActive] = useState("hero");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [formState, setFormState] = useState<"idle" | "ready" | "error">(
    "idle",
  );
  const [draftUrl, setDraftUrl] = useState("");
  const [formError, setFormError] = useState("");
  const previousHash = useRef("#work");
  const project = content.projects.find((p) => p.id === projectId);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    try {
      const stored = localStorage.getItem("aaron-motion");
      if (stored === "observe" || stored === "explore" || stored === "read")
        setMode(stored);
    } catch {
      /* Preference is optional. */
    }
    const hash = () => {
      const id = window.location.hash.replace("#project/", "");
      setProjectId(
        window.location.hash.startsWith("#project/") &&
          content.projects.some((p) => p.id === id)
          ? id
          : null,
      );
    };
    hash();
    window.addEventListener("hashchange", hash);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("hashchange", hash);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);
  useEffect(() => {
    const effective = reduced ? "read" : mode;
    document.documentElement.dataset.mode = effective;
    if (effective === "read") {
      document.documentElement.classList.remove("motion-ready");
      return;
    }
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    document.documentElement.classList.add("motion-ready");
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, [mode, reduced]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      h.style.setProperty(
        "--page-progress",
        String(
          Math.max(
            0,
            Math.min(
              1,
              window.scrollY / (h.scrollHeight - window.innerHeight || 1),
            ),
          ),
        ),
      );
      const timeline = document.querySelector<HTMLElement>(".timeline");
      if (timeline) {
        const rect = timeline.getBoundingClientRect();
        timeline.style.setProperty(
          "--timeline-progress",
          String(
            Math.max(
              0,
              Math.min(1, (window.innerHeight * 0.72 - rect.top) / rect.height),
            ),
          ),
        );
      }
    };
    const scroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      mode !== "explore" ||
      reduced ||
      !window.matchMedia("(hover:hover)").matches
    )
      return;
    const button = document.querySelector<HTMLElement>(".magnetic");
    if (!button) return;
    const move = (event: PointerEvent) => {
      const r = button.getBoundingClientRect();
      button.style.setProperty(
        "--mag-x",
        `${(event.clientX - r.left - r.width / 2) * 0.07}px`,
      );
      button.style.setProperty(
        "--mag-y",
        `${(event.clientY - r.top - r.height / 2) * 0.13}px`,
      );
    };
    const reset = () => {
      button.style.removeProperty("--mag-x");
      button.style.removeProperty("--mag-y");
    };
    button.addEventListener("pointermove", move);
    button.addEventListener("pointerleave", reset);
    return () => {
      button.removeEventListener("pointermove", move);
      button.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [mode, reduced]);
  const chooseMode = (value: Mode) => {
    setMode(value);
    try {
      localStorage.setItem("aaron-motion", value);
    } catch {
      /* Non-essential preference. */
    }
  };
  const openProject = (id: string) => {
    previousHash.current = window.location.hash.startsWith("#project/")
      ? "#work"
      : window.location.hash || "#work";
    window.history.pushState(null, "", `#project/${id}`);
    setProjectId(id);
  };
  const closeProject = () => {
    setProjectId(null);
    window.history.replaceState(null, "", previousHash.current);
  };
  const copyEmail = async () => {
    let copied = false;
    if (content.person.email) {
      try {
        await navigator.clipboard.writeText(content.person.email);
        copied = true;
      } catch {
        const field = document.createElement("textarea");
        const focused = document.activeElement as HTMLElement | null;
        field.value = content.person.email;
        field.setAttribute("readonly", "");
        field.style.cssText = "position:fixed;left:-10000px;top:0";
        document.body.appendChild(field);
        field.select();
        try {
          copied = document.execCommand("copy");
        } catch {
          /* The visible email remains selectable. */
        }
        field.remove();
        focused?.focus({ preventScroll: true });
      }
    }
    setCopyState(copied ? "success" : "error");
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("idle"), 7000);
  };
  const compose = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      setFormState("error");
      setFormError(
        "Add your name, a valid email address, and a message with some detail.",
      );
      return;
    }
    if (!content.person.email) {
      setFormState("error");
      setFormError(
        "The contact email has not been added yet. Please use LinkedIn.",
      );
      return;
    }
    const body = `Hi Aaron,\n\n${message}\n\n${name}\n${email}`;
    const mailto = `mailto:${content.person.email}?subject=${encodeURIComponent(content.contact.subject)}&body=${encodeURIComponent(body)}`;
    setDraftUrl(mailto);
    setFormState("ready");
    setFormError("");
    window.location.href = mailto;
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="reading-progress" aria-hidden="true" />
      <header className="site-header">
        <a href="#hero" className="wordmark" aria-label="Aaron Blessen, home">
          <span className="monogram" aria-hidden="true">
            a<span>.</span>
          </span>
          <span>
            AARON
            <br />
            <strong>BLESSEN</strong>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((n) => (
            <a
              href={`#${n.id}`}
              key={n.id}
              aria-current={active === n.id ? "location" : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="header-cta">
          Let's build <ArrowUpRight size={17} />
        </a>
        <button
          className="mobile-menu-button icon-button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={25} />
        </button>
      </header>
      <main id="main">
        <section
          id="hero"
          className="hero shell"
          onPointerMove={(e) => {
            if (mode !== "explore" || reduced || e.pointerType === "touch")
              return;
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty(
              "--pointer-x",
              `${e.clientX - rect.left}px`,
            );
            e.currentTarget.style.setProperty(
              "--pointer-y",
              `${e.clientY - rect.top}px`,
            );
          }}
        >
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-meta">
            <span className="eyebrow">{content.hero.kicker}</span>
            <span className="eyebrow hero-coordinate">
              {active === "hero"
                ? "PERSONAL INDEX / 001"
                : `IN VIEW / ${active.toUpperCase()}`}
            </span>
          </div>
          <div className="hero-composition">
            <div className="hero-copy">
              <div className="full-name">
                {content.person.name.toUpperCase()}
              </div>
              <h1>
                {content.hero.headline.map((line, i) => (
                  <span key={line} className={i === 1 ? "hero-last-line" : ""}>
                    {i === 1 && line.endsWith(".") ? (
                      <>
                        {line.slice(0, -1)}
                        <em>.</em>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </h1>
              <p className="hero-intro">{content.hero.introduction}</p>
              <div className="hero-actions">
                <a href="#work" className="button button-primary magnetic">
                  Enter the Work <ArrowDown size={18} />
                </a>
                <ResourceLink link={content.hero.resume} />
              </div>
              <div className="resume-note">{content.hero.resume.note}</div>
              <p className="hero-status">
                <span className="status-mark" aria-hidden="true" />
                {content.hero.status}
              </p>
            </div>
            <div className="portrait-wrap">
              <span className="portrait-topline">
                ORIGIN: {content.person.location.toUpperCase()}
              </span>
              <MediaFrame asset={content.hero.portrait} hero />
              <details className="portrait-edit">
                <summary>
                  <Plus size={13} />
                  PORTRAIT / REPLACEMENT NOTES
                </summary>
                <p>{content.hero.portrait.caption}</p>
                <p>{content.hero.portrait.instruction}</p>
              </details>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#manifesto" className="scroll-cue">
              <span className="scroll-track" aria-hidden="true" />
              <span>SCROLL TO GO DEEPER</span>
            </a>
            <div
              className="mode-switch"
              role="group"
              aria-label="Motion intensity"
            >
              {(["observe", "explore", "read"] as Mode[]).map((m) => (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  title={
                    {
                      observe: "Subtle reveals",
                      explore: "Interactive light and motion",
                      read: "Motion-free reading",
                    }[m]
                  }
                  onClick={() => chooseMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>
            <span className="motion-note">
              {reduced
                ? "SYSTEM REDUCED MOTION"
                : mode === "read"
                  ? "MOTION OFF"
                  : mode === "explore"
                    ? "MOVE TO EXPLORE"
                    : "QUIET BY DESIGN"}
            </span>
          </div>
        </section>
        <section id="manifesto" className="manifesto shell" data-reveal>
          <span className="eyebrow">A QUESTION BEFORE THE ANSWER</span>
          <h2>
            Before you ask what I can build,
            <br />
            <span>ask what deserves to exist.</span>
          </h2>
          <div className="manifesto-bottom">
            <span className="manifesto-plus" aria-hidden="true">
              +
            </span>
            <p>
              Useful is a starting point.
              <br />
              Worth remembering is the ambition.
            </p>
            <a
              href="#work"
              className="round-link"
              aria-label="Explore the work"
            >
              <ArrowDown size={26} />
            </a>
          </div>
        </section>
        <section id="work" className="work section shell">
          <SectionLabel number="01">THE WORK</SectionLabel>
          <div className="section-heading" data-reveal>
            <h2>
              BUILT, NOT JUST
              <br />
              <span>IMAGINED.</span>
            </h2>
            <p>
              Ideas are easy to collect.
              <br />
              These made it into code.
            </p>
          </div>
          <div className="project-archive">
            {content.projects.map((p, i) => (
              <article
                key={p.id}
                className={`project-panel accent-${p.accent} ${i < 2 ? "featured-project" : ""}`}
                data-reveal
              >
                <div className="project-body">
                  <div className="project-meta">
                    <span>
                      {String(i + 1).padStart(2, "0")} / {p.category}
                    </span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="project-title-heading">
                    <button
                      className="project-title-button"
                      onClick={() => openProject(p.id)}
                      aria-label={`Read the ${p.name} case study`}
                    >
                      <span>{p.name}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </button>
                  </h3>
                  <p className="project-summary">{p.summary}</p>
                  <div className="tags">
                    {p.technologies.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="project-facts">
                    <div>
                      <span>THE PROBLEM</span>
                      <p>{p.problem}</p>
                    </div>
                    <div>
                      <span>MY CONTRIBUTION</span>
                      {p.contribution.value ? (
                        <p>{p.contribution.value}</p>
                      ) : (
                        <Missing
                          instruction={p.contribution.instruction}
                          compact
                        />
                      )}
                    </div>
                  </div>
                  <details className="project-status">
                    <summary>
                      CURRENT STATUS{" "}
                      {p.status.value ? (
                        <span>{p.status.value}</span>
                      ) : (
                        <span>
                          ADD UPDATE <Plus size={12} />
                        </span>
                      )}
                    </summary>
                    <FieldValue field={p.status} />
                  </details>
                  <div className="project-actions">
                    <button
                      className="case-button"
                      onClick={() => openProject(p.id)}
                    >
                      Read the Case Study <ArrowUpRight size={17} />
                    </button>
                    <ResourceLink link={p.github} />
                    <ResourceLink link={p.demo} />
                  </div>
                </div>
                <MediaFrame
                  asset={p.image}
                  index={String(i + 1).padStart(2, "0")}
                />
              </article>
            ))}
          </div>
          <div className="archive-footer">
            <span>Public repositories. Real work. Room to go further.</span>
            <OutLink href={content.person.github} className="text-link">
              The full GitHub archive <Github size={18} />
            </OutLink>
          </div>
        </section>
        <section id="proof" className="proof section shell">
          <SectionLabel number="02">EVIDENCE, NOT ADJECTIVES</SectionLabel>
          <div className="section-heading" data-reveal>
            <h2>
              THE <span>RECEIPTS.</span>
            </h2>
            <p>
              The work leaves a record.
              <br />
              Here is mine.
            </p>
          </div>
          <div className="receipt-grid">
            {content.receipts.map((r, i) => (
              <article
                className={`receipt-card receipt-${i}`}
                key={r.id}
                data-reveal
              >
                <div className="receipt-meta">
                  <span>{String(i + 1).padStart(2, "0")} / ON RECORD</span>
                  <span>{r.year.value || "ADD YEAR"}</span>
                </div>
                <div className="receipt-display">{r.display}</div>
                <div className="receipt-copy">
                  <span className="receipt-org">{r.organization}</span>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                </div>
                {!r.year.value && (
                  <Missing instruction={r.year.instruction} compact />
                )}
                {r.note && (
                  <details className="record-details">
                    <summary>
                      RECORD NOTE <Plus size={13} />
                    </summary>
                    <p>{r.note}</p>
                  </details>
                )}
                <div className="receipt-actions">
                  <ResourceLink link={r.link} />
                  <button
                    className="icon-button"
                    aria-label={`View ${r.title} evidence and asset instructions`}
                    onClick={() => setReceipt(r)}
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
                {!r.certificate.src && (
                  <Missing instruction={r.certificate.instruction} compact />
                )}
              </article>
            ))}
          </div>
        </section>
        <section id="about" className="about section shell">
          <SectionLabel number="03">{content.about.title}</SectionLabel>
          <div className="about-grid">
            <div className="about-statement" data-reveal>
              <h2 className="editable-heading">
                {content.about.lead.map((line, i) => (
                  <span key={line} className={i > 1 ? "muted-line" : ""}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="about-signature">AARON THOMAS BLESSEN</p>
            </div>
            <div className="about-copy" data-reveal>
              <div className="positioning-roles">
                {content.person.roles.map((r) => (
                  <span key={r}>{r}</span>
                ))}
              </div>
              {content.about.paragraphs.map((p, i) => (
                <p key={p} className={i === 0 ? "about-lead" : ""}>
                  {p}
                </p>
              ))}
              <dl className="about-facts">
                {content.about.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="about-social">
                <OutLink href={content.person.github} className="text-link">
                  <Github size={18} />
                  GitHub <ArrowUpRight size={16} />
                </OutLink>
                <OutLink href={content.person.linkedin} className="text-link">
                  <Linkedin size={18} />
                  LinkedIn <ArrowUpRight size={16} />
                </OutLink>
              </div>
            </div>
          </div>
        </section>
        <section id="capabilities" className="capabilities section shell">
          <SectionLabel number="04">CAPABILITIES</SectionLabel>
          <div className="section-heading" data-reveal>
            <h2>
              WHAT I<br />
              <span>ACTUALLY DO.</span>
            </h2>
            <p>
              Different disciplines.
              <br />
              One instinct: make it work.
            </p>
          </div>
          <div className="capability-list">
            {content.capabilities.map((c, i) => (
              <details
                className="capability"
                key={c.title}
                open={i === 0 ? true : undefined}
                data-reveal
              >
                <summary>
                  <span className="cap-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.short}</p>
                  </div>
                  <span className="cap-toggle">
                    <Plus className="plus" size={24} />
                    <Minus className="minus" size={24} />
                  </span>
                </summary>
                <div className="capability-content">
                  <div>
                    <span className="eyebrow">WHAT I BUILD</span>
                    <p>{c.build}</p>
                    <span className="eyebrow">THE PROBLEMS</span>
                    <p>{c.problem}</p>
                  </div>
                  <div>
                    <div className="tags">
                      {c.tools.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <p className="cap-evidence">
                      <span>GROUNDED IN</span>
                      {c.evidence}
                    </p>
                    <FieldValue field={c.future} />
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section id="mission" className="mission section">
          <div className="shell">
            <SectionLabel number="05">THE NEXT VERSION</SectionLabel>
            <div className="section-heading" data-reveal>
              <h2>
                CURRENTLY
                <br />
                IN <span>PROGRESS.</span>
              </h2>
              <div>
                <span className="live-label">AN OPEN CHAPTER</span>
                <p>
                  Keep this part honest.
                  <br />
                  Keep this part moving.
                </p>
              </div>
            </div>
            {content.missions.some((m) => !m.title.value) && (
              <p className="mission-intro">
                Current priorities are waiting for Aaron's update. Add the
                specific work happening now.
              </p>
            )}
            <div className="mission-track" aria-hidden="true">
              <span />
            </div>
            <div className="mission-grid">
              {content.missions.map((m) => (
                <article className="mission-card" key={m.label} data-reveal>
                  <span className="eyebrow">{m.label}</span>
                  <h3 className={!m.title.value ? "pending-title" : ""}>
                    {m.title.value || m.title.instruction}
                  </h3>
                  <FieldValue field={m.detail} />
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="trajectory" className="trajectory section shell">
          <SectionLabel number="06">THE LONG VIEW</SectionLabel>
          <div className="trajectory-grid">
            <div className="trajectory-heading" data-reveal>
              <h2>
                THE
                <br />
                <span>TRAJECTORY.</span>
              </h2>
              <p>
                Not a straight line.
                <br />A direction.
              </p>
              <span className="timeline-legend">
                DATED RECORDS + CHAPTERS TO FILL
              </span>
            </div>
            <ol className="timeline" role="list">
              {content.timeline.map((t) => (
                <li
                  className={t.pending ? "pending" : ""}
                  key={t.title}
                  data-reveal
                >
                  <div className="timeline-dot" aria-hidden="true" />
                  <span className="eyebrow timeline-date">{t.date}</span>
                  <span className="timeline-category">{t.category}</span>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                  <details className="record-details">
                    <summary>
                      DATE / CONTEXT <Plus size={12} />
                    </summary>
                    <p>{t.note}</p>
                  </details>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section id="archive" className="archive section shell">
          <SectionLabel number="07">THE OPEN RECORD</SectionLabel>
          <div className="section-heading" data-reveal>
            <h2>
              THE <span>ARCHIVE.</span>
            </h2>
            <p>
              A place for the process,
              <br />
              the proof, and what comes next.
            </p>
          </div>
          <div className="media-archive">
            {content.archive.map((a, i) => (
              <article className="archive-item" key={a.type} data-reveal>
                <div className="archive-icon" aria-hidden="true">
                  {i === 0 || i === 1 ? (
                    <Play size={20} />
                  ) : i === 8 ? (
                    <Download size={20} />
                  ) : i === 7 ? (
                    <Code2 size={20} />
                  ) : (
                    <FileText size={20} />
                  )}
                </div>
                <span className="eyebrow">{a.type}</span>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <ResourceLink link={a.link} />
              </article>
            ))}
          </div>
          <div className="testimonial-slot" data-reveal>
            <span className="eyebrow">IN THEIR WORDS / TESTIMONIAL</span>
            <FieldValue field={content.testimonial} />
          </div>
        </section>
        <section id="contact" className="contact section shell">
          <SectionLabel number="08">THE NEXT CONVERSATION</SectionLabel>
          <div className="contact-heading" data-reveal>
            <h2 className="editable-heading">
              {content.contact.headline.map((line, i) => (
                <span
                  key={line}
                  className={
                    i === content.contact.headline.length - 1
                      ? "accent-line"
                      : ""
                  }
                >
                  {line}
                </span>
              ))}
            </h2>
            <ArrowUpRight
              className="contact-arrow"
              size={130}
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
          <div className="contact-grid">
            <div className="contact-main">
              <p className="contact-intro">{content.contact.copy}</p>
              {content.person.email ? (
                <>
                  <a
                    className="contact-email"
                    href={`mailto:${content.person.email}`}
                  >
                    {content.person.email}
                    <ArrowUpRight size={24} />
                  </a>
                  <div className="copy-row">
                    <button className="text-link" onClick={copyEmail}>
                      {copyState === "success" ? (
                        <Check size={15} />
                      ) : (
                        <Copy size={15} />
                      )}{" "}
                      {copyState === "success" ? "Email copied" : "Copy email"}
                    </button>
                    <span className="copy-status" role="status">
                      {copyState === "error"
                        ? "Clipboard unavailable. Select and copy the email address above."
                        : copyState === "success"
                          ? "Copied to clipboard."
                          : ""}
                    </span>
                  </div>
                </>
              ) : (
                <Missing instruction={content.person.emailInstruction} />
              )}
              <div className="contact-socials">
                <OutLink
                  href={content.person.linkedin}
                  className="social-button"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={17} />
                </OutLink>
                <OutLink href={content.person.github} className="social-button">
                  <Github size={20} />
                  <span>GitHub</span>
                  <ArrowUpRight size={17} />
                </OutLink>
                {content.hero.resume.url ? (
                  <OutLink
                    href={content.hero.resume.url}
                    className="social-button"
                    download
                  >
                    <Download size={20} />
                    <span>Résumé</span>
                    <ArrowDown size={17} />
                  </OutLink>
                ) : (
                  <Missing
                    instruction={content.hero.resume.instruction}
                    compact
                  />
                )}
              </div>
              <details className="record-details resume-details">
                <summary>
                  {content.hero.resume.note || "RÉSUMÉ NOTES"}{" "}
                  <Plus size={13} />
                </summary>
                <p>{content.hero.resumeReplacement}</p>
              </details>
              <ResourceLink link={content.person.futureSocial} />
            </div>
            <form className="contact-form" onSubmit={compose} noValidate>
              <span className="eyebrow">START WITH AN IDEA</span>
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                maxLength={100}
                placeholder="What should I call you?"
                required
                aria-invalid={formState === "error" || undefined}
              />
              <label htmlFor="contact-email">Your email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={160}
                placeholder="you@your-domain.com"
                required
                aria-invalid={formState === "error" || undefined}
              />
              <label htmlFor="contact-message">What are you building?</label>
              <textarea
                id="contact-message"
                name="message"
                rows={3}
                maxLength={1200}
                placeholder="The idea, the hard part, and where I might fit in."
                required
                aria-invalid={formState === "error" || undefined}
                aria-describedby="form-explainer form-feedback"
              />
              <button className="button button-primary" type="submit">
                Open email draft <ArrowUpRight size={19} />
              </button>
              <p id="form-explainer" className="form-note">
                Opens your email app with a draft. Nothing is sent automatically
                or stored on this website.
              </p>
              <div id="form-feedback" aria-live="polite">
                {formState === "ready" && (
                  <p className="form-success">
                    <Check size={16} />
                    <span>
                      Your draft is ready. Send it from your email app. If
                      nothing opened,{" "}
                      <a href={draftUrl}>open the draft again</a> or use the
                      email address shown here.
                    </span>
                  </p>
                )}
                {formState === "error" && (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer shell">
        <a className="footer-wordmark" href="#hero">
          AARON BLESSEN<span>.</span>
        </a>
        <div className="footer-bottom">
          <span>SOFTWARE. INTELLIGENCE. INTENT.</span>
          <span>
            © {content.site.verifiedOn.slice(0, 4)} {content.person.name}
          </span>
          <a href="#hero">
            Back to the beginning <ArrowUpRight size={15} />
          </a>
        </div>
      </footer>
      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        label="Navigation"
        className="mobile-menu"
      >
        <nav aria-label="Mobile navigation">
          {navItems.map((n, i) => (
            <a href={`#${n.id}`} key={n.id} onClick={() => setMenuOpen(false)}>
              <span>0{i + 1}</span>
              {n.label}
              <ArrowUpRight size={28} />
            </a>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          {content.person.name}
          <br />
          {content.hero.status}
        </div>
      </Modal>
      <Modal
        open={!!project}
        onClose={closeProject}
        label="Project case study"
        className="project-modal"
      >
        {project && <ProjectDetails project={project} />}
      </Modal>
      <Modal
        open={!!receipt}
        onClose={() => setReceipt(null)}
        label="Evidence record"
        className="proof-modal"
      >
        {receipt && <ReceiptDetails receipt={receipt} />}
      </Modal>
      <div className="sr-only" role="status">
        {reduced
          ? "Reduced motion is enabled by your device."
          : `${mode} mode selected.`}
      </div>
    </>
  );
}
