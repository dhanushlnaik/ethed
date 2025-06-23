import type { Metadata } from 'next'
import './globals.css'
import GlassNavigationBar from '@/components/GlassNavigationBar'
import Footer from "@/components/footer"
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeBackgroundWrapper from "@/components/ThemeBackgroundWrapper";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ThemeBackgroundWrapper>
            <GlassNavigationBar />
            {children}
            <Footer />
          </ThemeBackgroundWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}