"use client";

import { usePathname } from "next/navigation";
import GlassNavigationBar from "@/components/GlassNavigationBar";
import Footer from "@/components/footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      {/* Only show GlassNavigationBar if NOT on the homepage */}
      {pathname !== "/" && <GlassNavigationBar />}
      {children}
      <Footer />
    </>
  );
}