import type { SVGProps } from "react";

type I = SVGProps<SVGSVGElement>;
const base = "stroke-current";

export const MenuIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className={base} {...p}>
    <path d="M3 7h18M3 12h18M3 17h13" strokeLinecap="round" />
  </svg>
);

export const ChevronDown = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} className={base} {...p}>
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} className={base} {...p}>
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className={base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
  </svg>
);

export const ShareIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className={base} {...p}>
    <path d="M12 3v12M12 3l-4 4M12 3l4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FlameIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className={base} {...p}>
    <path d="M12 3s4 4 4 8a4 4 0 1 1-8 0c0-1.5.5-2.5 1.5-3.5C10 9 10.5 7 9.5 5 12 5.5 12 3 12 3Z" strokeLinejoin="round"/>
  </svg>
);

export const DollarIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className={base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9c-.8-1-2-1.5-3.2-1.4-1.6.1-2.8 1-2.8 2.3 0 1.4 1.3 2 3 2.3 1.7.4 3 1 3 2.4 0 1.4-1.3 2.3-3 2.4-1.4.1-2.7-.4-3.5-1.5M12 6v12" strokeLinecap="round"/>
  </svg>
);

export const ClipboardCheck = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className={base} {...p}>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4h6v3H9z" />
    <path d="m9 14 2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CheckCircle = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.4} className={base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const XCircle = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.4} className={base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 9 6 6M15 9l-6 6" strokeLinecap="round" />
  </svg>
);

export const UserCheck = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className={base} {...p}>
    <circle cx="10" cy="8" r="3.5" />
    <path d="M3.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" strokeLinecap="round"/>
    <path d="m17 11 1.6 1.6L22 9" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Bottom nav */
export const BoardIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className={base} {...p}>
    <rect x="6" y="4" width="13" height="16" rx="2"/>
    <rect x="3" y="7" width="13" height="13" rx="2"/>
  </svg>
);
export const EntriesIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className={base} {...p}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/>
    <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round"/>
  </svg>
);
export const FeedIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className={base} {...p}>
    <rect x="3" y="6" width="18" height="14" rx="2"/>
    <path d="M3 6V5a2 2 0 0 1 2-2h6l2 3h6a2 2 0 0 1 2 2v0" strokeLinejoin="round"/>
  </svg>
);
export const PromosIcon = (p: I) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className={base} {...p}>
    <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/>
  </svg>
);

export { PLogo } from "./PLogo";
