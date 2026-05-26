import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "GitGot - 发现开源项目的正确组合",
    template: "%s | GitGot",
  },
  description:
    "从互联网博主的实战经验中，整理 GitHub 开源项目的最佳组合方案。Curated open-source project combinations from creators across the internet.",
  openGraph: {
    title: "GitGot",
    description:
      "发现 GitHub 开源项目的正确组合 — Discover the right GitHub open source combinations.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
