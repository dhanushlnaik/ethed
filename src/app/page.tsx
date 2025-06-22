import { GlassNavigation } from "@/components/glass-navigation"
import { DynamicTitleAnimation } from "@/components/dynamic-title-animation"
import { GlassButton } from "@/components/ui/glass-button"
import { CourseProgressPanel } from "@/components/course-progress-panel"
import { EthereumDiamonds } from "@/components/ethereum-diamonds"
import { NFTCertificates } from "@/components/nft-certificates"
import { ArrowRight, Play, Users, BookOpen, Trophy } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <EthereumDiamonds />

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
  )
}
