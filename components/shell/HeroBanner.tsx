import type { ReactNode } from "react";

export function HeroBanner({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <section className="hearth-hero grid overflow-hidden rounded-[28px] border border-[var(--line)] bg-white md:grid-cols-[minmax(0,1.15fr)_minmax(200px,0.85fr)]">
      <div className="relative z-10 flex min-w-0 flex-col justify-center px-7 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          {kicker}
        </p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-[36rem] text-[14px] leading-6 text-[var(--muted)]">
          {subtitle}
        </p>
        {actions ? (
          <div className="mt-5 flex flex-wrap gap-2">{actions}</div>
        ) : null}
      </div>
      <div className="relative hidden min-h-[168px] md:block">
        <HeroArt />
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <svg
        viewBox="0 0 520 240"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c5e4fb" />
            <stop offset="42%" stopColor="#d7eec4" />
            <stop offset="100%" stopColor="#9ecf7a" />
          </linearGradient>
        </defs>
        <rect width="520" height="240" fill="url(#sky)" />
        <circle cx="400" cy="52" r="26" fill="#fff4c8" />
        <path
          d="M0 240 L70 150 L130 190 L200 80 L280 160 L340 50 L420 140 L520 70 L520 240 Z"
          fill="#8fb7d4"
          opacity="0.7"
        />
        <path
          d="M0 240 L90 155 L160 200 L230 100 L320 175 L390 95 L470 165 L520 120 L520 240 Z"
          fill="#6fa35c"
        />
        <path
          d="M0 240 L60 185 L120 215 L190 150 L270 205 L350 145 L430 190 L520 155 L520 240 Z"
          fill="#4e8344"
        />
        <ellipse cx="318" cy="158" rx="16" ry="26" fill="#1a1f24" />
        <circle cx="318" cy="126" r="10" fill="#1a1f24" />
      </svg>
    </div>
  );
}
