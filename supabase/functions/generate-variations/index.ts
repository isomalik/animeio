import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !data?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { panelDescription, dialogue, characterContext, stylePreferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert anime/manga art director. Your task is to generate 4 distinct visual variations for a manga panel.

Each variation should offer a different artistic interpretation while staying true to the scene's content.

Consider:
- Different camera angles (close-up, wide shot, bird's eye, dutch angle)
- Different lighting moods (dramatic shadows, soft diffuse, high contrast, backlit)
- Different composition styles (rule of thirds, centered, asymmetric, dynamic)
- Different artistic influences (Ghibli soft, Trigger dynamic, Mappa cinematic, Shaft abstract)

Respond with a JSON object containing an array of 4 variations, each with:
- id: unique identifier
- description: brief visual description (max 20 words)
- prompt: detailed art prompt for image generation
- style_notes: artistic style reference`;

    const userPrompt = `Panel Description: ${panelDescription}
${dialogue ? `Dialogue: "${dialogue}"` : ""}
${characterContext ? `Characters:\n${characterContext}` : ""}
Style Preferences: ${stylePreferences?.join(", ") || "anime, manga"}

Generate 4 distinct visual variations for this panel.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    let variations;
    try {
      const parsed = JSON.parse(content);
      variations = parsed.variations || parsed;
    } catch {
      // If JSON parsing fails, create fallback variations
      variations = [
        {
          id: "1",
          description: "Dynamic action pose with speed lines",
          prompt: `${panelDescription} - Dynamic action pose with motion blur and speed lines, anime style`,
          style_notes: "High energy, Trigger-style animation",
        },
        {
          id: "2",
          description: "Dramatic lighting with shadows",
          prompt: `${panelDescription} - Dramatic cinematic lighting with deep shadows, anime style`,
          style_notes: "Mappa-style realism, strong contrast",
        },
        {
          id: "3",
          description: "Soft, dreamy atmosphere",
          prompt: `${panelDescription} - Soft watercolor aesthetic with warm lighting, anime style`,
          style_notes: "Ghibli-inspired, pastoral mood",
        },
        {
          id: "4",
          description: "Abstract symbolic composition",
          prompt: `${panelDescription} - Unique angles with symbolic imagery, anime style`,
          style_notes: "Shaft-style avant-garde",
        },
      ];
    }

    return new Response(JSON.stringify({ variations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-variations error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
