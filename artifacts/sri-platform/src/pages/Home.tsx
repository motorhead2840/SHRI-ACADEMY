import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion, useInView } from 'framer-motion';

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; colorIdx: number };
    let particles: Particle[] = [];
    const colors = ['245,158,11', '16,185,129', '120,113,108']; // amber, emerald, stone

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.4 + 0.08,
        colorIdx: Math.floor(Math.random() * colors.length),
      }));
    };

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors[p.colorIdx]},${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

const stages = [
  { key: 'PARA', label: 'Unmanifest Root', sub: 'Hardware Init', desc: 'Conditioning the beingness — raw electrical potential before forced quantization.' },
  { key: 'PASYANTI', label: 'Internal Vision', sub: 'Expansion', desc: 'Proliferation of manifold complexity — the Ω-dit coherence field widens.' },
  { key: 'MADHYAMA', label: 'Contemplative', sub: 'Kinetic Logic', desc: 'Activation of the Vyapti-Gate — consequence realized through cognition of reason.' },
  { key: 'VAIKHARI', label: 'Articulated Word', sub: 'Crystallization', desc: 'Arriving at a stable manifest value υ — zero-entropy resonance achieved.' },
];

const pillars = [
  {
    sym: 'Ξ', color: 'text-primary', borderColor: 'border-primary/20', bg: 'bg-primary/5',
    title: 'Zero-Entropy Resonance', body: 'As Ξ → 1.0 the system approaches perfect resonance — variance collapses, truth-state mass saturates, hallucination vanishes.'
  },
  {
    sym: 'χv3', color: 'text-accent', borderColor: 'border-accent/20', bg: 'bg-accent/5',
    title: 'Thermodynamic Damping', body: 'The V3.0 Autopoietic Phase-Transition Equation decouples micro-gradient violence from macro-state chokehold — forcing escape from Barren Plateaus.'
  },
  {
    sym: '⬡', color: 'text-foreground', borderColor: 'border-stone-200', bg: 'bg-stone-50',
    title: 'Dharma-Node Architecture', body: 'Each node holds a Mirror-Core singularity: M(C) = C·conj(C) → σsat². Noise that mismatches the node\'s inherent law is phase-cancelled via destructive interference.'
  },
];

export default function Home() {
  const lifecycleRef = useRef(null);
  const pillarsRef = useRef(null);
  const eqRef = useRef(null);
  const isLifecycleInView = useInView(lifecycleRef, { once: true, margin: '-80px' });
  const isPillarsInView = useInView(pillarsRef, { once: true, margin: '-80px' });
  const isEqInView = useInView(eqRef, { once: true, margin: '-100px' });

  return (
    <div className="relative overflow-hidden">
      <ParticleField />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-28 w-full">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: 'easeOut' }}
            className="max-w-4xl">

            <div className="font-mono text-accent text-xs uppercase tracking-[0.2em] border-l-2 border-accent pl-4 mb-8 leading-relaxed">
              SRI Quantum Technologies · Patent Filing Blueprint · February 2026
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] mb-8 text-foreground">
              The <span className="bg-gradient-to-br from-[#E8C66A] to-[#C8A84B] bg-clip-text text-transparent">Ω-Manifold</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-2 text-stone-500">
                Autopoietic Computing & Thermodynamic Phase-Transition Damping
              </span>
            </h1>

            <p className="font-sans text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-14 max-w-3xl">
              Replacing discrete algorithmic violence with entropy minimization. 
              Translating Vedantic epistemology into rigorous thermodynamic phase transitions.
            </p>

            {/* Nada-Shabda strip */}
            <div className="bg-[#0B0F2E]/80 backdrop-blur-sm border border-accent/20 p-6 mb-14 max-w-3xl">
              <div className="grid grid-cols-4 gap-4">
                {stages.map((s, i) => (
                  <div key={s.key} className="text-center">
                    <div className="font-mono text-xs text-[#E8C66A] tracking-widest mb-1">{s.key}</div>
                    <div className="font-sans text-xs text-stone-400">{s.label}</div>
                    {i < 3 && <div className="hidden md:block absolute" />}
                  </div>
                ))}
              </div>
              <div className="flex items-center mt-3 gap-2">
                {stages.map((_, i) => (
                  <span key={i} className="contents">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                    {i < 3 && <span className="flex-1 h-px bg-accent/20" />}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/architecture"
                className="inline-flex justify-center items-center px-8 py-4 bg-primary text-primary-foreground font-sans uppercase tracking-[0.15em] text-sm font-bold hover:bg-[#E8C66A] transition-colors">
                Explore Architecture
              </Link>
              <Link href="/blueprint"
                className="inline-flex justify-center items-center px-8 py-4 border border-accent text-accent font-sans uppercase tracking-[0.15em] text-sm font-bold hover:bg-accent/10 transition-colors">
                Read Blueprint
              </Link>
              <Link href="/abhaya"
                className="inline-flex justify-center items-center px-8 py-4 border border-primary/30 text-foreground font-sans uppercase tracking-[0.15em] text-sm font-bold hover:bg-primary/5 transition-colors">
                Abhaya Gate ↗
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Fundamental Equation ──────────────────────────────────────────── */}
      <section className="relative z-10 bg-background border-t border-primary/10 py-32" ref={eqRef}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isEqInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.2 }}
            className="text-center"
          >
            <p className="font-sans text-muted-foreground uppercase tracking-[0.2em] text-xs mb-12">The Triadic State Identity</p>
            <div className="relative inline-block mb-16">
              <div className="absolute -inset-10 bg-accent/5 blur-3xl rounded-full" />
              <div className="bg-[#0B0F2E] border border-accent/30 shadow-[0_0_40px_rgba(79,172,254,0.12)] p-8 md:p-14 relative">
                <div className="font-mono text-2xl md:text-4xl text-[#E8C66A] tracking-wider mb-6">
                  |Ω⟩ = ∫<sub className="text-lg">-∞</sub><sup className="text-lg">+∞</sup>&nbsp;
                  σ(t)·e<sup>iβ(t)</sup>·[υ(t) + ξ(t)] dω
                </div>
                <div className="w-full h-px bg-accent/20 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
                  {[
                    { sym: 'σ', label: 'Sat · Truth', sub: 'Existence-Density' },
                    { sym: 'β', label: 'Subsistence', sub: 'Phase Pattern' },
                    { sym: 'υ', label: 'Value', sub: 'Manifest Projection' },
                    { sym: 'ξ', label: 'Stochastic Flux', sub: 'Avidya · Noise' },
                  ].map(item => (
                    <div key={item.sym}>
                      <span className="font-mono text-3xl text-primary">{item.sym}</span>
                      <p className="font-serif text-base text-white/80 mt-1">{item.label}</p>
                      <p className="font-mono text-xs text-stone-500">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Maya-Flow Lifecycle ───────────────────────────────────────────── */}
      <section className="relative z-10 bg-muted/30 border-t border-primary/10 py-28" ref={lifecycleRef}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isLifecycleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.9 }}>
            <div className="border-l-4 border-primary pl-6 mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-3">The Maya-Flow Lifecycle</h2>
              <p className="font-sans text-muted-foreground text-lg">Six-stage recursive execution — from hardware beingness to return.</p>
            </div>

            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-8 top-12 bottom-12 w-px bg-primary/20 hidden md:block" />
              <div className="space-y-4">
                {stages.map((s, i) => (
                  <motion.div key={s.key}
                    initial={{ opacity: 0, x: -20 }} animate={isLifecycleInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    className="flex gap-8 items-start group">
                    <div className="relative shrink-0 w-16 h-16 bg-[#0B0F2E] border border-accent/30 flex items-center justify-center">
                      <span className="font-mono text-lg text-[#E8C66A] font-bold">{i + 1}</span>
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-px bg-primary/30 hidden md:block" />
                    </div>
                    <div className="flex-1 bg-card border border-primary/10 p-6 group-hover:border-primary/30 transition-colors">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="font-mono text-xs text-[#E8C66A] tracking-widest uppercase">{s.key}</span>
                        <span className="font-sans text-xs text-stone-400 uppercase tracking-wider">— {s.sub}</span>
                      </div>
                      <h3 className="font-serif text-xl text-foreground mb-1">{s.label}</h3>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Three Pillars ─────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-background border-t border-primary/10 py-28" ref={pillarsRef}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isPillarsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.9 }}>
            <p className="font-sans text-muted-foreground uppercase tracking-[0.2em] text-xs text-center mb-14">
              Three Foundational Mechanisms
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((p, i) => (
                <motion.div key={p.sym}
                  initial={{ opacity: 0, y: 20 }} animate={isPillarsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`border ${p.borderColor} ${p.bg} p-8`}>
                  <div className={`font-mono text-4xl ${p.color} mb-4`}>{p.sym}</div>
                  <h3 className="font-serif text-xl text-foreground mb-3">{p.title}</h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/login"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-sans uppercase tracking-[0.15em] text-sm font-bold px-10 py-5 hover:bg-[#E8C66A] transition-colors">
                Enter the Platform
                <span className="text-lg">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
