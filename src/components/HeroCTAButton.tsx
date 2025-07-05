import { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'

type HeroCTAButtonProps<C extends ElementType> = {
  as?: C
  href?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<C>, 'as' | 'className' | 'children'>

export function HeroCTAButton<C extends ElementType = 'button'>({
  as,
  href,
  icon,
  children,
  className,
  ...props
}: HeroCTAButtonProps<C>) {
  const Comp = as || 'button'
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
