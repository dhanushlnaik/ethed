import type { Metadata } from 'next'
import './globals.css'
import GlassNavigationBar from '@/components/GlassNavigationBar'
import Footer from "@/components/footer"

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
      <body>
        <GlassNavigationBar />
        {children}
        <Footer /> {/* Footer will now show on every page */}
      </body>
    </html>
  )
}