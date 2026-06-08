import { createFileRoute } from "@tanstack/react-router";

const LEAGUE_PATH: Record<string, string> = {
  NBA: "basketball/nba",
  NFL: "football/nfl",
  MLB: "baseball/mlb",
  NHL: "hockey/nhl",
  WNBA: "basketball/wnba",
  NCAAM: "basketball/mens-college-basketball",
  NCAAW: "basketball/womens-college-basketball",
  NCAAF: "football/college-football",
  EPL: "soccer/eng.1",
  MLS: "soccer/usa.1",
  UCL: "soccer/uefa.champions",
  ATP: "tennis/atp",
  WTA: "tennis/wta",
  UFC: "mma/ufc",
  PGA: "golf/pga",
};

function ymd(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export const Route = createFileRoute("/api/public/espn-scoreboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const league = (url.searchParams.get("league") || "").toUpperCase();
        const dateParam = url.searchParams.get("date"); // YYYY-MM-DD or YYYYMMDD
        const days = Math.min(
          30,
          Math.max(1, Number(url.searchParams.get("days") || "10")),
        );
        const path = LEAGUE_PATH[league];
        if (!path) {
          return new Response(JSON.stringify({ error: "unknown league" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const fromParam = url.searchParams.get("from");
        const toParam = url.searchParams.get("to");
        let dates: string;
        if (dateParam) {
          dates = dateParam.replace(/-/g, "");
        } else if (fromParam && toParam) {
          dates = `${fromParam.replace(/-/g, "")}-${toParam.replace(/-/g, "")}`;
        } else {
          const start = new Date();
          const end = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
          dates = `${ymd(start)}-${ymd(end)}`;
        }
        const target = `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${dates}&limit=200`;
        try {
          const r = await fetch(target);
          const body = await r.text();
          return new Response(body, {
            status: r.status,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=300",
            },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: String(e) }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
