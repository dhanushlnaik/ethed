import type { Metadata } from 'next'
import './globals.css'
import GlassNavigationBar from '@/components/GlassNavigationBar'
import Footer from "@/components/footer"
import AnimatedWeb3Background from "../components/AnimatedWeb3Background"

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body style={{ background: "transparent" }}>
        <AnimatedWeb3Background
          style={{
            position: "fixed",
            zIndex: 0,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
          }}
        />
        <GlassNavigationBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}