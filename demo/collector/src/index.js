// Mouse-tracking class demo collector. One Durable Object ("room") holds every point.
// POST /p   {s, w, pts:[[x,y,t,k], ...]}   x = px from the page column's left edge, y = page y, k = 0 move / 1 click, w = column width
// GET  /p   -> {sessions, points:[[x,y,t,k,w,s], ...]}
// POST /clear?key=<CLEAR_KEY>  -> wipes the room
import { DurableObject } from "cloudflare:workers";

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS batches (s TEXT, w INTEGER, t INTEGER, n INTEGER, pts TEXT)`);
  }
  // One row per batch (every ~2 s per person), not one row per point: keeps writes and reads
  // far inside the free plan's daily row limits even with a full classroom.
  add(s, w, pts) {
    if (!pts.length) return 0;
    this.sql.exec(`INSERT INTO batches (s, w, t, n, pts) VALUES (?, ?, ?, ?, ?)`, s, w, pts[0][2], pts.length, JSON.stringify(pts));
    return pts.length;
  }
  all() {
    const rows = this.sql.exec(`SELECT s, w, n, pts FROM batches ORDER BY t`).toArray();
    const sessions = new Set(rows.map(r => r.s)).size;
    const points = [];
    for (const r of rows) for (const p of JSON.parse(r.pts)) points.push([p[0], p[1], p[2], p[3], r.w, r.s]);
    return { sessions, batches: rows.length, count: points.length, points };
  }
  clear() { this.sql.exec(`DELETE FROM batches`); return true; }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin") || "";
    const allowed = origin === env.ALLOW_ORIGIN || origin.startsWith("http://localhost");
    const cors = { "Access-Control-Allow-Origin": allowed ? origin : env.ALLOW_ORIGIN, "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                   "Access-Control-Allow-Headers": "content-type", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const room = env.ROOM.get(env.ROOM.idFromName("class"));
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "content-type": "application/json", "cache-control": "no-store" } });
    try {
      if (url.pathname === "/p" && req.method === "POST") {
        const b = await req.json();
        if (!b || typeof b.s !== "string" || !Array.isArray(b.pts) || b.pts.length > 2000) return json({ error: "bad body" }, 400);
        const pts = b.pts.filter(p => Array.isArray(p) && p.length === 4 && p.every(n => Number.isFinite(n))).map(p => p.map(n => Math.round(n)));
        const n = await room.add(b.s.slice(0, 32), Math.round(b.w || 0), pts);
        return json({ ok: true, added: n });
      }
      if (url.pathname === "/p" && req.method === "GET") return json(await room.all());
      if (url.pathname === "/clear" && req.method === "POST") {
        if (url.searchParams.get("key") !== env.CLEAR_KEY) return json({ error: "no" }, 403);
        await room.clear(); return json({ ok: true });
      }
      return json({ ok: true, what: "htn mouse demo collector" });
    } catch (e) { return json({ error: String(e) }, 500); }
  }
};
