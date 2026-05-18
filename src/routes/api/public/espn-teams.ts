import { createFileRoute } from "@tanstack/react-router";

const ALLOWED: Record<string, string> = {
  NBA: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams?limit=50",
  NFL: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=50",
  MLB: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams?limit=50",
  NHL: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams?limit=50",
  WNBA: "https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams?limit=50",
  EPL: "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams?limit=50",
  MLS: "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/teams?limit=50",
};

export const Route = createFileRoute("/api/public/espn-teams")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const league = url.searchParams.get("league") || "";
        const target = ALLOWED[league];
        if (!target) {
          return new Response(JSON.stringify({ error: "unknown league" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
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
