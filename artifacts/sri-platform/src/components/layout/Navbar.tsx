import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/architecture", label: "Architecture" },
    { href: "/pedagogy", label: "Pedagogy" },
    { href: "/blueprint", label: "Blueprint" },
    { href: "/pitch", label: "Pitch" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05071A]/80 backdrop-blur-md border-b border-[#C8A84B]/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-serif text-2xl text-primary font-semibold tracking-widest cursor-pointer" data-testid="link-logo">
            SRI
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                location === link.href ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <span className="font-mono text-xs text-accent uppercase tracking-wider border border-accent/30 px-2 py-1 rounded-sm bg-accent/5">
            Blueprint v1.0
          </span>
        </div>
      </div>
    </nav>
  );
}
