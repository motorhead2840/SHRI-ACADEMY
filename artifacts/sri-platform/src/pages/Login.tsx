import { Link } from "wouter";
import { motion } from "framer-motion";

const portals = [
  {
    id: "school",
    href: "/login/school",
    icon: "🏫",
    title: "Schools",
    subtitle: "Institution Portal",
    description: "Manage curriculum, track student cohorts, and coordinate with families — all in one place.",
    features: ["Cohort management", "Curriculum builder", "Parent communication", "Progress analytics"],
    color: "blue" as const,
  },
  {
    id: "parent",
    href: "/login/parent",
    icon: "🏠",
    title: "Parents",
    subtitle: "Family Portal",
    description: "Guide your child's learning journey, track milestones, and connect with their teachers.",
    features: ["Learning roadmap", "Daily schedule", "Teacher messaging", "Progress reports"],
    color: "amber" as const,
  },
  {
    id: "student",
    href: "/login/student",
    icon: "🎓",
    title: "Students",
    subtitle: "Learner Portal",
    description: "Start your learning adventure. Explore lessons, complete quests, and celebrate your growth.",
    features: ["Interactive lessons", "Learning quests", "Achievements", "Study buddy chat"],
    color: "emerald" as const,
  },
];

const colorMap = {
  blue:    { border: "border-blue-200 hover:border-blue-400",   accent: "text-blue-600",   badge: "bg-blue-50 text-blue-600 border-blue-200",   btn: "bg-blue-500 hover:bg-blue-600 text-white",    dot: "bg-blue-400" },
  amber:   { border: "border-amber-200 hover:border-amber-400", accent: "text-amber-600",  badge: "bg-amber-50 text-amber-600 border-amber-200", btn: "bg-amber-400 hover:bg-amber-500 text-amber-900", dot: "bg-amber-400" },
  emerald: { border: "border-emerald-200 hover:border-emerald-400", accent: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", btn: "bg-emerald-500 hover:bg-emerald-600 text-white", dot: "bg-emerald-400" },
};

export default function Login() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="text-center mb-16">
        <h1 className="font-serif text-6xl text-foreground mb-4">
          Welcome to <span className="text-primary">SRI Learn</span>
        </h1>
        <p className="font-sans text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Your global home-learning platform. Choose your portal to get started.
        </p>
      </motion.div>

      {/* ── Portal cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {portals.map((p, i) => {
          const c = colorMap[p.color];
          return (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}>
              <div className={`group relative bg-card border-2 ${c.border} p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col`}>
                {/* Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 border ${c.badge}`}>
                    {p.subtitle}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                </div>

                {/* Icon + title */}
                <div className="text-4xl mb-3">{p.icon}</div>
                <h2 className={`font-serif text-3xl ${c.accent} mb-2`}>{p.title}</h2>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">{p.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-8 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 font-sans text-sm text-foreground/70">
                      <span className={`w-1 h-4 ${c.dot} shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={p.href}
                  className={`w-full py-3.5 font-sans font-bold text-sm text-center uppercase tracking-[0.12em] transition-all duration-200 shadow-sm group-hover:shadow-md ${c.btn}`}>
                  Sign in as {p.title.slice(0, -1)} →
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-center font-sans text-sm text-stone-400">
        New to SRI Learn?{" "}
        <a href="#" className="text-primary font-semibold hover:underline">Request access</a>
        {" "}or contact your school administrator.
      </motion.p>
    </div>
  );
}
