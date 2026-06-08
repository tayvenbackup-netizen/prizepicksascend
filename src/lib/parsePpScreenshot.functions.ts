import { createServerFn } from "@tanstack/react-start";

export type ParsedPick = {
  player: string;
  team?: string;
  sport?: string;
  stat: string;
  line: number;
  pick: "over" | "under" | "more" | "less";
  badge?: "demon" | "goblin" | null;
};

export type ParsedSlip = {
  picks: ParsedPick[];
  parlayType?: "power" | "flex" | null;
  entryAmount?: number | null;
};

const SYSTEM = `You analyze PrizePicks lineup/slip screenshots. Extract every player projection card visible.

For each pick return:
- player: full name as printed
- team: team abbreviation if shown (e.g. "NYK", "LAL"). null if unsure.
- sport: one of NBA, NFL, MLB, NHL, WNBA, NCAAM, NCAAF, EPL, MLS, UCL, ATP, WTA, UFC, PGA. null if unsure.
- stat: stat label exactly as printed (e.g. "Points", "Pts+Reb+Ast", "Passing Yards")
- line: the numeric projection line (e.g. 22.5)
- pick: "more"/"over" if user selected MORE/HIGHER, "less"/"under" if LESS/LOWER
- badge: "demon" if the card has the red Demon icon/border (harder, payout multiplier > 1), "goblin" if it has the green Goblin icon/border (easier, payout multiplier < 1), null otherwise.

Also detect parlayType ("power" or "flex") and entryAmount (number) if shown on the slip. Return ONLY valid JSON matching the schema.`;

export const parsePpScreenshot = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const o = input as { imageDataUrl?: string };
    if (!o?.imageDataUrl || typeof o.imageDataUrl !== "string") {
      throw new Error("imageDataUrl required");
    }
    if (o.imageDataUrl.length > 8_000_000) throw new Error("Image too large");
    return { imageDataUrl: o.imageDataUrl };
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract every pick from this PrizePicks screenshot. Return JSON only." },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "parsed_slip",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              parlayType: { type: ["string", "null"], enum: ["power", "flex", null] },
              entryAmount: { type: ["number", "null"] },
              picks: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    player: { type: "string" },
                    team: { type: ["string", "null"] },
                    sport: { type: ["string", "null"] },
                    stat: { type: "string" },
                    line: { type: "number" },
                    pick: { type: "string", enum: ["more", "less", "over", "under"] },
                    badge: { type: ["string", "null"], enum: ["demon", "goblin", null] },
                  },
                  required: ["player", "team", "sport", "stat", "line", "pick", "badge"],
                },
              },
            },
            required: ["parlayType", "entryAmount", "picks"],
          },
        },
      },
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) throw new Error("Rate limited. Try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw new Error(`AI gateway error ${res.status}: ${txt.slice(0, 200)}`);
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI");
    let parsed: ParsedSlip;
    try {
      parsed = typeof content === "string" ? JSON.parse(content) : content;
    } catch {
      throw new Error("Could not parse AI response as JSON");
    }
    return parsed;
  });
