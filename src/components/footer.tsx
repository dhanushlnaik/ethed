import { Twitter, Linkedin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black bg-gradient-to-r from-slate-900 via-blue-950 to-black/95 backdrop-blur-md border-t border-white/20 shadow-glass mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Links */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="text-lg font-bold text-white mb-1">Eth.Ed</span>
          <nav className="flex flex-col gap-1 text-sm">
            <a href="/about" className="text-white/80 hover:text-cyan-400 transition">About Us</a>
            <a href="/community" className="text-white/80 hover:text-cyan-400 transition">Community</a>
            <a href="/contact" className="text-white/80 hover:text-cyan-400 transition">Contact</a>
            <a href="/careers" className="text-white/80 hover:text-cyan-400 transition">Careers</a>
            <a href="/privacy" className="text-white/80 hover:text-cyan-400 transition">Privacy Policy</a>
            <a href="/terms" className="text-white/80 hover:text-cyan-400 transition">Terms of Service</a>
          </nav>
        </div>
        {/* Social & Info */}
        <div className="flex flex-col gap-3 items-center md:items-end">
          <div className="flex gap-3">
            <a href="https://twitter.com/ethed" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass">
              <Twitter className="w-5 h-5 text-cyan-300" />
            </a>
            <a href="https://linkedin.com/company/ethed" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass">
              <Linkedin className="w-5 h-5 text-blue-300" />
            </a>
            <a href="https://ethed.xyz" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass">
              <Globe className="w-5 h-5 text-purple-300" />
            </a>
          </div>
          <span className="text-xs text-white/70 mt-2">
            © {new Date().getFullYear()} Eth.Ed. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}