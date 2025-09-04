import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Web3Provider from "@/components/web3-provider";

const exo2 = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-exo2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EIPsInsight",
  description: "Ethereum Improvement Proposals simplified",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }} suppressHydrationWarning>
      <body className={`${exo2.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>\
          <Web3Provider>
        {children}
        </Web3Provider>
        <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}