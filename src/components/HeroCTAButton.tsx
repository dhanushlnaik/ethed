import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface HeroCTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: any
  href?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export default function HeroCTAButton({ as: Comp = 'button', href, icon, children, className, ...props }: HeroCTAButtonProps) {
  const classes = clsx(
    "glass-button flex items-center px-6 py-3 rounded-xl font-semibold text-lg shadow-md border border-white/30 text-cyan-100 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:border-cyan-300/40",
    className
  )
  return (
    <Comp href={href} className={classes} {...props}>
      {children}
      {icon}
    </Comp>
  )
}
