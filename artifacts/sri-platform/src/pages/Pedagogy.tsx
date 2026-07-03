import { motion } from 'framer-motion';

const StageCard = ({ 
  number, 
  title, 
  badge, 
  content, 
  concepts, 
  quote, 
  colorVar,
  borderColorClass 
}: { 
  number: number;
  title: string;
  badge: string;
  content: string;
  concepts: string;
  quote?: string;
  colorVar: string;
  borderColorClass: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className={`bg-card border ${borderColorClass} p-8 md:p-12 mb-16 relative`}
  >
    <div className={`absolute -top-4 -left-4 w-12 h-12 bg-background border ${borderColorClass} flex items-center justify-center font-serif text-2xl z-10`} style={{ color: `hsl(var(--${colorVar}))` }}>
      {number}
    </div>
    
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h3 className="font-serif text-3xl tracking-wide uppercase">{title}</h3>
      <span className={`font-sans text-xs tracking-widest uppercase border px-3 py-1 rounded-sm`} style={{ borderColor: `hsl(var(--${colorVar}))`, color: `hsl(var(--${colorVar}))` }}>
        {badge}
      </span>
    </div>

    <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8">
      {content}
    </p>

    <div className="grid md:grid-cols-2 gap-8 border-t border-primary/10 pt-8">
      <div>
        <h4 className="font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">Key Concepts</h4>
        <p className="font-serif text-foreground/80 leading-relaxed italic">
          {concepts}
        </p>
      </div>
      
      {quote && (
        <div>
          <h4 className="font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">Citation</h4>
          <blockquote className="font-serif text-lg text-foreground border-l-2 pl-4" style={{ borderColor: `hsl(var(--${colorVar}))` }}>
            "{quote}"
          </blockquote>
        </div>
      )}
    </div>
  </motion.div>
);

export default function Pedagogy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center mb-24">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">The Personal Factor in Education</h1>
          <p className="font-sans text-lg text-primary tracking-wide mb-8">
            Dr. Padmanabhan Natarajan · University of Paris, 1932
          </p>
          <p className="font-sans text-sm text-muted-foreground uppercase tracking-widest max-w-2xl mx-auto">
            Director, Sri Narayana Gurukula, Fernhill, Nilgiri, India
          </p>
        </div>

        <div className="bg-[#111640]/50 border-l-4 border-primary p-8 mb-24 font-serif text-xl md:text-2xl italic text-foreground leading-relaxed">
          "Education is not the transmission of knowledge, but the communication of an ardent love for truth — from soul to soul. The Guru is most powerful not when speaking, but when mirroring." 
          <span className="block mt-4 text-sm font-sans text-muted-foreground not-italic">— Natarajan, citing Payot</span>
        </div>

        <div className="relative">
          {/* Vertical connection line */}
          <div className="absolute left-0 md:left-6 top-12 bottom-12 w-[1px] bg-gradient-to-b from-primary via-accent to-[hsl(var(--violet-accent))] hidden md:block opacity-20"></div>

          <StageCard 
            number={1}
            title="Negative-Subjective"
            badge="Early Education · Roots Form"
            content="The child requires maternal protection, isolation from artificial collective society, and emotional compensation. The educator's role is not instruction but containment — the creation of a thermodynamically isolated system."
            concepts="Maternal boundary, Individual vs collective, Bergson's divergent tendencies, Dissatisfaction → Activity → Satisfaction behavioral cycle"
            quote="The child's personality, although indivisible, brought together people who could remain fused together because they were in their nascent state: this indecision full of promise is even one of the greatest charms of childhood."
            colorVar="primary"
            borderColorClass="border-primary/30"
          />

          <StageCard 
            number={2}
            title="Positive-Objective"
            badge="Pragmatic · Lateral Adaptation"
            content="The student engages with social utility, public values, and practical realities. This is Dewey's pragmatic stage — the child as future citizen. Natarajan warns against Dewey's dismissal of inhibition. Inhibition is, in fact, necessary — it is the art of restraining immediate personal tendencies."
            concepts="Social utility, Community values, Lateral adaptation, Collective identity, The necessity of Inhibition"
            quote="Without inhibition, a person, even with the best education, remains a neural monster."
            colorVar="accent"
            borderColorClass="border-accent/30"
          />

          <StageCard 
            number={3}
            title="Positive-Subjective"
            badge="Idealistic · Vertical Adaptation"
            content="The final stage: sublimation of tendencies toward a future ideal. Requires a Guru — a model to emulate through persistent effort and meditation. The Guru is identified with the ideal and, in the Gurukula tradition, elevated to the status of Brahma himself."
            concepts="Gurubhakti, Meditation on the Guru's personality, Sublimation, Vertical adaptation, Persistent effort"
            quote="In the first Vedantic schools, the master or Guru was always one of those who were considered to have reached a degree of emancipation which placed them in the rank occupied by Brahma. From the cults practiced in honor of Brahma to the worship of the Guru, there was only a small step."
            colorVar="violet-accent"
            borderColorClass="border-[#7C3AED]/40"
          />
        </div>

        <div className="mt-24 pt-16 border-t border-primary/20 text-center">
          <h4 className="font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground mb-12">
            The Three Forces Acting on the Student
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-primary/10 bg-background hover:bg-card transition-colors">
              <div className="font-mono text-primary text-xl mb-4">01</div>
              <h5 className="font-serif text-xl mb-2">Mother</h5>
              <p className="font-sans text-xs text-muted-foreground">Private personal interests</p>
            </div>
            <div className="p-6 border border-primary/10 bg-background hover:bg-card transition-colors">
              <div className="font-mono text-accent text-xl mb-4">02</div>
              <h5 className="font-serif text-xl mb-2">Community / State</h5>
              <p className="font-sans text-xs text-muted-foreground">Future citizen</p>
            </div>
            <div className="p-6 border border-primary/10 bg-background hover:bg-card transition-colors">
              <div className="font-mono text-[#7C3AED] text-xl mb-4">03</div>
              <h5 className="font-serif text-xl mb-2">The Educator</h5>
              <p className="font-sans text-xs text-muted-foreground">Controlled by healthiest educational theory</p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
