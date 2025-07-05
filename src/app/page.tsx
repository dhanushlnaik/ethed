import { GlassNavigation } from "@/components/glass-navigation"
import { DynamicTitleAnimation } from "@/components/dynamic-title-animation"
import { GlassButton } from "@/components/ui/glass-button"
import { CourseProgressPanel } from "@/components/course-progress-panel"
import { NFTCertificates } from "@/components/nft-certificates"
import { ArrowRight, Play, Users, BookOpen, Trophy } from "lucide-react"
import Link from "next/link"
// If the file is actually named 'HeroCtaButton.tsx' (PascalCase), update the import:
import { HeroCTAButton } from "@/components/HeroCTAButton"
// Or, if the file is named differently, adjust the path and casing accordingly.
// If the file does not exist, create it at 'src/components/ui/HeroCtaButton.tsx' and export HeroCTAButton from it.
import AnimatedWeb3Background from "@/components/AnimatedWeb3Background"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Purple background is set via CSS on body */}
      <div
        style={{
          position: "fixed",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        <AnimatedWeb3Background />
      </div>
      {/* Your main content */}
      <div className="relative z-10">
        {/* Navigation */}
        <GlassNavigation />

        {/* Main Content */}
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left Hero Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <DynamicTitleAnimation />
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white">Web3 Development</h2>
                  <p className="text-lg md:text-xl text-white/70 max-w-2xl">
                    Master blockchain development with hands-on courses, earn NFT certificates, and join the future of
                    decentralized technology.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <GlassButton variant="primary" size="lg" className="group">
                    Start Learning
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </GlassButton>

                  <GlassButton variant="secondary" size="lg" className="group">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </GlassButton>

                  <HeroCTAButton
                    as={Link}
                    href="/courses"
                    className="flex items-center justify-center gap-2"
                  >
                    Explore Courses
                  </HeroCTAButton>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8 pt-8">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span className="text-white/80">10K+ Students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span className="text-white/80">50+ Courses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80">NFT Rewards</span>
                  </div>
                </div>
              </div>

              {/* Right Progress Panel */}
              <div className="lg:pl-8">
                <CourseProgressPanel />
              </div>
            </div>
          </section>

          {/* NFT Certificates Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
            <NFTCertificates />
          </section>
        </main>
      </div>
    </div>
  )
}
