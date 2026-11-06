import "server-only";

export const COOKIE_OAUTH = "forst_calendar_oauth";
export const SCOPES_CITAS = ["https://www.googleapis.com/auth/calendar.freebusy", "https://www.googleapis.com/auth/calendar.events.owned"];

export function configOAuth() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const setupSecret = process.env.GOOGLE_SETUP_SECRET;
  const url = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !setupSecret || setupSecret.length < 32 || !url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.pathname !== "/api/google/callback" || parsed.search || parsed.hash || parsed.username || parsed.password) return null;
    if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && parsed.hostname === "localhost")) return null;
    return { clientId, clientSecret, setupSecret, redirectUri: url, origin: parsed.origin };
  } catch { return null; }
}
