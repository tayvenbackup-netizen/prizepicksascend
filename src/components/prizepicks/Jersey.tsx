/**
 * Jersey fallback used when a player photo fails to load.
 * Mimics PrizePicks' behavior of supplementing missing headshots with a
 * jersey badge featuring the team's color + abbreviation.
 */

const TEAM_COLORS: Record<string, string> = {
  // NBA
  DAL: "#0064B1", BOS: "#007A33", DEN: "#0E2240", GSW: "#1D428A", MIN: "#0C2340",
  PHX: "#1D1160", MIL: "#00471B", LAL: "#552583", PHI: "#006BB6", IND: "#002D62",
  OKC: "#007AC1", SAS: "#000000", CLE: "#860038", NYK: "#006BB6", BKN: "#000000",
  MIA: "#98002E", CHI: "#CE1141", ATL: "#E03A3E", LAC: "#C8102E", SAC: "#5A2D81",
  // NFL
  KC: "#E31837", BUF: "#00338D", SF: "#AA0000", BAL: "#241773", CIN: "#FB4F14",
  PHI_NFL: "#004C54",
  // MLB
  NYY: "#003087", LAD: "#005A9C", NYM: "#FF5910",
  // NHL
  EDM: "#FF4C00", COL: "#6F263D", TOR: "#003E7E",
  // WNBA
  LV: "#000000", NY: "#86CEBC",
  // Soccer
  MCI: "#6CABDD", RMA: "#FEBE10", ARS: "#EF0107",
};

function colorFor(team: string): string {
  if (TEAM_COLORS[team]) return TEAM_COLORS[team];
  // Deterministic hue from team string
  let h = 0;
  for (const c of team) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `hsl(${h % 360}, 55%, 38%)`;
}

export function Jersey({
  team,
  size = 32,
}: {
  team: string;
  size?: number;
}) {
  const color = colorFor(team);
  const code = team.slice(0, 3).toUpperCase();
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className="shrink-0"
      aria-hidden
    >
      {/* Jersey silhouette */}
      <path
        d="M14 14 L22 8 L26 12 Q32 16 38 12 L42 8 L50 14 L56 22 L48 28 L46 24 L46 54 Q46 58 42 58 L22 58 Q18 58 18 54 L18 24 L16 28 L8 22 Z"
        fill={color}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth={1}
      />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="12"
        fontWeight={800}
        fill="white"
        style={{ letterSpacing: 0.5 }}
      >
        {code}
      </text>
    </svg>
  );
}
