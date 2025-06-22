import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "blue" | "purple"
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  const variants = {
    default: "bg-white/10 border-white/20",
    blue: "bg-blue-500/10 border-blue-400/20",
    purple: "bg-purple-500/10 border-purple-400/20",
  }

  return (
    <div
      className={cn(
        "backdrop-blur-[20px] border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}
