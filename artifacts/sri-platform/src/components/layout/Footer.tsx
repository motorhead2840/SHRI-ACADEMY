import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="w-full bg-stone-50 border-t border-stone-200 py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-amber-400 flex items-center justify-center">
                <span className="font-serif text-xs font-bold text-amber-900">S</span>
              </div>
              <span className="font-sans text-base font-bold text-stone-800">
                SRI <span className="text-amber-500">Learn</span>
              </span>
            </div>
            <p className="font-sans text-sm text-stone-500 leading-relaxed mb-3">
              Where Vedantic wisdom meets global homeschooling — a contemplative AI platform for every learner.
            </p>
            <p className="font-mono text-xs text-stone-400 uppercase tracking-wider">Blueprint v1.0 · February 2026</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/architecture", label: "Architecture" },
                { href: "/pedagogy", label: "Pedagogy" },
                { href: "/blueprint", label: "Blueprint" },
                { href: "/pitch", label: "Investment Pitch" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-sm text-stone-500 hover:text-amber-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Technology</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/token",  label: "SARA Token",    color: "text-amber-500" },
                { href: "/abhaya", label: "Abhaya Gate",   color: "text-emerald-600" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className={`font-sans text-sm font-semibold ${l.color} hover:underline transition-colors`}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li><div className="w-full h-px bg-stone-200 my-1" /></li>
              {[
                { href: "/login/school",   label: "School Portal",   color: "text-blue-500" },
                { href: "/login/parent",   label: "Parent Portal",   color: "text-amber-500" },
                { href: "/login/student",  label: "Student Portal",  color: "text-emerald-500" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className={`font-sans text-sm ${l.color} hover:underline transition-colors`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SRI Quantum */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">SRI Quantum</h4>
            <p className="font-sans text-sm text-stone-500 leading-relaxed mb-3">
              SRI Quantum Technologies<br />
              Contemplative AI Platform<br />
              Patent Filing · February 2026
            </p>
            <div className="inline-block bg-[#0B0F2E] border border-amber-400/30 px-3 py-1.5">
              <span className="font-mono text-xs text-[#E8C66A]">Ω-Manifold V3.0</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-stone-400">
            © 2026 SRI Quantum Technologies. All rights reserved.
          </p>
          <p className="font-mono text-xs text-stone-400">
            Made with <span className="text-amber-400">♥</span> for global learners
          </p>
        </div>
      </div>
    </footer>
  );
}
