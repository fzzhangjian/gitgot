'use client'

import { useEffect, useRef } from "react"
import Script from "next/script"

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || ""

export function AdSenseScript() {
  if (!PUBLISHER_ID) return null
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}

export function AdSlot({ slot, style }: { slot: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!PUBLISHER_ID || !slot) return
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch {}
  }, [slot])

  if (!PUBLISHER_ID) return null

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", ...style }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
