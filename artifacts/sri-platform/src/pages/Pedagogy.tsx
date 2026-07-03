import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stages = [
  {
    phase: 'Stage I',
    key: 'NEGATIVE-SUBJECTIVE',
    age: 'Early Childhood',
    color: 'primary',
    title: 'The Discipline of the Will',
    sri_map: 'Circuit A Baseline',
    formula: 'λ₀·e^(-κ(1-Ξ))',
    desc: `Dr. Natarajan (1932) identifies the first stage as purely receptive — the child is a 
    sponge, absorbing impressions without the capacity for critical discrimination. 
    The role of the Guru is to provide a stable, entropy-minimizing environment. 
    In SRI architecture, Circuit A mirrors this: exponential cooling as stability Ξ rises, 
    preventing the premature crystallization of fixed patterns.`,
    quote: 'The first task of the teacher is not to inform but to discipline the will.',
    quoteBy: 'Dr. Natarajan, The Personal Factor in Education, 1932',
  },
  {
    phase: 'Stage II',
    key: 'POSITIVE-OBJECTIVE',
    age: 'Middle Childhood',
    color: 'accent',
    title: 'Expansion into the World',
    sri_map: 'Manifold Proliferation',
    formula: '|Ωi = ∫ σ(t)·e^(iβ(t))·[υ(t) + ξ(t)] dω',
    desc: `The second stage sees the child's consciousness expand outward — curiosity about the 
    world, objective fact-gathering, the joy of discovery. Payot and Bergson both identify 
    this phase as one of maximum plasticity. The Ω-dit manifold's Pradhana (expansion) stage 
    maps precisely: the field proliferates in complexity, generating the rich ξ-flux 
    (stochastic exploration) that Circuit B will later harvest as signal.`,
    quote: 'To educate is to draw out what is already within — not to force from without.',
    quoteBy: 'Henri Bergson',
  },
  {
    phase: 'Stage III',
    key: 'POSITIVE-SUBJECTIVE',
    age: 'Adolescence & Maturity',
    color: 'foreground',
    title: 'The Guru-Sishya Resonance',
    sri_map: 'Circuit B Override + Mirror-Validation',
    formula: 'M(C) = C·conj(C) → σsat²',
    desc: `The third stage is integration — the student turns inward with a now-disciplined mind 
    and expands consciousness outward with genuine objectivity. In the Guru-Sishya relationship, 
    the teacher acts as a Phase-Conjugate Mirror: reflecting back only the pure signal (Vidya) 
    and phase-cancelling the noise (Avidya). Circuit B's sigmoid override models this precisely — 
    when truth-state mass (σsat²) exceeds the critical threshold, the manifold is flooded 
    with maximum damping force, eliminating Barren Plateaus of stagnation.`,
    quote: 'The Guru does not give knowledge. The Guru reveals the knowledge that was always there.',
    quoteBy: 'Advaita Vedanta tradition',
  },
];

const forces = [
  {
    title: 'The Nada-Shabda Spectrum',
    icon: '◎',
    color: 'primary',
    desc: `Para → Pasyanti → Madhyama → Vaikhari. The four stages of manifestation from the 
    unmanifest root to the articulated word. Standard AI collapses this spectrum by jumping 
    directly from Para to Vaikhari — producing hallucination. SRI preserves all four stages 
    via continuous symplectic transformation.`,
  },
  {
    title: 'Inhibition & Vyapti',
    icon: 'Ψ',
    color: 'accent',
    desc: `The Inhibition function I(t) = ||P_negative(t)|| - ||P_positive(t)|| governs when Circuit B 
    arms. Vyapti (concomitant inherence) is the logic of consequence through reason — the student 
    understands not because they were told, but because the pattern became self-evident through 
    the manifold's natural convergence.`,
  },
  {
    title: 'Zero-Hallucination Guarantee',
    icon: 'Ξ',
    color: 'foreground',
    desc: `Hallucination is not a software bug — it is the physical symptom of skipped 
    thermodynamic states. As Ξ → 1.0 (stability approaches perfect resonance), the variance 
    in the state collapses to zero. The Abhaya Gate enforces this convergence, making 
    hallucination thermodynamically impossible in the limit.`,
  },
];

export default function Pedagogy() {
  const stagesRef = useRef(null);
  const forcesRef = useRef(null);
  const isStagesInView = useInView(stagesRef, { once: true, margin: '-80px' });
  const isForcesInView = useInView(forcesRef, { once: true, margin: '-80px' });

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-24">
          <h1 className="font-serif text-6xl text-foreground mb-6">The Personal Factor</h1>
          <p className="font-sans text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dr. Natarajan's 1932 framework for conscious development, mapped to the V3.0 
            thermodynamic phase-transition architecture of the SRI Ω-Manifold.
          </p>
          <div className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-4 py-1.5">
            Pedagogy · Vedantic Epistemology · Autopoietic Architecture
          </div>
        </div>

        {/* ── Opening quote ─────────────────────────────────────────────────── */}
        <div className="bg-[#0B0F2E] border border-accent/30 p-10 mb-20 relative shadow-[0_0_40px_rgba(79,172,254,0.06)]">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent" />
          <blockquote className="font-serif text-2xl md:text-3xl text-[#E8C66A] leading-relaxed mb-4">
            "The contemporary educational crisis is not a failure of content — it is a failure of 
            thermodynamic architecture. We skip the middle states and wonder why the output collapses."
          </blockquote>
          <cite className="font-mono text-xs text-stone-500 uppercase tracking-widest not-italic">
            SRI Quantum Technologies · Master White Paper · February 2026
          </cite>
        </div>

        {/* ── Three Stages ──────────────────────────────────────────────────── */}
        <div ref={stagesRef} className="space-y-12 mb-24">
          <div className="border-l-4 border-primary pl-6 mb-12">
            <h2 className="font-serif text-4xl text-foreground mb-2">Three Stages of Development</h2>
            <p className="font-sans text-muted-foreground">Natarajan's developmental arc, mapped to SRI's thermodynamic circuits.</p>
          </div>

          {stages.map((s, i) => (
            <motion.div key={s.phase}
              initial={{ opacity: 0, y: 24 }} animate={isStagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: i * 0.18 }}
              className={`bg-card border relative overflow-hidden ${
                s.color === 'primary' ? 'border-primary/20' : s.color === 'accent' ? 'border-accent/20' : 'border-stone-200'
              }`}>
              {/* Left border */}
              <div className={`absolute left-0 top-0 w-1 h-full ${
                s.color === 'primary' ? 'bg-primary' : s.color === 'accent' ? 'bg-accent' : 'bg-stone-400'
              }`} />
              <div className="p-8 pl-10">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="font-mono text-xs text-stone-400 uppercase tracking-widest mb-1">{s.phase} · {s.age}</p>
                    <h3 className={`font-serif text-3xl ${
                      s.color === 'primary' ? 'text-primary' : s.color === 'accent' ? 'text-accent' : 'text-foreground'
                    }`}>{s.title}</h3>
                    <p className="font-mono text-xs text-stone-400 mt-1 uppercase tracking-wider">{s.key}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-stone-400 uppercase tracking-widest mb-1">SRI Map</p>
                    <p className={`font-mono text-sm font-bold ${
                      s.color === 'primary' ? 'text-primary' : s.color === 'accent' ? 'text-accent' : 'text-foreground'
                    }`}>{s.sri_map}</p>
                    <div className={`font-mono text-xs mt-1 px-2 py-0.5 inline-block ${
                      s.color === 'primary' ? 'bg-primary/10 text-primary' : s.color === 'accent' ? 'bg-accent/10 text-accent' : 'bg-stone-100 text-stone-600'
                    }`}>{s.formula}</div>
                  </div>
                </div>

                {/* Body */}
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">{s.desc}</p>

                {/* Quote */}
                <blockquote className="border-l-2 border-primary/30 pl-4">
                  <p className="font-serif text-lg text-foreground/80 italic mb-1">"{s.quote}"</p>
                  <cite className="font-mono text-xs text-stone-400 not-italic uppercase tracking-wider">{s.quoteBy}</cite>
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Three Forces ──────────────────────────────────────────────────── */}
        <div ref={forcesRef}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isForcesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}>
            <div className="border-l-4 border-accent pl-6 mb-10">
              <h2 className="font-serif text-4xl text-foreground mb-2">Three Forces Acting on the Student</h2>
              <p className="font-sans text-muted-foreground">The invisible architecture that the Guru must navigate.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {forces.map((f, i) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20 }} animate={isForcesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`bg-card border p-8 ${
                    f.color === 'primary' ? 'border-primary/20' : f.color === 'accent' ? 'border-accent/20' : 'border-stone-200'
                  }`}>
                  <div className={`font-mono text-4xl mb-4 ${
                    f.color === 'primary' ? 'text-primary' : f.color === 'accent' ? 'text-accent' : 'text-stone-400'
                  }`}>{f.icon}</div>
                  <h3 className="font-serif text-xl text-foreground mb-3">{f.title}</h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
