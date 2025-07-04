import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes, ReactNode } from "react"

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function GlassButton({ children, className, variant = "primary", size = "md", ...props }: GlassButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-white/30 text-white hover:from-cyan-500/30 hover:to-purple-500/30",
    secondary: "bg-white/10 border-white/20 text-white hover:bg-white/15",
    
    ghost: "bg-transparent border-transparent text-white hover:bg-white/10",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      className={cn(
        "backdrop-blur-[10px] border rounded-xl transition-all duration-300 ease-out font-medium",
        "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
