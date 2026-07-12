/**
 * cca-ai-proxy — Cloudflare Worker (Gemini version)
 *
 * Sits between your public website and Google's Gemini API.
 * The API key lives ONLY here, as a Worker secret — never in index.html,
 * never visible to anyone viewing your site's source code.
 *
 * Deployment steps are in README.md under "Setting up the AI Matcher feature".
 */

const ALLOWED_ORIGIN = "https://www.campcounselorsafrica.co.ke";
const GEMINI_MODEL = "gemini-3.1-flash-lite";

export default {
  async fetch(request, env) {
    // Handle the browser's preflight check
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    let body;
    try {
      body = await request.text();
    } catch (err) {
      return new Response("Bad request", { status: 400 });
    }

    // Forward the request to Gemini, attaching the secret key server-side
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await geminiResponse.text();

    return new Response(data, {
      status: geminiResponse.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    });
  },
};
