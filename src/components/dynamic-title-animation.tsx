"use client"

import { useState, useEffect } from "react"

const titleWords = ["Learn", "Build", "Master", "Accelerate"]

export function DynamicTitleAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % titleWords.length)
        setIsAnimating(false)
      }, 250)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-20 overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-500 ease-out ${
          isAnimating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          {titleWords[currentIndex]}
        </h1>
      </div>
      <div
        className={`absolute inset-0 transition-transform duration-500 ease-out ${
          isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          {titleWords[(currentIndex + 1) % titleWords.length]}
        </h1>
      </div>
    </div>
  )
}
