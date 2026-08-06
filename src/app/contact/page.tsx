export default function ContactPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full relative z-10">
      <div className="glass-card p-8 rounded-2xl w-full text-center space-y-6">
        {/* Profile Image with Glowing Border */}
        <div className="relative w-36 h-36 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 animate-pulse blur-md opacity-40"></div>
          <img
            src="/profile.jpg"
            alt="Anurag"
            className="relative w-36 h-36 rounded-full border-2 border-cyan-400 object-cover shadow-[0_0_20px_rgba(0,242,254,0.3)] z-10"
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-wider font-display text-gradient-primary uppercase">
            Anurag
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Lead Developer & Creator
          </p>
          <p className="text-sm text-slate-400 leading-relaxed pt-2">
            Got questions, feedback, or custom feature requests? Feel free to reach out via my social channels!
          </p>
        </div>

        {/* Contact Links */}
        <div className="space-y-3 pt-4">
          <a
            href="https://github.com/thejynxx"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-xl transition-all duration-200 cursor-pointer gaming-btn-secondary flex items-center justify-between text-sm group"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-bold tracking-wide">GITHUB</span>
            </span>
            <span className="text-xs font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">@thejynxx</span>
          </a>

          <a
            href="https://www.instagram.com/anuraaag_13/?__pwa=1#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-xl transition-all duration-200 cursor-pointer gaming-btn-secondary flex items-center justify-between text-sm group"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-white stroke-current fill-none transition-colors" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span className="font-bold tracking-wide">INSTAGRAM</span>
            </span>
            <span className="text-xs font-mono text-slate-500 group-hover:text-fuchsia-400 transition-colors">@anuraaag_13</span>
          </a>

          <a
            href="mailto:anurag.jx@gmail.com"
            className="w-full py-3.5 px-5 rounded-xl transition-all duration-200 cursor-pointer gaming-btn-secondary flex items-center justify-between text-sm group"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-white stroke-current fill-none transition-colors" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span className="font-bold tracking-wide">EMAIL</span>
            </span>
            <span className="text-xs font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">anurag.jx@gmail.com</span>
          </a>
        </div>

        <div className="border-t border-slate-900 pt-6 text-[10px] text-slate-500 uppercase tracking-widest">
          LoyalStream &bull; Queries Panel
        </div>
      </div>
    </div>
  )
}
