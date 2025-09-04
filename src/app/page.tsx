"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully");
        },
        onError: (err) => {
          toast.error("Error signing out");
          console.error("Error signing out:", err);
        },
      },
    });
    refetch();
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {session ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h1 className="text-3xl font-bold">Welcome, {session.user?.email}!</h1>
          <p className="mt-4 text-muted-foreground">You are logged in.</p>
          <Button
            variant="default"
            className="mt-6"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="relative flex flex-col min-h-screen">
          {/* Main Section */}
          <div className="flex flex-col md:flex-row items-center justify-between flex-1 px-8 md:px-16 lg:px-32">
            {/* Left Content */}
            <div className="max-w-lg text-center md:text-left">
              <h1 className="text-5xl font-bold leading-tight">
                Learn Ethereum.
                <br />
                Earn On-Chain.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                A modular, Ethereum-powered learning platform where every lesson brings you
                closer to NFTs, tokens, and on-chain proof of learning.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                  Explore Courses
                </Button>
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  Connect Wallet
                </Button>
              </div>
            </div>

            {/* Right Card */}
            <div className="mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-80 h-64 bg-pink-400 rounded-xl"></div>
                <Card className="relative w-80 h-64 rounded-xl shadow-md" />
              </div>
            </div>
          </div>

          {/* Footer Banner */}
          <div className="w-full bg-rose-50 border-t border-black py-3 text-center text-sm font-medium">
            Connect your wallet, start a course, and earn rewards as you progress.{" "}
            <span className="font-bold">Knowledge is gasless. Rewards are forever.</span>
          </div>
        </div>
      )}
    </>
  );
}
