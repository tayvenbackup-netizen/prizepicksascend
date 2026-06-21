import { PLogo } from "./PLogo";

function TelegramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#229ED9" />
      <path
        fill="#fff"
        d="M5.5 11.7l11.9-4.6c.55-.2 1.04.13.86.97l-2.03 9.55c-.15.69-.56.86-1.13.54l-3.12-2.3-1.5 1.45c-.17.17-.31.31-.63.31l.22-3.18 5.8-5.24c.25-.22-.06-.34-.39-.13l-7.17 4.51-3.09-.96c-.67-.21-.69-.67.18-.92z"
      />
    </svg>
  );
}

export function PromosView() {
  return (
    <div className="h-full overflow-y-auto px-5 pb-28 pt-6">
      {/* Main promo */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#12131A] p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <PLogo size={88} />
          <h1 className="text-[24px] font-extrabold tracking-tight text-white">
            PrizePicks
          </h1>
        </div>
      </section>

      {/* Creator */}
      <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-wider text-white/55">
        Creator:
      </h2>

      <div className="mt-3 space-y-2.5">
        <a
          href="https://t.me/richlater"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#1D1E26] px-4 py-3.5 active:opacity-80"
        >
          <TelegramIcon size={26} />
          <span className="text-[15px] font-semibold text-white">@richlater</span>
        </a>
      </div>
    </div>
  );
}
