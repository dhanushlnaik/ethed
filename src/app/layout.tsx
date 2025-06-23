import type { Metadata } from 'next'
import './globals.css'
import GlassNavigationBar from '@/components/GlassNavigationBar'
import Footer from "@/components/footer"
import AnimatedWeb3Background from "../components/AnimatedWeb3Background"
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ background: "transparent" }}>
        <ThemeProvider>
          <div
            style={{
              position: "fixed",
              zIndex: 0,
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              pointerEvents: "none",
            }}
          >
            <AnimatedWeb3Background />
          </div>
          <GlassNavigationBar />
          {/* Place ThemeToggle in the top-right corner */}
          <div
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <ThemeToggle />
          </div>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}