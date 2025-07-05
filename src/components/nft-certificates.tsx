import { GlassCard } from "./ui/glass-card"
import { Award, Star, Zap } from "lucide-react"

const certificates = [
  {
    id: 1,
    title: "Smart Contract Expert",
    description: "Mastered advanced Solidity patterns",
    rarity: "Epic",
    gradient: "from-purple-500 to-pink-500",
    icon: Award,
  },
  {
    id: 2,
    title: "DeFi Pioneer",
    description: "Built and deployed DeFi protocols",
    rarity: "Rare",
    gradient: "from-blue-500 to-cyan-500",
    icon: Star,
  },
  {
    id: 3,
    title: "Web3 Builder",
    description: "Created full-stack dApps",
    rarity: "Legendary",
    gradient: "from-yellow-500 to-orange-500",
    icon: Zap,
  },
]

export function NFTCertificates() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Earn NFT Certificates</h2>
        <p className="text-white/70">Complete courses and mint unique blockchain certificates</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {certificates.map((cert) => {
          const Icon = cert.icon
          return (
            <GlassCard key={cert.id} className="p-6 group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div
                  className={`w-16 h-16 mx-auto bg-gradient-to-r ${cert.gradient} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{cert.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        cert.rarity === "Legendary"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : cert.rarity === "Epic"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {cert.rarity}
                    </span>
                  </div>
                  <p className="text-sm text-white/60">{cert.description}</p>
                </div>

                <div className="pt-2">
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div className={`bg-gradient-to-r ${cert.gradient} h-2 rounded-full`} style={{ width: "60%" }} />
                  </div>
                  <p className="text-xs text-white/50">60% progress to unlock</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
