import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Plus,
  X,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import rawContent from "./content.json";
import type { Asset, Content, Field, Link, Project, Receipt } from "./types";
export const content = rawContent as Content;
export function Github({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.8a5.3 5.3 0 0 0-1.4-3.7 4.9 4.9 0 0 0-.1-3.7s-1.1-.3-3.7 1.4a12.8 12.8 0 0 0-6.8 0C5.6.9 4.5 1.2 4.5 1.2a4.9 4.9 0 0 0-.1 3.7A5.3 5.3 0 0 0 3 8.6c0 5.3 3.1 6.5 6.1 6.8A3.4 3.4 0 0 0 8.2 18V22" />
    </svg>
  );
}
export function Linkedin({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M7 10v7M11 17v-7m0 3c0-4 6-4 6 0v4" />
      <circle cx="7" cy="7" r=".5" />
    </svg>
  );
}
export const assetUrl = (path: string) =>
  /^(https?:|mailto:|#)/.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export function OutLink({
  href,
  children,
  className = "",
  download,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  download?: boolean;
}) {
  const external = /^https?:/.test(href);
  const newTab = !download && (external || /\.pdf(?:$|\?)/i.test(href));
  return (
    <a
      href={assetUrl(href)}
      className={className}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      download={download || undefined}
    >
      {children}
      {newTab && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
export function Missing({
  instruction,
  compact = false,
}: {
  instruction: string;
  compact?: boolean;
}) {
  if (!compact)
    return (
      <p className="missing">
        <Plus size={14} aria-hidden="true" />
        <span>{instruction}</span>
      </p>
    );
  return (
    <details className="missing-details">
      <summary>
        <Plus size={14} aria-hidden="true" />
        {instruction.split(":")[0]}
      </summary>
      <p>{instruction}</p>
    </details>
  );
}
export function ResourceLink({
  link,
  className = "",
  icon = true,
}: {
  link: Link;
  className?: string;
  icon?: boolean;
}) {
  return link.url ? (
    <OutLink href={link.url} className={`text-link ${className}`}>
      {link.label}
      {icon && <ArrowUpRight size={17} aria-hidden="true" />}
    </OutLink>
  ) : (
    <Missing instruction={link.instruction} compact />
  );
}
export function FieldValue({ field }: { field: Field }) {
  return field.value ? (
    <p>{field.value}</p>
  ) : (
    <Missing instruction={field.instruction} />
  );
}
export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div className="section-label">
      <span className="section-index">{number}</span>
      <span>{children}</span>
      <span className="section-rule" aria-hidden="true" />
    </div>
  );
}
export function MediaFrame({
  asset,
  index = "",
  className = "",
  hero = false,
}: {
  asset: Asset;
  index?: string;
  className?: string;
  hero?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`media-frame ${className} ${asset.src && !failed ? "has-image" : "empty-media"}`}
    >
      {asset.src && !failed ? (
        <img
          src={assetUrl(asset.src)}
          alt={asset.alt}
          loading={hero ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={hero ? "high" : "auto"}
          width={hero ? 916 : 1600}
          height={hero ? 1325 : 1000}
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <div className="media-top">
            <span>VISUAL RECORD / {index}</span>
            <ImageIcon size={18} aria-hidden="true" />
          </div>
          <div className="media-placeholder">
            <span className="media-number" aria-hidden="true">
              {index || "+"}
            </span>
            <span className="media-cross" aria-hidden="true">
              +
            </span>
          </div>
          <div className="media-instruction">
            <span>{failed ? "IMAGE UNAVAILABLE" : "ASSET TO ADD"}</span>
            <p>{asset.instruction}</p>
          </div>
        </>
      )}
      {hero && (
        <>
          <div className="portrait-shade" />
          <div className="portrait-id">
            <span>{content.person.initials} / 01</span>
            <span>
              THE PERSON.
              <br />
              BEHIND THE SYSTEMS.
            </span>
          </div>
        </>
      )}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  label,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const el = dialog.current;
    if (!el || !open) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    el.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (el.open) el.close();
      document.body.style.overflow = old;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className={`modal ${className}`}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div className="modal-inner">
        <div className="modal-bar">
          <span>{label}</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={`Close ${label}`}
            autoFocus
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function ProjectDetails({ project: p }: { project: Project }) {
  return (
    <article className={`case-study accent-${p.accent}`}>
      <p className="eyebrow">
        {p.category} <span>/</span> {p.year}
      </p>
      <h2>{p.name}</h2>
      <p className="case-lead">{p.summary}</p>
      <div className="tags">
        {p.technologies.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <MediaFrame
        asset={p.image}
        index={String(content.projects.indexOf(p) + 1).padStart(2, "0")}
      />
      <div className="case-grid">
        <section>
          <span className="eyebrow">01 / THE PROBLEM</span>
          <h3>Why it deserves to exist.</h3>
          <p>{p.problem}</p>
        </section>
        <section>
          <span className="eyebrow">02 / MY CONTRIBUTION</span>
          <h3>The part I built.</h3>
          <FieldValue field={p.contribution} />
        </section>
        <section>
          <span className="eyebrow">03 / THE RESULT</span>
          <h3>What the work produced.</h3>
          <FieldValue field={p.outcome} />
        </section>
        <section>
          <span className="eyebrow">04 / STATUS</span>
          <h3>Where it stands.</h3>
          <FieldValue field={p.status} />
          <p className="small muted">{p.dateNote}</p>
        </section>
      </div>
      <div className="case-links">
        <ResourceLink link={p.github} />
        <ResourceLink link={p.demo} />
        <ResourceLink link={p.video} />
      </div>
      {p.demo.note && <p className="small muted">{p.demo.note}</p>}
      {!!p.notes.length && (
        <div className="source-notes">
          <h3>Record notes</h3>
          {p.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      )}
      <OutLink className="source-link" href={p.source}>
        View the source record <ExternalLink size={14} />
      </OutLink>
    </article>
  );
}
export function ReceiptDetails({ receipt: r }: { receipt: Receipt }) {
  return (
    <article className="receipt-detail">
      <span className="eyebrow">{r.organization}</span>
      <h2>{r.title}</h2>
      <FieldValue field={r.year} />
      <p className="case-lead">{r.description}</p>
      <MediaFrame asset={r.certificate} index="PROOF" />
      <div className="case-links">
        <ResourceLink link={r.link} />
      </div>
      {r.note && <p className="record-note">{r.note}</p>}
    </article>
  );
}
