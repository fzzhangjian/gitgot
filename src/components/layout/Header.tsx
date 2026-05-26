"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { useState } from "react"

export function Header() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const otherLocale = locale === "zh" ? "en" : "zh"
  const switchLabel = locale === "zh" ? "English" : "中文"
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/"

  return (
    <header className="border-b border-[var(--color-border)] bg-white sticky top-0 z-50">
      <div className="container-wide flex items-center justify-between h-16">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-bold text-xl"
          style={{ color: "var(--color-gitgot-500)" }}
        >
          <span>GitGot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href={`/${locale}`}
            className="btn-ghost text-sm"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/solutions`}
            className="btn-ghost text-sm"
          >
            {t("solutions")}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="btn-ghost text-sm"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${otherLocale}${pathWithoutLocale}`}
            className="btn-ghost text-sm"
          >
            {switchLabel}
          </Link>
        </nav>

        <button
          className="md:hidden btn-ghost text-sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white">
          <div className="container-wide py-3 flex flex-col gap-1">
            <Link
              href={`/${locale}`}
              className="btn-ghost text-sm w-full justify-start"
              onClick={() => setMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              href={`/${locale}/solutions`}
              className="btn-ghost text-sm w-full justify-start"
              onClick={() => setMenuOpen(false)}
            >
              {t("solutions")}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="btn-ghost text-sm w-full justify-start"
              onClick={() => setMenuOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href={`/${otherLocale}${pathWithoutLocale}`}
              className="btn-ghost text-sm w-full justify-start"
              onClick={() => setMenuOpen(false)}
            >
              {switchLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
