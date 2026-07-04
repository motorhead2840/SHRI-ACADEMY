/**
 * Shri Academy AI Mentor Proxy Routes
 * Forwards /api/shri/* → Python FastAPI at localhost:8000/shri-api/*
 */
import { Router } from "express";
import { logger } from "../lib/logger.js";

const router = Router();
const PYTHON_BASE = "http://localhost:8000/shri-api";

async function proxyGet(path: string) {
  const res = await fetch(`${PYTHON_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(`Python backend error ${res.status}`), { status: res.status, body: text });
  }
  return res.json();
}

async function proxyPost(path: string, body: unknown) {
  const res = await fetch(`${PYTHON_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(`Python backend error ${res.status}`), { status: res.status, body: text });
  }
  return res.json();
}

// GET /api/shri/health
router.get("/health", async (_req, res) => {
  try {
    const data = await proxyGet("/health");
    res.json(data);
  } catch (err) {
    logger.warn({ err }, "Shri health check failed");
    res.status(503).json({ error: "AI mentor backend unavailable" });
  }
});

// POST /api/shri/chat
router.post("/chat", async (req, res) => {
  try {
    const data = await proxyPost("/chat", req.body);
    res.json(data);
  } catch (err: unknown) {
    logger.error({ err }, "Shri chat error");
    const e = err as { status?: number };
    res.status(e.status ?? 502).json({ error: "AI mentor unavailable" });
  }
});

// GET /api/shri/state
router.get("/state", async (req, res) => {
  try {
    const sessionId = req.query["session_id"] as string | undefined;
    const qs = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
    const data = await proxyGet(`/state${qs}`);
    res.json(data);
  } catch (err) {
    logger.error({ err }, "Shri state error");
    res.status(502).json({ error: "AI mentor unavailable" });
  }
});

// POST /api/shri/reset
router.post("/reset", async (req, res) => {
  try {
    const data = await proxyPost("/reset", req.body);
    res.json(data);
  } catch (err) {
    logger.error({ err }, "Shri reset error");
    res.status(502).json({ error: "AI mentor unavailable" });
  }
});

// POST /api/shri/research/mentor — AI research roadmap generator
router.post("/research/mentor", async (req, res) => {
  try {
    const data = await proxyPost("/research/mentor", req.body);
    res.json(data);
  } catch (err: unknown) {
    logger.error({ err }, "Research mentor error");
    const e = err as { status?: number };
    res.status(e.status ?? 502).json({ error: "Research mentor unavailable" });
  }
});

// GET /api/shri/research/search — academic course/topic search via Python
router.get("/research/search", async (req, res) => {
  try {
    const { q, discipline } = req.query as { q?: string; discipline?: string };
    const qs = new URLSearchParams();
    if (q)          qs.set("q", q);
    if (discipline) qs.set("discipline", discipline);
    const data = await proxyGet(`/research/search${qs.toString() ? `?${qs}` : ""}`);
    res.json(data);
  } catch (err) {
    logger.error({ err }, "Research search error");
    res.status(502).json({ error: "Research search unavailable" });
  }
});

export default router;
