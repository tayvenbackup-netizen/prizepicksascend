// Lightweight client-side hardening. Server enforcement still applies.
export function installDevtoolsShield() {
  try {
    if (import.meta.env.DEV) return;
    const host = location.hostname;
    if (host.includes('lovable.app') || host.includes('lovableproject.com') || host.includes('lovable.dev') || host === 'localhost') return;
  } catch {}

  const blank = (reason: string) => {
    try { document.documentElement.innerHTML = '<head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#fff"></body>'; } catch {}
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
    console.warn(reason);
    setTimeout(() => { try { location.replace('about:blank'); } catch {} }, 50);
  };

  window.addEventListener('keydown', e => {
    const k = e.key?.toUpperCase();
    if (k === 'F12') { e.preventDefault(); blank('f12'); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === 'I' || k === 'J' || k === 'C')) { e.preventDefault(); blank('sk'); }
    if ((e.ctrlKey || e.metaKey) && k === 'U') { e.preventDefault(); blank('vu'); }
  }, true);

  window.addEventListener('contextmenu', e => e.preventDefault(), true);
}
