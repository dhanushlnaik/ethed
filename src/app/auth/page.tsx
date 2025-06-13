'use client'

import { useAccount, useSignMessage, useChainId } from "wagmi"
import { SiweMessage } from "siwe"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function SignInButton() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!isConnected || !address || !chainId) {
      setError("Wallet not connected properly.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch CSRF nonce from next-auth (required for credentials provider)
      const res = await fetch("/api/auth/csrf")
      const { csrfToken } = await res.json()

      if (!csrfToken) throw new Error("Failed to fetch CSRF token.")

      // Build SIWE message
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chainId,
        nonce: csrfToken,
      })

      // Sign SIWE message
      const signature = await signMessageAsync({
        message: siweMessage.prepareMessage(),
      })

      // Sign in using NextAuth credentials provider
      const response = await signIn("credentials", {
        message: JSON.stringify(siweMessage),
        signature,
        redirect: true,
        callbackUrl: "/",
      })

      if (!response?.ok) {
        throw new Error("Authentication failed.")
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Unknown error occurred.")
      }
      console.error("[SIWE Login Error]:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleLogin}
        disabled={loading || !isConnected}
        className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Signing In..." : "Sign-In with Ethereum"}
      </button>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
}
