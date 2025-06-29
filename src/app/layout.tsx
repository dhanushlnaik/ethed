import './globals.css'
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeBackgroundWrapper from "@/components/ThemeBackgroundWrapper";
import LayoutShell from "@/components/LayoutShell";

export const metadata = {
  title: 'Eth.Ed',
  description: 'Created with Eth.Ed',
  icons: {
    icon: '/favicon.ico',
  },
};

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
            <LayoutShell>
              {children}
            </LayoutShell>
          </ThemeBackgroundWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}