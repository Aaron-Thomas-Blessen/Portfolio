export interface Field {
  value: string;
  instruction: string;
}
export interface Asset {
  src: string;
  alt: string;
  instruction: string;
  caption?: string;
}
export interface Link {
  label: string;
  url: string;
  instruction: string;
  note?: string;
}
export interface Project {
  id: string;
  name: string;
  category: string;
  year: string;
  summary: string;
  technologies: string[];
  problem: string;
  contribution: Field;
  outcome: Field;
  status: Field;
  github: Link;
  demo: Link;
  video: Link;
  image: Asset;
  dateNote: string;
  notes: string[];
  source: string;
  accent: string;
}
export interface Receipt {
  id: string;
  title: string;
  display: string;
  year: Field;
  organization: string;
  description: string;
  link: Link;
  certificate: Asset;
  note: string;
}
export interface Capability {
  title: string;
  short: string;
  build: string;
  tools: string[];
  problem: string;
  evidence: string;
  future: Field;
}
export interface Mission {
  label: string;
  title: Field;
  detail: Field;
}
export interface Milestone {
  date: string;
  title: string;
  category: string;
  description: string;
  note: string;
  pending: boolean;
}
export interface ArchiveItem {
  title: string;
  type: string;
  description: string;
  link: Link;
}
export interface Content {
  site: {
    origin: string;
    basePath: string;
    title: string;
    description: string;
    ogImage: string;
    verifiedOn: string;
  };
  person: {
    name: string;
    shortName: string;
    initials: string;
    roles: string[];
    location: string;
    email: string;
    emailInstruction: string;
    github: string;
    linkedin: string;
    futureSocial: Link;
  };
  hero: {
    kicker: string;
    headline: string[];
    introduction: string;
    status: string;
    portrait: Asset;
    resume: Link;
    resumeReplacement: string;
  };
  about: {
    title: string;
    lead: string[];
    paragraphs: string[];
    facts: { label: string; value: string }[];
  };
  projects: Project[];
  receipts: Receipt[];
  capabilities: Capability[];
  missions: Mission[];
  timeline: Milestone[];
  archive: ArchiveItem[];
  testimonial: Field;
  contact: { headline: string[]; copy: string; subject: string };
}
