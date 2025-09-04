"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FaGoogle, FaGithub, FaEthereum } from "react-icons/fa";
import { toast } from "sonner";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function LoginForm() {
  const [githubPending, startGitHubPending] = useTransition();
  const [googlePending, startGooglePending] = useTransition();
  const [emailPending, startEmailPending] = useTransition();
  const [ethLoading, setEthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { address, chain, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

async function handleEthereumSignIn() {
  if (!isConnected || !address || !chain) {
    toast.error("Connect a wallet first");
    return;
  }
  setEthLoading(true);
  try {
    // 1) Get nonce
    const { data: nonceData, error: nErr } = await authClient.siwe.nonce({
      walletAddress: address,
      chainId: chain.id,
    });
    if (nErr || !nonceData?.nonce) throw new Error("Failed to fetch nonce");

    // 2) Build SIWE message (normalized for Coinbase + BetterAuth)
const siwe = new SiweMessage({
  domain: window.location.hostname, // ✅ just hostname
  address,
  statement: "Sign in with Ethereum to EIPs Insight",
  uri: window.location.origin,
  version: "1",
  chainId: Number(chain.id), // ✅ ensure it's a number
  nonce: String(nonceData.nonce), // ✅ must be alphanumeric, >= 8 chars
});


    const message = siwe.prepareMessage();
    console.log("SIWE message:\n", message, "\nLines:", message.split("\n").length);

    // 3) Sign
    const signature = await signMessageAsync({ message });

    // 4) Verify session
    const { error } = await authClient.siwe.verify({
      message,
      signature,
      walletAddress: address,
      chainId: chain.id,
    });

    if (error) throw error;
    toast.success("Signed in with Ethereum!");
    router.push("/");
  } catch (err: any) {
    toast.error(err?.message ?? "Ethereum sign-in failed");
    console.error(err);
  } finally {
    setEthLoading(false);
  }
}


  async function signInWithGitHub() {
    startGitHubPending(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with GitHub!");
          },
          onError: (error) => {
            toast.error(`GitHub sign-in error: ${error.error.message}`);
          },
        },
      });
    });
  }

  async function signInWithGoogle() {
    startGooglePending(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onError: (error) => {
            toast.error(`Google sign-in error: ${error.error.message}`);
          },
        },
      });
    });
  }

  async function signInWithEmail() {
    startEmailPending(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification email sent!");
            router.push(`/verify-request?email=${email}`);
          },
          onError: (error) => {
            toast.error(`Email OTP error: ${error.error.message}`);
          },
        },
      });
    });
  }





  return (
    <Card className="bg-white dark:bg-[#093a3e] w-full text-center">
        <Image
          alt="Ethed Logo"
          src="/logos/logo.png"
          width={200}
          height={200}
          className="mb-2"
        />

      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-extrabold uppercase text-[#093a3e] dark:text-[#f8f6f2]">
          Welcome Back!
        </CardTitle>
        <CardDescription className="text-base text-[#093a3e]/80 dark:text-[#f8f6f2]/80">
          Please log in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-0">
        {/* GitHub */}
        <Button disabled={githubPending} onClick={signInWithGitHub} className="w-full flex gap-2">
          {githubPending ? <Loader className="h-5 w-5 animate-spin" /> : <FaGithub className="h-5 w-5" />}
          Continue with GitHub
        </Button>

        {/* Google */}
        <Button disabled={googlePending} onClick={signInWithGoogle} className="w-full flex gap-2">
          {googlePending ? <Loader className="h-5 w-5 animate-spin" /> : <FaGoogle className="h-5 w-5" />}
          Continue with Google
        </Button>


        {/* WalletConnect */}
        <div className="flex flex-col gap-2">
          <ConnectButton
            accountStatus="address"
            chainStatus="icon"
            showBalance={false}
          />
          {isConnected && (
            <Button
              onClick={handleEthereumSignIn}
              disabled={ethLoading}
              className="w-full flex gap-2 bg-[#129490] hover:bg-[#0f7d79] text-white"
            >
              {ethLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FaEthereum className="h-5 w-5" />
              )}
              Continue with Ethereum
            </Button>
          )}
        </div>

        {/* Divider */}
        <div className="relative text-center text-sm text-black uppercase font-bold my-2">
          <div className="absolute inset-0 top-1/2 border-t border-black dark:border-[#129490]" />
          <span className="relative z-10 bg-white dark:bg-[#093a3e] px-3">
            Or continue with email
          </span>
        </div>

        {/* Email */}
        <div className="grid gap-4 text-left">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-semibold text-[#093a3e] dark:text-[#f8f6f2]">
              Email Address
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-[#f8f6f2] dark:bg-[#093a3e]"
              required
            />
          </div>
          <Button onClick={signInWithEmail} disabled={emailPending} className="w-full flex gap-2">
            {emailPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="size-4" />}
            Continue with Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
