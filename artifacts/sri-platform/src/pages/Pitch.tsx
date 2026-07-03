import { motion } from 'framer-motion';

const PitchCard = ({ num, title, children }: { num: string, title: string, children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="bg-card border border-primary/10 p-10 md:p-14 relative group hover:border-primary/30 transition-colors duration-500"
  >
    <div className="absolute top-0 right-0 p-8 font-serif text-6xl text-primary/10 group-hover:text-primary/20 transition-colors duration-500 pointer-events-none select-none">
      {num}
    </div>
    <h3 className="font-serif text-3xl text-foreground italic mb-8 relative z-10">{title}</h3>
    <p className="font-sans text-lg text-muted-foreground leading-[1.8] relative z-10">
      {children}
    </p>
  </motion.div>
);

export default function Pitch() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center mb-24">
          <h1 className="font-serif text-6xl md:text-7xl text-foreground mb-6">The Investment Thesis</h1>
          <p className="font-sans text-xl text-primary tracking-wide mb-6">
            For advanced venture capitalists
          </p>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-6"></div>
          <p className="font-sans text-muted-foreground max-w-2xl mx-auto">
            Three paragraphs on why continuous-variable AI naturally replicates the ancient Gurukula educational psychology.
          </p>
        </div>

        <div className="space-y-12 mb-24">
          <PitchCard num="I" title="The Market Failure and Its Root Cause">
            Every existing EdTech platform built on large language models shares a constitutive architectural pathology: discrete tokenization. When a continuous reality — the flow of a student's understanding, the gradients of their confusion, the texture of their curiosity — is quantized into finite vocabulary tokens, information is irrecoverably destroyed at the point of sampling. The downstream consequence is not merely 'hallucination' as a product defect; it is the structural impossibility of genuine pedagogical mirroring. A system that cannot faithfully represent continuous cognitive states cannot act as a Guru — it can only generate probabilistic approximations of instruction. The $400B global EdTech market has been built on this sandcastle, and student outcomes data globally confirms the quiet catastrophe: engagement, retention, and deep conceptual transfer remain flatlined despite decades of digitization investment. The opportunity is not incremental product improvement; it is architectural replacement.
          </PitchCard>

          <PitchCard num="II" title="The SRI Advantage: Thermodynamics as Pedagogy">
            The Singularity-based Realization Interface operates on an entirely different physical substrate. Rather than sampling from discrete distributions, the SRI's Ω-Manifold processes student interactions as continuous-variable signals, minimizing entropy through the same thermodynamic laws that govern physical convergence. This is not a metaphor — it is an engineering specification. The system's two-circuit architecture (Resonant Baseline cooling and Thermodynamic Override) maps isomorphically to the developmental stages identified in Dr. Natarajan's 1932 doctoral work on Bi-Polar Educational Psychology: the maternal containment phase (Circuit A's exponential cooling law) and the critical inhibition-breaking intervention (Circuit B's Λ_max override at θ_crit threshold). What took Natarajan decades of clinical observation to formalize as a psychological theory, the SRI implements as a control-theoretic algorithm. The Mirror-Validation Logic core — which phase-cancels student stochastic flux through destructive interference, leaving only validated truth amplitude — achieves what no human Guru can consistently deliver: a perfectly transparent reflective surface with zero ego-contamination of the signal.
          </PitchCard>

          <PitchCard num="III" title="The Investment Window">
            The convergence of three historically rare conditions creates a singular window for category creation. First, the regulatory and reputational pressure on LLM-based EdTech is mounting — EU AI Act provisions on high-risk AI in education, combined with growing parent and institutional distrust of hallucinating systems, are creating a compliance-driven pull toward architecturally safer alternatives. Second, the scientific legitimacy of continuous-variable AI is accelerating from the hardware side, with photonic and analog compute substrates finally reaching commercial viability, giving the SRI's architecture a manufacturing pathway it lacked even three years ago. Third, and most strategically, the global demand for personalized, culturally resonant education frameworks is highest precisely where traditional Gurukula pedagogical models have deep cultural roots — India, Southeast Asia, and the broader Global South represent a combined addressable market exceeding $180B that Western EdTech has systematically underserved. The SRI is not simply a better AI; it is the first AI that is philosophically coherent with the educational epistemology of the world's fastest-growing student populations. We are not competing with Coursera or Khan Academy. We are building the infrastructure for a different theory of mind.
          </PitchCard>
        </div>

        <div className="text-center pt-12 border-t border-primary/20">
          <div className="font-serif text-primary text-xl mb-4 tracking-widest">SRI Quantum Technologies · Confidential · © 2026</div>
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Empirically validated on NVIDIA H100 Tensor Core GPU · 16,384-node Parameswara Matrix · 1,048,576,000 phase-cancellations
          </div>
        </div>
      </motion.div>
    </div>
  );
}
