"use client"

import { useState, useEffect, useRef } from "react"

const titleWords = ["Learn", "Build", "Master", "Accelerate"]

export function DynamicTitleAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const words = [...titleWords, titleWords[0]] // Duplicate for loop

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (currentIndex === words.length - 1) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true)
          })
        })
      }, 700)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, words.length])

  return (
    <div className="overflow-hidden" style={{ height: "4rem" }}>
      <div
        className={`flex flex-col ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{
          transform: `translateY(-${currentIndex * 4}rem)`,
        }}
      >
        {words.map((word, idx) => (
          <div
            key={idx}
            style={{
              height: "4rem",
              display: "flex",
              alignItems: "center",
              paddingLeft: "0rem", // shift left
            }}
          >
            <h1
              style={{
                fontSize: "4rem", // safely fits in 4rem
                lineHeight: "5rem",
                fontWeight: 700,
                background: "linear-gradient(to right, #22d3ee, #3b82f6, #9333ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
                padding: 0,
              }}
            >
              {word}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}
