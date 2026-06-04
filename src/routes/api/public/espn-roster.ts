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
};

export const Route = createFileRoute("/api/public/espn-roster")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const league = (url.searchParams.get("league") || "").toUpperCase();
        const team = url.searchParams.get("team") || "";
        const path = LEAGUE_PATH[league];
        if (!path || !team) {
          return new Response(JSON.stringify({ error: "missing league or team" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const target = `https://site.api.espn.com/apis/site/v2/sports/${path}/teams/${encodeURIComponent(team)}/roster`;
        try {
          const r = await fetch(target);
          const body = await r.text();
          return new Response(body, {
            status: r.status,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=600",
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
