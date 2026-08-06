"use client"

import { signIn, signOut } from "next-auth/react"

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 cursor-pointer gaming-btn"
    >
      Sign in with Google
    </button>
  )
}

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer gaming-btn-secondary text-sm font-semibold"
    >
      Sign Out
    </button>
  )
}
