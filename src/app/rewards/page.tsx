"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, CheckCircle, BadgeCheck, Link2, Download, Share2, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import classNames from "classnames";

// --- Types ---
interface CertificateAttribute {
  trait_type: string;
  value: string;
}
interface NFTCertificate {
  tokenId: string;
  courseName: string;
  completionDate: Date;
  blockchainHash: string;
  imageUrl: string;
  attributes: CertificateAttribute[];
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
}
interface WalletConnection {
  address: string;
  network: string;
  balance: number;
  connected: boolean;
}

// --- Sample Data ---
const sampleCertificates: NFTCertificate[] = [
  {
    tokenId: "0xA1B2C3",
    courseName: "Ethereum Fundamentals",
    completionDate: new Date("2025-06-12"),
    blockchainHash: "0xabc123def456",
    imageUrl: "/images/certificates/eth-fundamentals-nft.png",
    attributes: [
      { trait_type: "Level", value: "Beginner" },
      { trait_type: "Rarity", value: "Common" }
    ],
    rarity: "Common"
  },
  {
    tokenId: "0xD4E5F6",
    courseName: "DeFi Protocol Design",
    completionDate: new Date("2025-06-16"),
    blockchainHash: "0xdef789abc123",
    imageUrl: "/images/certificates/defi-protocol-nft.png",
    attributes: [
      { trait_type: "Level", value: "Advanced" },
      { trait_type: "Rarity", value: "Epic" }
    ],
    rarity: "Epic"
  },
  {
    tokenId: "0x1A2B3C",
    courseName: "NFT Marketplace Creation",
    completionDate: new Date("2025-06-19"),
    blockchainHash: "0x789abc456def",
    imageUrl: "/images/certificates/nft-marketplace-nft.png",
    attributes: [
      { trait_type: "Level", value: "Intermediate" },
      { trait_type: "Rarity", value: "Rare" }
    ],
    rarity: "Rare"
  }
];

const sampleWallet: WalletConnection = {
  address: "0x1234...ABCD",
  network: "Polygon",
  balance: 1.23,
  connected: true
};

const badgeData = [
  {
    id: "b1",
    name: "Early Bird",
    desc: "Completed a course within 24h of release",
    unlocked: true,
    icon: <BadgeCheck className="w-6 h-6 text-cyan-400" />,
    progress: 1,
    requirement: 1
  },
  {
    id: "b2",
    name: "NFT Collector",
    desc: "Mint 3 NFT certificates",
    unlocked: false,
    icon: <BadgeCheck className="w-6 h-6 text-purple-400" />,
    progress: 2,
    requirement: 3
  },
  {
    id: "b3",
    name: "DeFi Adventurer",
    desc: "Complete all DeFi courses",
    unlocked: false,
    icon: <BadgeCheck className="w-6 h-6 text-yellow-400" />,
    progress: 1,
    requirement: 4
  }
];

// --- Glass Components ---
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={classNames(
        "rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-glass p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
function GlassButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        "backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold rounded-lg px-4 py-2 shadow transition hover:bg-blue-400/20 hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Rarity Badge ---
function RarityBadge({ rarity }: { rarity: NFTCertificate["rarity"] }) {
  const colorMap = {
    Common: "bg-cyan-400/30 text-cyan-300 border-cyan-400/40",
    Rare: "bg-blue-400/30 text-blue-300 border-blue-400/40",
    Epic: "bg-purple-400/30 text-purple-300 border-purple-400/40",
    Legendary: "bg-yellow-400/30 text-yellow-200 border-yellow-400/40"
  } as const;
  return (
    <span className={classNames(
      "px-3 py-1 rounded-full text-xs font-bold border shadow-glass backdrop-blur-md",
      colorMap[rarity]
    )}>{rarity}</span>
  );
}

// --- 3D NFT Card ---
function NFTCard({ cert }: { cert: NFTCertificate }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      className="group perspective"
      style={{ perspective: "1200px", minHeight: 300 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      tabIndex={0}
    >
      <motion.div
        className="relative w-full h-64 transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-glass flex flex-col items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={cert.imageUrl} alt={cert.courseName} className="w-40 h-40 object-cover rounded-xl mb-3 glass-hover" />
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">{cert.courseName}</h3>
            <RarityBadge rarity={cert.rarity} />
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-glass flex flex-col items-center justify-center px-4 py-6"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <span className="text-xs text-white/60 mb-1">Certified {cert.completionDate.toLocaleDateString()}</span>
          <div className="mb-2">
            {cert.attributes.map((attr) => (
              <span key={attr.trait_type} className="inline-block bg-white/10 border border-white/20 text-xs text-cyan-200 px-2 py-1 rounded-full mr-2 mb-1">{attr.trait_type}: {attr.value}</span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <a href={`https://etherscan.io/tx/${cert.blockchainHash}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <GlassButton className="flex gap-1 items-center text-xs px-3 py-1">
                <Link2 className="w-4 h-4" /> View on chain
              </GlassButton>
            </a>
            <GlassButton className="flex gap-1 items-center text-xs px-3 py-1">
              <Download className="w-4 h-4" /> Download
            </GlassButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Wallet Connect Panel ---
function WalletStatusPanel({ wallet }: { wallet: WalletConnection }) {
  return (
    <GlassCard className="flex flex-col items-center gap-2 w-full md:w-auto">
      <div className="flex gap-2 items-center">
        <Wallet className={classNames("w-7 h-7", wallet.connected ? "text-cyan-400" : "text-gray-400 animate-pulse")} />
        <span className={classNames("text-lg font-bold", wallet.connected ? "text-cyan-300" : "text-gray-400")}>
          {wallet.connected ? "Connected" : "Not Connected"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-white/70 text-sm">
        Network: <span className="font-bold text-purple-300">{wallet.network}</span>
        <span className="ml-2">|</span>
        <span>Balance: <span className="text-cyan-300 font-semibold">{wallet.balance} ETH</span></span>
      </div>
      <GlassButton>
        {wallet.connected ? "Disconnect" : "Connect Wallet"}
      </GlassButton>
    </GlassCard>
  );
}

// --- Certification Timeline ---
function CertificationTimeline({ certificates }: { certificates: NFTCertificate[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <GlassCard>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">Certification Timeline</h3>
        <button onClick={() => setExpanded(e => !e)} className="text-cyan-200 text-xs flex items-center gap-1">
          {expanded ? <>Collapse <ChevronUp className="w-4 h-4" /></> : <>Expand <ChevronDown className="w-4 h-4" /></>}
        </button>
      </div>
      <div className="relative ml-3 border-l-2 border-cyan-400/30 pl-5">
        {certificates.map((c, idx) => (
          <motion.div
            key={c.tokenId}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="mb-7 last:mb-0"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="font-bold text-white">{c.courseName}</span>
              <RarityBadge rarity={c.rarity} />
            </div>
            {expanded && (
              <div className="ml-9 mt-1 text-xs text-white/70">
                {c.completionDate.toLocaleDateString()}<br />
                Token: <span className="font-mono text-cyan-300">{c.tokenId}</span>
              </div>
            )}
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: certificates.length * 0.09 } }}
          className="ml-2 mt-4 flex items-center gap-3"
        >
          <ArrowRight className="w-5 h-5 text-cyan-400 animate-bounce" />
          <span className="text-sm text-white/60">Next: NFT Security Expert (in progress)</span>
        </motion.div>
      </div>
    </GlassCard>
  );
}

// --- Blockchain Panel (Wallet, Transactions, Network) ---
function BlockchainPanel({ wallet }: { wallet: WalletConnection }) {
  const [showTx, setShowTx] = useState(false);
  const [gasEstimate] = useState(0.0012);

  return (
    <GlassCard>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-white">Blockchain Integration</span>
          <GlassButton className="text-xs px-3 py-1">Switch Network</GlassButton>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Wallet className={classNames("w-5 h-5", wallet.connected ? "text-cyan-400" : "text-gray-400 animate-pulse")} />
          <span className="text-cyan-200 font-mono">{wallet.address}</span>
          <span className="bg-white/10 text-purple-300 px-3 py-1 rounded-full text-xs font-medium ml-auto border border-purple-400/20">
            {wallet.network}
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
          <span>Balance:</span>
          <span className="font-bold text-cyan-300">{wallet.balance} ETH</span>
          <span className="ml-2">|</span>
          <span>Gas (mint): <span className="font-mono text-yellow-300">{gasEstimate} ETH</span></span>
        </div>
        <GlassButton className="w-full mt-2 flex gap-2 items-center" onClick={() => setShowTx(t => !t)}>
          {showTx ? <>Hide Tx History <ChevronUp className="w-4 h-4" /></> : <>Show Tx History <ChevronDown className="w-4 h-4" /></>}
        </GlassButton>
        <AnimateTxHistory show={showTx} />
      </div>
    </GlassCard>
  );
}
function AnimateTxHistory({ show }: { show: boolean }) {
  const txs = [
    { hash: "0xab12...dEf3", amount: "0.0012", type: "Mint", status: "Success", date: "2025-06-19" },
    { hash: "0xcd34...aBc1", amount: "0.0009", type: "Transfer", status: "Pending", date: "2025-06-18" }
  ];
  if (!show) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
      <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden text-xs">
        <table className="w-full">
          <thead>
            <tr className="text-cyan-200">
              <th className="p-2 text-left">Tx Hash</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Type</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((tx) => (
              <tr key={tx.hash} className="text-white/80 border-t border-white/10">
                <td className="p-2 font-mono">{tx.hash}</td>
                <td className="p-2">{tx.amount} ETH</td>
                <td className="p-2">{tx.type}</td>
                <td className={classNames("p-2 font-bold", tx.status === "Success" ? "text-green-400" : "text-yellow-400")}>{tx.status}</td>
                <td className="p-2">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// --- Achievement Badges ---
function AchievementBadges() {
  return (
    <GlassCard>
      <h3 className="text-lg font-semibold text-white mb-4">Achievement Badges</h3>
      <div className="flex flex-wrap gap-7">
        {badgeData.map(badge => (
          <motion.div
            key={badge.id}
            className={classNames(
              "min-w-[170px] flex flex-col items-center justify-center gap-2 bg-white/10 rounded-2xl border border-white/15 p-4 shadow-glass group",
              badge.unlocked && "animate-bounce"
            )}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05, rotate: badge.unlocked ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={classNames("mb-1", badge.unlocked ? "text-cyan-400" : "text-gray-400")}>
              {badge.icon}
            </div>
            <span className={classNames("font-bold text-white", badge.unlocked ? "" : "opacity-70")}>{badge.name}</span>
            <span className="text-xs text-white/80 mb-2 text-center">{badge.desc}</span>
            <div className="w-full h-2 bg-white/15 rounded-full mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(badge.progress / badge.requirement) * 100}%` }}
                transition={{ duration: 1 }}
                className={classNames(
                  "h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400"
                )}
              />
            </div>
            <span className="text-xs text-white/60">{badge.progress} / {badge.requirement}</span>
            {badge.unlocked && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 3 }}
                className="mt-2 px-3 py-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white rounded-full text-xs flex gap-1 items-center shadow-glass"
              >
                <Share2 className="w-4 h-4" /> Share
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

// --- Main Rewards Page ---
export default function RewardsPage() {
  // Simulated wallet state (replace with real web3 hooks)
  const [wallet] = useState<WalletConnection>(sampleWallet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black pb-20 overflow-x-hidden pt-20">
      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-5">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <GlassCard className="flex flex-col items-center gap-3 min-w-[220px]">
            <span className="font-bold text-lg text-white">NFT Certificates</span>
            <span className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {sampleCertificates.length}
            </span>
            <span className="text-sm text-white/70">Total earned</span>
          </GlassCard>
          <WalletStatusPanel wallet={wallet} />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <div className="flex gap-6 flex-wrap">
          <GlassCard className="flex items-center gap-3 px-4 py-3">
            <span className="text-white/80">Network:</span>
            <span className="font-bold text-purple-300">{wallet.network}</span>
          </GlassCard>
          <GlassCard className="flex items-center gap-3 px-4 py-3">
            <span className="text-white/80">Wallet:</span>
            <span className="font-mono text-cyan-200">{wallet.connected ? wallet.address : "Not connected"}</span>
          </GlassCard>
        </div>
      </section>
      {/* NFT Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <h2 className="text-2xl font-bold text-white mb-5">Your NFT Certificates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCertificates.map(cert => (
            <NFTCard key={cert.tokenId} cert={cert} />
          ))}
        </div>
      </section>
      {/* Achievement Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <AchievementBadges />
      </section>
      {/* Certification Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <CertificationTimeline certificates={sampleCertificates} />
      </section>
      {/* Blockchain Integration Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <BlockchainPanel wallet={wallet} />
      </section>
    </div>
  );
}