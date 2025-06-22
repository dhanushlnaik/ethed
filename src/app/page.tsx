'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideChevronRight } from 'lucide-react'
import GlassNavigationBar from '@/components/GlassNavigationBar'
import HeroCTAButton from '@/components/HeroCTAButton'
import CourseProgressPanel from '@/components/CourseProgressPanel'
import EthereumDiamondDecorations from '@/components/EthereumDiamondDecorations'
import NFTCertificateCards from '@/components/NFTCertificateCards'
import GlassProgressBars from '@/components/GlassProgressBars'

// DYNAMIC TITLE ANIMATION LOGIC
const titleWords = ['Learn', 'Build', 'Master', 'Accelerate']

function DynamicTitleAnimation() {
  const [index, setIndex] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % titleWords.length), 2000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="h-16 overflow-hidden flex flex-col justify-center">
      <motion.h1
        key={index}
        className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {titleWords[index]}
      </motion.h1>
    </div>
  )
}

// HOMEPAGE MAIN
export default function Homepage() {
  // Mock data for illustration. Replace with your actual data fetching.
  const currentCourses = [
    { id: 'eth101', title: 'Ethereum Basics', progress: 0.8 },
    { id: 'nft', title: 'NFTs & Digital Art', progress: 0.35 },
  ]
  const progressData = [
    { label: 'Courses Completed', value: 2, max: 8 },
    { label: 'Hours Learned', value: 12, max: 40 },
    { label: 'NFTs Earned', value: 1, max: 10 },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-charcoal via-blue-950 to-black overflow-x-hidden">
      {/* Decorative floating ethereum diamonds */}
      <EthereumDiamondDecorations />

      {/* Sticky glass navigation bar */}
      <GlassNavigationBar />

      {/* HERO SECTION */}
      <main className="relative w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-28 md:pt-32 pb-16 md:pb-24 z-10">
        {/* LEFT: HERO */}
        <section className="flex-1 flex flex-col items-start gap-8 z-10">
          <DynamicTitleAnimation />
          <p className="text-lg md:text-2xl text-white/80 max-w-xl mt-2">
            The modern Web3 learning hub. Interactive courses, NFT certificates, and a community for the next generation of blockchain innovators.
          </p>
          <HeroCTAButton
            as={Link}
            href="/courses"
            className="mt-4"
            icon={<LucideChevronRight className="ml-2 h-5 w-5" />}
          >Explore Courses</HeroCTAButton>
          <div className="flex gap-4 mt-8">
            <GlassProgressBars data={progressData} />
          </div>
        </section>
        {/* RIGHT: COURSE PANEL */}
        <aside className="flex-1 flex flex-col items-end w-full md:w-auto md:max-w-xs z-10 mt-12 md:mt-0">
          <CourseProgressPanel courses={currentCourses} />
        </aside>
      </main>

      {/* NFT Certificates Showcase */}
      <div className="w-full flex justify-center mt-8 md:mt-16 px-4">
        <NFTCertificateCards />
      </div>

      {/* Floating background effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
      >
        {/* subtle glass gradients, overlays for effect */}
        <div className="absolute top-0 left-1/3 w-1/2 h-1/3 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 blur-2xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/4 bg-gradient-to-tl from-blue-400/10 via-purple-400/10 to-cyan-400/5 blur-2xl rounded-full" />
      </div>
    </div>
  )
}
