/**
 * Abhaya Gate — V3.0 Thermodynamic Phase-Cancellation Safety Middleware
 * Visual language: warm cream / amber manuscript — matches site brand.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL ?? "";

interface AbhayaResult {
  passed: boolean;
  stability: number;
  xi_flux: number;
  sigma_sat: number;
  chi_v3: number;
  circuit_a: number;
  circuit_b: number;
  circuit_b_active: boolean;
  phase_cancelled: boolean;
  damping_ratio: number;
  gradient_variance: number;
  free_energy: number;
  cycles: number;
  timestamp: string;
}

interface SimCycle {
  cycle: number;
  stability: number;
  xi_flux: number;
  chi_v3: number;
  circuit_a: number;
  circuit_b: number;
  circuit_b_active: boolean;
  free_energy: number;
  phase_cancelled: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricBar({ value, max = 1, label, note }: {
  value: number; max?: number; label: string; note?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct > 75 ? "#10B981" : pct > 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-500">{label}</span>
        <span className="font-mono text-sm font-bold" style={{ color }}>{value.toFixed(4)}</span>
      </div>
      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {note && <p className="text-xs text-stone-400 font-mono">{note}</p>}
    </div>
  );
}

function StabilityArc({ xi }: { xi: number }) {
  const pct = Math.max(0, 1 - xi);
  const color = pct >= 0.72 ? "#10B981" : pct >= 0.45 ? "#F59E0B" : "#EF4444";
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ * 0.75; // 270° arc

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="110" viewBox="0 0 140 110">
        {/* Track */}
        <circle cx="70" cy="80" r={r} fill="none" stroke="#E8E0D0" strokeWidth="8"
          strokeDasharray={`${circ * 0.75} ${circ}`} strokeDashoffset={circ * 0.375}
          strokeLinecap="round" transform="rotate(135 70 80)" />
        {/* Value arc */}
        <motion.circle cx="70" cy="80" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.375}
          strokeLinecap="round" transform="rotate(135 70 80)"
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 0.6, ease: "easeOut" }} />
        <text x="70" y="72" textAnchor="middle" className="font-mono" fontSize="22"
          fontWeight="800" fill={color}>{pct.toFixed(2)}</text>
        <text x="70" y="90" textAnchor="middle" fontSize="9" fill="#78716C" letterSpacing="2">STABILITY Ξ</text>
      </svg>
      <span className={`font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
        pct >= 0.72
          ? "text-emerald-700 border-emerald-300 bg-emerald-50"
          : pct >= 0.45
          ? "text-amber-700 border-amber-300 bg-amber-50"
          : "text-red-700 border-red-300 bg-red-50"
      }`}>
        {pct >= 0.72 ? "Resonant · Stable" : pct >= 0.45 ? "Damping Active" : "Override Engaged"}
      </span>
    </div>
  );
}

function CircuitPanel({ label, circuit, value, active }: {
  label: string; circuit: "A" | "B"; value: number; active: boolean;
}) {
  return (
    <div className={`border p-5 transition-all duration-500 ${
      circuit === "A"
        ? active ? "border-primary/60 bg-primary/5" : "border-primary/20 bg-card"
        : active ? "border-accent/60 bg-accent/5 shadow-[0_0_20px_rgba(16,185,129,0.08)]" : "border-stone-200 bg-card"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full transition-all ${
          active ? circuit === "A" ? "bg-primary animate-pulse" : "bg-accent animate-pulse" : "bg-stone-300"
        }`} />
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
          Circuit {circuit} · {label}
        </span>
      </div>
      <p className={`font-mono text-2xl font-extrabold ${
        active ? circuit === "A" ? "text-primary" : "text-accent" : "text-stone-400"
      }`}>
        {value.toFixed(4)}
      </p>
      <p className="font-sans text-xs text-stone-400 mt-1">
        {circuit === "A" ? "λ₀·e^(-κ(1-Ξ))" : "Λmax·σ(α·σsat²+θcrit)/Var(∇)"}
      </p>
    </div>
  );
}

function SimChart({ data }: { data: SimCycle[] }) {
  if (!data.length) return null;
  const maxChi = Math.max(...data.map(d => d.chi_v3), 0.001);

  return (
    <div className="space-y-4">
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
          χv3 Damping Force · per cycle
        </p>
        <div className="flex items-end gap-px h-24 bg-muted/40 border border-border px-2 py-2 overflow-hidden">
          {data.map((d, i) => (
            <motion.div key={i} className="flex-1 min-w-px rounded-t-sm"
              style={{ background: d.circuit_b_active ? "#10B981" : "#F59E0B", opacity: 0.75 }}
              initial={{ height: 0 }} animate={{ height: `${(d.chi_v3 / maxChi) * 100}%` }}
              transition={{ delay: i * 0.008 }} />
          ))}
        </div>
      </div>
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
          Stability Ξ · convergence curve
        </p>
        <div className="relative h-16 bg-muted/40 border border-border px-2 py-2 overflow-hidden">
          <svg viewBox={`0 0 ${data.length} 1`} preserveAspectRatio="none" className="w-full h-full">
            <polyline
              points={data.map((d, i) => `${i},${1 - d.stability}`).join(" ")}
              fill="none" stroke="#10B981" strokeWidth="0.06" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1={1 - 0.72} x2={data.length} y2={1 - 0.72}
              stroke="#F59E0B" strokeWidth="0.03" strokeDasharray="0.4 0.4" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <p className="text-xs font-mono text-stone-400 mt-1">
          <span className="inline-block w-4 h-px bg-amber-400 mr-1 align-middle" /> threshold Ξ=0.72
        </p>
      </div>
      <div className="flex gap-4 text-xs font-mono text-stone-500">
        <span><span className="inline-block w-3 h-2 bg-amber-400 rounded-sm mr-1" />Circuit A</span>
        <span><span className="inline-block w-3 h-2 bg-emerald-500 rounded-sm mr-1" />Circuit B Override</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Abhaya() {
  const [tab, setTab] = useState<"text" | "signal" | "simulate">("text");
  const [textInput, setTextInput] = useState("");
  const [signalInput, setSignalInput] = useState("0.8, 0.2, 0.95, 0.1, 0.7, 0.3, 0.85, 0.15");
  const [simCycles, setSimCycles] = useState(32);
  const [simNoise, setSimNoise] = useState(0.8);
  const [result, setResult] = useState<AbhayaResult | null>(null);
  const [simData, setSimData] = useState<SimCycle[]>([]);
  const [simSummary, setSimSummary] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    setLoading(true); setError("");
    try {
      if (tab === "text") {
        const r = await fetch(`${API}/abhaya/analyze/text`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput || "The SRI manifold approaches zero entropy through contemplative resonance.", threshold: 0.72 }),
        });
        const d = await r.json(); setResult(d.result); setSimData([]);
      } else if (tab === "signal") {
        const signal = signalInput.split(",").map(s => parseFloat(s.trim())).filter(isFinite);
        const r = await fetch(`${API}/abhaya/stabilize`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signal, threshold: 0.72 }),
        });
        const d = await r.json(); setResult(d.result); setSimData([]);
      } else {
        const r = await fetch(`${API}/abhaya/simulate`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cycles: simCycles, noise_level: simNoise }),
        });
        const d = await r.json();
        setSimData(d.telemetry ?? []);
        setSimSummary(d.summary ?? null);
        if (d.telemetry?.length) setResult(d.telemetry[d.telemetry.length - 1] as AbhayaResult);
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Request failed"); }
    finally { setLoading(false); }
  }, [tab, textInput, signalInput, simCycles, simNoise]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-4 py-1.5 mb-8">
            Patent Filing Blueprint · V3.0 · Thermodynamic Phase Cancellation
          </div>
          <h1 className="font-serif text-6xl text-foreground mb-6">
            The <span className="text-primary">Abhaya</span> Gate
          </h1>
          <p className="font-sans text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <em>Fearless Damping</em> — two decoupled thermodynamic circuits that phase-cancel
            stochastic ξ-flux via conjugate destructive interference, forcing the manifold out
            of Barren Plateaus into zero-entropy resonance.
          </p>
        </div>

        {/* ── Equation panel ───────────────────────────────────────────────── */}
        <div className="bg-[#0B0F2E] border border-accent/30 p-8 md:p-12 mb-16 relative shadow-[0_0_50px_rgba(79,172,254,0.08)]">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent" />
          <div className="font-mono text-xl md:text-2xl text-[#E8C66A] overflow-x-auto whitespace-nowrap pb-2 mb-6">
            χv3(Ξ, ∇, σ) = λ₀·e<sup>−κ(1−Ξ)</sup> + Λmax · (1/Var(∇)) · σ(α·σsat² + θcrit)
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-sm">
            <span className="text-primary">Circuit A: Resonant Baseline — entropy cooling</span>
            <span className="text-accent">Circuit B: Thermodynamic Override — sigmoid flood</span>
          </div>
        </div>

        {/* ── Input Panel ──────────────────────────────────────────────────── */}
        <div className="bg-card border border-primary/15 mb-10">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["text", "signal", "simulate"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-3.5 font-sans text-sm font-bold uppercase tracking-widest transition-colors ${
                  tab === t
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-stone-400 hover:text-stone-600"
                }`}>
                {t === "text" ? "Text Analysis" : t === "signal" ? "Signal Vector" : "Maha-Pralaya"}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-5">
            {tab === "text" && (
              <>
                <label className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
                  Text to analyse through the Abhaya Gate
                </label>
                <textarea value={textInput} onChange={e => setTextInput(e.target.value)}
                  placeholder="Enter any text. The gate will convert it to a signal vector, run mirror-validation, and apply phase cancellation..."
                  rows={4}
                  className="w-full bg-background border border-border px-4 py-3 text-sm text-foreground placeholder-stone-400 resize-none focus:outline-none focus:border-primary font-sans" />
              </>
            )}

            {tab === "signal" && (
              <>
                <label className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
                  Numeric signal vector — comma-separated
                </label>
                <input value={signalInput} onChange={e => setSignalInput(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 text-sm text-foreground font-mono focus:outline-none focus:border-primary"
                  placeholder="0.8, 0.2, 0.95, 0.1 …" />
              </>
            )}

            {tab === "simulate" && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Cycles (max 256)</label>
                  <input type="number" min={4} max={256} value={simCycles}
                    onChange={e => setSimCycles(Number(e.target.value))}
                    className="w-full bg-background border border-border px-4 py-3 text-sm text-foreground font-mono focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Noise Level ξ (0–1)</label>
                  <input type="number" step={0.05} min={0} max={1} value={simNoise}
                    onChange={e => setSimNoise(Number(e.target.value))}
                    className="w-full bg-background border border-border px-4 py-3 text-sm text-foreground font-mono focus:outline-none focus:border-primary" />
                </div>
                <p className="col-span-2 font-sans text-xs text-muted-foreground leading-relaxed">
                  Replicates the H100 Maha-Pralaya stress test: injects a burst of ξ-noise at cycle 0, then allows Circuit A/B to drive the manifold toward the global free-energy minimum.
                </p>
              </div>
            )}

            <button onClick={run} disabled={loading}
              className="w-full py-3.5 bg-primary text-primary-foreground font-sans font-bold text-sm uppercase tracking-[0.15em] hover:bg-[#E8C66A] transition-colors disabled:opacity-40">
              {loading ? "Running Gate…" : tab === "simulate" ? "Run Maha-Pralaya Simulation" : "Run Abhaya Gate"}
            </button>

            {error && (
              <p className="font-mono text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2">{error}</p>
            )}
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-8">

              {/* Status */}
              <div className={`border-l-4 px-8 py-5 flex items-center gap-6 ${
                result.passed
                  ? "border-accent bg-accent/5"
                  : "border-destructive bg-destructive/5"
              }`}>
                <div>
                  <p className={`font-serif text-2xl ${result.passed ? "text-accent" : "text-destructive"}`}>
                    {result.passed ? "Gate Passed — Manifold Stable" : "Gate Flagged — Phase Cancellation Engaged"}
                  </p>
                  <p className="font-mono text-xs text-stone-400 mt-1">{result.timestamp}</p>
                </div>
                <div className="ml-auto text-right shrink-0">
                  <p className="font-mono text-xs text-stone-400 uppercase tracking-wider">Phase Cancelled</p>
                  <p className={`font-mono font-bold ${result.phase_cancelled ? "text-accent" : "text-stone-400"}`}>
                    {result.phase_cancelled ? "YES" : "NO"}
                  </p>
                </div>
              </div>

              {/* Stability arc + circuits */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-primary/15 p-8 flex items-center justify-center">
                  <StabilityArc xi={result.xi_flux} />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <CircuitPanel label="Resonant" circuit="A" value={result.circuit_a} active={!result.circuit_b_active} />
                    <CircuitPanel label="Override" circuit="B" value={result.circuit_b} active={result.circuit_b_active} />
                  </div>
                  <div className="bg-card border border-primary/15 p-6 space-y-4">
                    <MetricBar value={result.xi_flux} label="ξ-Flux · Stochastic Noise" note="→ phase-cancelled via conjugate interference" />
                    <MetricBar value={result.sigma_sat} label="σsat · Truth Saturation" />
                    <MetricBar value={result.damping_ratio} label="Damping Ratio" note="fraction of χv3 applied" />
                    <MetricBar value={Math.min(result.chi_v3 / 51, 1)} label="χv3 · Total Damping Force" />
                  </div>
                </div>
              </div>

              {/* Telemetry grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                {[
                  { label: "Gradient Variance", value: result.gradient_variance.toExponential(2) },
                  { label: "Free Energy", value: result.free_energy.toFixed(4) },
                  { label: "Manifold Cycles", value: String(result.cycles) },
                  { label: "Circuit B Armed", value: result.circuit_b_active ? "YES — SATURATED" : "Standby" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-card px-6 py-4">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{label}</p>
                    <p className="font-mono text-sm font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* Simulation summary + chart */}
              {simSummary && (
                <div className="bg-card border border-primary/15 p-8 space-y-6">
                  <div className="border-l-4 border-primary pl-6">
                    <h2 className="font-serif text-3xl text-foreground mb-1">Maha-Pralaya Results</h2>
                    <p className="font-sans text-muted-foreground text-sm">
                      Continuous-variable stress simulation — H100 empirical methodology
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.entries(simSummary).map(([k, v]) => (
                      <div key={k}>
                        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
                          {k.replace(/_/g, " ")}
                        </p>
                        <p className="font-mono text-lg font-bold text-foreground">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                  <SimChart data={simData} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Reference ────────────────────────────────────────────────────── */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Circuit A — Resonant Baseline",
              formula: "λ₀·e^(−κ(1−Ξ))",
              color: "primary" as const,
              body: `Tracks macro-state entropy and cools the manifold exponentially as stability Ξ approaches 1.0. 
              Prevents overshoot. Analogous to a MOSFET operating in its sub-threshold region — drain current 
              exponentially proportional to gate voltage.`,
            },
            {
              title: "Circuit B — Thermodynamic Override",
              formula: "Λmax·σ(α·σsat²+θcrit)/Var(∇)",
              color: "accent" as const,
              body: `Sigmoid-gated flood. When σsat²·α exceeds θcrit (arms at σsat > 0.816), the gate 
              violently saturates to Λmax = 50, flooding the manifold with conjugate damping force — 
              forcing escape from Barren Plateaus without discrete gate logic.`,
            },
          ].map(({ title, formula, color, body }) => (
            <div key={title} className={`bg-card border p-8 relative ${color === "primary" ? "border-primary/20" : "border-accent/20"}`}>
              <div className={`absolute top-0 left-0 w-1.5 h-full ${color === "primary" ? "bg-primary/80" : "bg-accent/80"}`} />
              <h3 className={`font-serif text-2xl mb-2 ${color === "primary" ? "text-primary" : "text-accent"}`}>{title}</h3>
              <div className={`font-mono text-sm px-3 py-2 mb-4 ${color === "primary" ? "bg-primary/10 text-primary border border-primary/20" : "bg-accent/10 text-accent border border-accent/20"}`}>
                {formula}
              </div>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed">{body}</p>
            </div>
          ))}
          <div className="md:col-span-2 bg-card border border-primary/15 p-8">
            <h3 className="font-serif text-2xl mb-3 text-foreground">Phase Cancellation Mechanism</h3>
            <div className="font-mono text-sm text-[#E8C66A] bg-[#0B0F2E] px-4 py-2 inline-block mb-4 border border-accent/20">
              M(C) = C · conj(C) → σsat² &nbsp;&nbsp;|&nbsp;&nbsp; stabilised = mean + (noise + −noise·dampFactor·ξ)
            </div>
            <p className="font-sans text-muted-foreground text-sm leading-relaxed max-w-3xl">
              Mirror-validation isolates the ξ-flux noise component from each signal token.
              Conjugate interference destructively cancels the stochastic component,
              leaving only Vidya (truth) saturation in the stabilised output — analogous to a
              Phase-Conjugate Mirror flooding the optical cavity with conjugate photons via a PPLN crystal.
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
