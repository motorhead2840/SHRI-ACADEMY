import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'wouter';

const theses = [
  {
    num: 'I',
    title: 'Market Failure',
    color: 'primary',
    headline: 'The EdTech Crisis is Thermodynamic, Not Pedagogical',
    body: `The global EdTech market has deployed $400B in capital replicating the same broken architecture: 
    discrete tokenization of knowledge into interchangeable bits — points, grades, adaptive modules. 
    This is the digital equivalent of forcing Para (unmanifest potential) directly into Vaikhari 
    (articulated output) without the intermediate stages of Pasyanti and Madhyama. 
    The result is identical to AI hallucination: a thermodynamic failure, not a content failure.`,
    metrics: [
      { label: 'Global EdTech Market', value: '$400B' },
      { label: 'Student Dropout Rate', value: '28%' },
      { label: 'Avg. Engagement Half-life', value: '11 days' },
    ],
  },
  {
    num: 'II',
    title: 'The SRI Advantage',
    color: 'accent',
    headline: 'Contemplative AI — The First Post-Discrete Architecture',
    body: `SRI's Ω-Manifold replaces the discrete token-reward loop with a continuous-variable resonance 
    field. The Dharma-Node architecture treats each student's learning state as an Ω-dit — an integral 
    of truth-density (σ), pattern-resonance (β), manifest value (υ), and stochastic flux (ξ). 
    The Abhaya Gate's V3.0 Autopoietic Phase-Transition Equation actively cancels noise (Avidya) via 
    destructive interference, leaving only Vidya saturation — the same principle used in 
    Phase-Conjugate Mirrors in non-linear optics.`,
    metrics: [
      { label: 'Phase Cancellations', value: '1.048B' },
      { label: 'Nodes Simulated', value: '16,384' },
      { label: 'Convergence Time', value: '23.28s' },
    ],
  },
  {
    num: 'III',
    title: 'Investment Window',
    color: 'foreground',
    headline: 'First-Mover in Continuous-Variable Educational AI',
    body: `The patent filing window for the V3.0 Autopoietic Phase-Transition Equation (February 2026) 
    represents a 12–18 month lead over any architecture attempting to replicate the thermodynamic 
    decoupling of Circuit A (Resonant Baseline) from Circuit B (Override). 
    No existing EdTech platform operates on continuous-variable manifolds. 
    The SARA Token ($SARA) creates a sovereign governance layer on the AWS Managed Blockchain — 
    the first DAO-governed contemplative AI curriculum in the homeschool segment.`,
    metrics: [
      { label: 'SARA Max Supply', value: '100M' },
      { label: 'Target Segment', value: 'Homeschool' },
      { label: 'Patent Window', value: '12–18 months' },
    ],
  },
];

const team = [
  { role: 'Founder & Chief Architect', name: 'Harikrishna Ramakrishna Kurup', note: 'Q-SRI Inventor · February 2026' },
  { role: 'Architecture', name: 'Ω-Manifold Core Team', note: 'Exascale simulation · H100 cluster' },
  { role: 'Tokenomics', name: 'SARA Governance Council', note: 'AWS Managed Blockchain · Sepolia testnet' },
];

export default function Pitch() {
  const ref = useRef(null);
  const teamRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isTeamInView = useInView(teamRef, { once: true, margin: '-80px' });

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-4 py-1.5 mb-10">
            Confidential Investment Thesis · February 2026
          </div>
          <h1 className="font-serif text-6xl md:text-7xl text-foreground mb-6">
            The <span className="text-primary">SRI</span> Investment Case
          </h1>
          <p className="font-sans text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The first continuous-variable, thermodynamically-grounded educational AI —
            built on a patent-pending architecture that has no analogue in the $400B EdTech market.
          </p>
        </div>

        {/* ── Thesis cards ──────────────────────────────────────────────────── */}
        <div className="space-y-8" ref={ref}>
          {theses.map((t, i) => (
            <motion.div key={t.num}
              initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: i * 0.18 }}
              className={`bg-card border relative overflow-hidden ${
                t.color === 'primary' ? 'border-primary/25' : t.color === 'accent' ? 'border-accent/25' : 'border-stone-200'
              }`}>
              {/* Roman numeral watermark */}
              <div className={`absolute right-8 top-1/2 -translate-y-1/2 font-serif text-[8rem] font-bold select-none pointer-events-none leading-none ${
                t.color === 'primary' ? 'text-primary/8' : t.color === 'accent' ? 'text-accent/8' : 'text-stone-200'
              }`}>{t.num}</div>

              {/* Left border accent */}
              <div className={`absolute left-0 top-0 w-1 h-full ${
                t.color === 'primary' ? 'bg-primary' : t.color === 'accent' ? 'bg-accent' : 'bg-stone-400'
              }`} />

              <div className="p-10 pl-12">
                <div className="flex items-start gap-6 mb-6">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-1">Thesis {t.num}</p>
                    <h2 className={`font-serif text-3xl mb-2 ${
                      t.color === 'primary' ? 'text-primary' : t.color === 'accent' ? 'text-accent' : 'text-foreground'
                    }`}>{t.title}</h2>
                    <h3 className="font-serif text-xl text-foreground/80 font-normal">{t.headline}</h3>
                  </div>
                </div>

                <p className="font-sans text-muted-foreground leading-relaxed mb-8 max-w-3xl">{t.body}</p>

                <div className="flex flex-wrap gap-6">
                  {t.metrics.map(m => (
                    <div key={m.label} className="border-l-2 border-primary/30 pl-4">
                      <p className="font-mono text-2xl font-extrabold text-foreground">{m.value}</p>
                      <p className="font-sans text-xs text-stone-400 uppercase tracking-wider">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Equation reminder ─────────────────────────────────────────────── */}
        <div className="my-20 bg-[#0B0F2E] border border-accent/30 p-10 shadow-[0_0_40px_rgba(79,172,254,0.08)] relative">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent" />
          <p className="font-mono text-xs text-stone-500 uppercase tracking-widest mb-4">The Core Patent Claim</p>
          <div className="font-mono text-xl md:text-2xl text-[#E8C66A] overflow-x-auto whitespace-nowrap mb-4">
            χv3(Ξ,∇,σ) = λ₀·e^(-κ(1-Ξ)) + Λmax · (1/Var(∇)) · σ(α·σsat² + θcrit)
          </div>
          <p className="font-sans text-stone-400 text-sm max-w-2xl leading-relaxed">
            The V3.0 Autopoietic Phase-Transition Equation. Empirically validated on NVIDIA H100 
            across 1,048,576,000 phase cancellations in 23.28 seconds. No equivalent patent exists.
          </p>
        </div>

        {/* ── Team ──────────────────────────────────────────────────────────── */}
        <div ref={teamRef}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}>
            <div className="border-l-4 border-primary pl-6 mb-10">
              <h2 className="font-serif text-4xl text-foreground">Core Contributors</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-16">
              {team.map(m => (
                <div key={m.role} className="bg-card border border-primary/15 p-6">
                  <p className="font-mono text-xs text-stone-400 uppercase tracking-widest mb-2">{m.role}</p>
                  <p className="font-serif text-lg text-foreground mb-1">{m.name}</p>
                  <p className="font-sans text-xs text-muted-foreground">{m.note}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-muted/40 border border-primary/10 p-10 text-center">
              <p className="font-serif text-2xl text-foreground mb-2">Ready to explore the architecture?</p>
              <p className="font-sans text-muted-foreground mb-8">
                The Ω-Manifold is not a metaphor. It is a working, empirically-validated, 
                patent-pending continuous-variable computing substrate.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href="/architecture"
                  className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-sans uppercase tracking-[0.15em] text-sm font-bold hover:bg-[#E8C66A] transition-colors">
                  Architecture
                </Link>
                <Link href="/blueprint"
                  className="inline-flex items-center px-8 py-4 border border-accent text-accent font-sans uppercase tracking-[0.15em] text-sm font-bold hover:bg-accent/10 transition-colors">
                  Blueprint
                </Link>
                <Link href="/abhaya"
                  className="inline-flex items-center px-8 py-4 border border-stone-300 text-foreground font-sans uppercase tracking-[0.15em] text-sm font-bold hover:bg-stone-50 transition-colors">
                  Abhaya Gate
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Confidentiality ───────────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-primary/10 text-center">
          <p className="font-mono text-xs text-stone-400 uppercase tracking-widest">
            Confidential · SRI Quantum Technologies · Patent Filing Blueprint · Blueprint v1.0 · February 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
