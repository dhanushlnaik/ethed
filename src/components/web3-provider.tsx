"use client";


import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, base, polygon, arbitrum, optimism, sepolia } from "wagmi/chains";
import { http } from "viem";
import { useEffect, useMemo, useState } from "react";
import { env }  from "@/env"
const queryClient = new QueryClient();

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // build wagmi/rainbow config only on client
  const config = useMemo(
    () =>
      getDefaultConfig({
        appName: "EthEd",
        projectId: "06d5aabaf648a4f5bce6c27afe95f1f1",
        chains: [mainnet, base, polygon, arbitrum, optimism, sepolia],
        ssr: true,
        transports: {
          [mainnet.id]: http(),
          [base.id]: http(),
          [polygon.id]: http(),
          [arbitrum.id]: http(),
          [optimism.id]: http(),
          [sepolia.id]: http(),
        },
      }),
    []
  );

  if (!mounted) return null; // avoid SSR crash

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
