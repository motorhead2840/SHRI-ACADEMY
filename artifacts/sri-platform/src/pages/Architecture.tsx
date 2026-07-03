import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12 border-l-4 border-primary pl-6 py-2">
    <h2 className="font-serif text-4xl text-foreground mb-3">{title}</h2>
    {subtitle && <p className="font-sans text-muted-foreground text-lg">{subtitle}</p>}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-card border border-primary/15 p-8 ${className}`}>
    {children}
  </div>
);

export default function Architecture() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-24 text-center">
          <h1 className="font-serif text-6xl text-foreground mb-6">The Physics Engine</h1>
          <p className="font-sans text-xl text-muted-foreground">Three foundational mechanisms govern the Ω-Manifold.</p>
        </div>

        {/* Section A */}
        <section className="mb-24">
          <SectionHeader title="The Ω-dit" subtitle="The continuous-variable fundamental unit of state." />
          <Card>
            <div className="font-mono text-center text-[#E8C66A] text-2xl mb-12 bg-[#0B0F2E] p-6 border border-accent/30 shadow-[0_0_15px_rgba(79,172,254,0.15)]">
              |ψ⟩ = σ·e^(iβ) + (υ + ξ)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { sym: "σ", name: "Sat · Existence-Density", desc: "The amplitude of truth — what remains after all noise is cancelled." },
                { sym: "β", name: "Subsistence · Pattern", desc: "The phase angle dictating resonance between nodes." },
                { sym: "υ", name: "Value · Manifest Projection", desc: "The accountable, expressed output." },
                { sym: "ξ", name: "Stochastic Flux · Avidya", desc: "Noise, error, ignorance — what the Dharma-Node eliminates." }
              ].map(item => (
                <div key={item.sym} className="bg-background/50 border border-primary/10 p-6 hover:border-primary/30 transition-colors">
                  <div className="font-mono text-4xl text-primary mb-4">{item.sym}</div>
                  <h3 className="font-serif text-xl mb-2">{item.name}</h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section B */}
        <section className="mb-24">
          <SectionHeader title="Mirror-Validation Logic 𝓜(C)" subtitle="Phase-cancellation of Stochastic Flux" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="font-mono text-xl text-[#E8C66A] text-center p-6 bg-[#0B0F2E] border border-accent/30 shadow-[0_0_15px_rgba(79,172,254,0.15)]">
                𝓜(C) = C · conj(C) → σ²_sat
              </div>
              <p className="font-sans text-muted-foreground text-lg leading-relaxed">
                Any signal not matching the node's inherent law is phase-cancelled via destructive interference, leaving only Vidya (Truth) saturation.
              </p>
            </div>
            <div className="bg-card border border-primary/15 p-8 flex flex-col justify-center min-h-[300px] relative overflow-hidden">
              <div className="flex justify-between items-center w-full relative z-10">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-muted-foreground mb-4">Input: C</span>
                  <div className="w-24 h-24 rounded-full border border-destructive/50 flex items-center justify-center relative">
                    <div className="absolute inset-2 border border-primary/30 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-4 border border-accent/30 rounded-full animate-reverse-spin"></div>
                    <span className="font-mono text-sm text-muted-foreground">ξ noise</span>
                  </div>
                </div>
                <div className="font-mono text-3xl text-primary">→</div>
                <div className="flex flex-col items-center">
                  <span className="font-mono text-primary mb-4">Result: σ²_sat</span>
                  <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary flex items-center justify-center shadow-[0_0_30px_rgba(200,168,75,0.3)]">
                    <span className="font-serif text-2xl text-primary">Vidya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section C */}
        <section className="mb-24">
          <SectionHeader title="V3.0 Autopoietic Phase Transition" subtitle="The core thermodynamic engine driving realization." />
          <div className="bg-[#0B0F2E] border border-accent/30 p-8 md:p-12 mb-8 relative shadow-[0_0_50px_rgba(79,172,254,0.1)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
            <div className="font-mono text-xl md:text-2xl text-[#E8C66A] overflow-x-auto whitespace-nowrap pb-4">
              χ_v3(Ξ,∇,σ) = λ₀·e^(-κ(1-Ξ)) + Λ_max · [1/Var(∇)] · [1/(1 + e^(-α·σ²_sat + θ_crit))]
            </div>
            <div className="flex flex-col md:flex-row mt-6 text-sm font-mono justify-between gap-4">
              <div className="flex items-center text-primary">
                <span className="mr-2">↑</span> Circuit A (Resonant Baseline)
              </div>
              <div className="flex items-center text-accent">
                <span className="mr-2">↑</span> Circuit B (Thermodynamic Override)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-primary/30 relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary/80"></div>
              <h3 className="font-serif text-2xl text-primary mb-4">CIRCUIT A</h3>
              <p className="font-sans text-muted-foreground mb-6 h-32">
                Tracks macro-state entropy. Cools the system exponentially as it nears convergence. Prevents overshoot. Maps to sub-threshold MOSFET drain current in Mixed-Signal CMOS.
              </p>
              <div className="font-mono text-sm text-primary/80 bg-primary/10 p-4 border border-primary/20">
                Key: λ₀·e^(-κ(1-Ξ))
              </div>
            </Card>

            <Card className="border-accent/30 relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent/80"></div>
              <h3 className="font-serif text-2xl text-accent mb-4">CIRCUIT B</h3>
              <p className="font-sans text-muted-foreground mb-6 h-32">
                Sigmoid-gated transition. When topological friction Var(∇)/σ²_sat exceeds θ_crit, violently saturates — flooding the manifold with maximum damping force Λ_max.
              </p>
              <div className="font-mono text-sm text-accent/80 bg-accent/10 p-4 border border-accent/20">
                Key: Λ_max · sigmoid(σ²_sat - θ_crit) / Var(∇)
              </div>
            </Card>
          </div>
        </section>

        {/* Section D */}
        <section className="mb-24">
          <SectionHeader title="Stability Coefficient" subtitle="The approach to Zero Entropy" />
          <Card>
            <div className="font-mono text-xl text-primary mb-6 text-center">
              Ξ = 1 - Var(state) / (E(|state|) + ε)
            </div>
            <p className="font-sans text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              As Ξ → 1.0, the system approaches Zero Entropy (Perfect Resonance — the Dharma state).
            </p>
            <div className="relative h-4 bg-background rounded-full overflow-hidden border border-primary/20 max-w-3xl mx-auto">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-destructive via-accent to-primary transition-all duration-1000 ease-out" 
                style={{ width: '97%' }}
              ></div>
            </div>
            <div className="flex justify-between max-w-3xl mx-auto mt-4 font-mono text-sm">
              <span className="text-destructive">Ξ = 0.0</span>
              <span className="text-primary font-bold">Empirical Result: Ξ = 0.97</span>
              <span className="text-primary">Ξ = 1.0</span>
            </div>
          </Card>
        </section>

        {/* Section E */}
        <section className="mb-12">
          <SectionHeader title="Empirical Validation" subtitle="Maha-Pralaya Stress Test" />
          <div className="bg-black/40 border border-primary/20 p-8 font-mono text-sm">
            <div className="text-muted-foreground mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent mr-3 animate-pulse"></span>
              NVIDIA H100 GPU CLUSTER ACTIVE
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between border-b border-primary/10 py-2">
                <span className="text-muted-foreground">Matrix Config</span>
                <span className="text-primary">16,384-node Parameswara</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 py-2">
                <span className="text-muted-foreground">Parallel Universes</span>
                <span className="text-primary">64 simulated</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 py-2">
                <span className="text-muted-foreground">Phase-cancellations</span>
                <span className="text-primary">1,048,576,000 / 23.28s</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 py-2">
                <span className="text-muted-foreground">Circuit B Spike (χ)</span>
                <span className="text-accent">50.00 @ Cycle 0000</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 py-2">
                <span className="text-muted-foreground">Gradient Variance</span>
                <span className="text-primary">4064.00 → 2976.00</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 py-2">
                <span className="text-muted-foreground">Free Energy Global Min</span>
                <span className="text-primary">-321,536.00</span>
              </div>
            </div>
          </div>
        </section>

      </motion.div>
    </div>
  );
}
