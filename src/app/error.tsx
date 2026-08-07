"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto w-full relative z-10">
      <main className="my-custom-face-container mb-8">
        <svg className="face" viewBox="0 0 320 380">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="25"
          >
            <g className="face__eyes" transform="translate(0,112.5)">
              <g transform="translate(15,0)">
                <polyline className="face__eye-lid" points="37,0 0,120 75,120"></polyline>
                <polyline
                  className="face__pupil"
                  points="55,120 55,155"
                  strokeDasharray="35 35"
                ></polyline>
              </g>
              <g transform="translate(230,0)">
                <polyline className="face__eye-lid" points="37,0 0,120 75,120"></polyline>
                <polyline
                  className="face__pupil"
                  points="55,120 55,155"
                  strokeDasharray="35 35"
                ></polyline>
              </g>
            </g>
            <rect
              className="face__nose"
              x="132.5"
              y="112.5"
              width="55"
              height="155"
              rx="4"
              ry="4"
            ></rect>
            <g transform="translate(65,334)" strokeDasharray="102 102">
              <path className="face__mouth-left" d="M 0 30 C 0 30 40 0 95 0"></path>
              <path className="face__mouth-right" d="M 95 0 C 150 0 190 30 190 30"></path>
            </g>
          </g>
        </svg>
      </main>

      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-wider font-display text-gradient-primary uppercase">
          500 - SYSTEM CRASH
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          An unexpected glitch occurred in the live tracking stream algorithm. Let's try rebooting the connection.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl text-white font-bold text-xs transition-all duration-200 gaming-btn cursor-pointer inline-flex items-center gap-2"
          >
            Reboot / Retry
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer gaming-btn-secondary font-bold text-xs inline-flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            Return to Base
          </Link>
        </div>
      </div>
    </div>
  )
}
