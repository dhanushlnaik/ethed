import Link from 'next/link'

export default function GlassNavigationBar() {
  return (
    <header className="glass-nav fixed top-0 left-0 w-full z-50 px-4 md:px-10 py-3 flex items-center justify-between backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-cyan-300 tracking-widest">
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Eth.Ed</span>
      </Link>
      <nav className="hidden md:flex gap-8 text-white/80 text-base">
        <Link href="/courses" className="hover:text-cyan-300 transition">Courses</Link>
        <Link href="/progress" className="hover:text-cyan-300 transition">Progress</Link>
        <Link href="/rewards" className="hover:text-cyan-300 transition">NFTs</Link>
        <Link href="/community" className="hover:text-cyan-300 transition">Community</Link>
        <Link href="/about" className="hover:text-cyan-300 transition">About</Link>
        <Link href="/profile" className="hover:text-cyan-300 transition">Profile</Link>
      </nav>
      {/* Mobile Hamburger Placeholder */}
      <button className="md:hidden glass-button px-3 py-2 rounded-lg border border-white/20 text-white">
        <span className="sr-only">Menu</span>
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 7h20M4 14h20M4 21h20" /></svg>
      </button>
    </header>
  )
}
