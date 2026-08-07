export default function ContactPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 w-full relative z-10">
      <div className="contact-card">
        <div className="contact-card-inner">
          
          {/* BACK SIDE (Shown by default) */}
          <div className="contact-card-back">
            <div className="contact-card-back-content">
              {/* Profile Image with Glowing Shadow */}
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 blur-md opacity-45"></div>
                <img
                  src="/profile.jpg"
                  alt="Anurag"
                  className="relative w-32 h-32 rounded-full border-2 border-cyan-400 object-cover z-10 shadow-lg"
                />
              </div>

              {/* Title & Info */}
              <div className="space-y-1 text-center">
                <h1 className="text-2xl font-extrabold tracking-wider font-display text-gradient-primary uppercase">
                  Anurag
                </h1>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Lead Developer & Creator
                </p>
              </div>

              {/* Hover Prompt */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-fuchsia-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                </svg>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest animate-pulse">
                  Hover to Connect
                </span>
              </div>
            </div>
          </div>

          {/* FRONT SIDE (Shown on Hover) */}
          <div className="contact-card-front">
            {/* Background elements */}
            <div className="contact-img-bg">
              <div className="contact-circle contact-circle-1"></div>
              <div className="contact-circle contact-circle-2"></div>
              <div className="contact-circle contact-circle-3"></div>
            </div>

            {/* Content Container (Needs higher z-index to stay above blurs) */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-extrabold text-cyan-800 dark:text-cyan-400 bg-cyan-100/50 dark:bg-cyan-950/30 border border-cyan-300/40 dark:border-cyan-800/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Creator
                  </span>
                  <span className="text-[9px] font-extrabold text-fuchsia-800 dark:text-fuchsia-400 bg-fuchsia-100/50 dark:bg-fuchsia-950/30 border border-fuchsia-300/40 dark:border-fuchsia-800/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Lead Dev
                  </span>
                </div>
                
                <div className="text-center pt-2">
                  <h2 className="text-xl font-extrabold tracking-wider font-display text-gradient-primary uppercase">
                    Anurag
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed px-2">
                    Got questions, feedback, or custom features? Let's connect!
                  </p>
                </div>
              </div>

              {/* Social buttons */}
              <div className="space-y-2.5 my-4">
                <a
                  href="https://github.com/thejynxx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer gaming-btn-secondary flex items-center justify-between text-xs group"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="font-bold tracking-wide">GITHUB</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">@thejynxx</span>
                </a>

                <a
                  href="https://www.instagram.com/anuraaag_13/?__pwa=1#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer gaming-btn-secondary flex items-center justify-between text-xs group"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 stroke-current fill-none transition-colors" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    <span className="font-bold tracking-wide">INSTAGRAM</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">@anuraaag_13</span>
                </a>

                <a
                  href="mailto:anurag.jx@gmail.com"
                  className="w-full py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer gaming-btn-secondary flex items-center justify-between text-xs group"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 stroke-current fill-none transition-colors" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="font-bold tracking-wide">EMAIL</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">anurag.jx@gmail.com</span>
                </a>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 dark:border-slate-900 pt-3 text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
                Jynxx Builds Stuff &bull; Queries Panel
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
