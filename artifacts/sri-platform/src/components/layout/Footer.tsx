export function Footer() {
  return (
    <footer className="w-full border-t border-[#C8A84B]/20 bg-background py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C8A84B]/50" />
          <span className="font-serif text-primary text-xl tracking-widest">‹ · SRI · ›</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C8A84B]/50" />
        </div>
        <p className="font-sans text-muted-foreground text-sm tracking-wide">
          SRI Quantum Technologies · Contemplative AI Platform · February 2026
        </p>
      </div>
    </footer>
  );
}
