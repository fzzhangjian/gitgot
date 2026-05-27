"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

export function Header() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const pathname = usePathname()

  const otherLocale = locale === "zh" ? "en" : "zh"
  const switchLabel = locale === "zh" ? "English" : "中文"
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/"

  const navItems = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/solutions`, label: t("solutions") },
    { href: `/${locale}/about`, label: t("about") },
  ]

  return (
    <header className="border-b border-[var(--color-border)] bg-white sticky top-0 z-50">
      <div className="container-wide flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="GitGot"
              width={120}
              height={39}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? "text-[var(--color-gitgot-600)] bg-[var(--color-gitgot-50)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-gitgot-600)] hover:bg-[var(--color-gitgot-50)]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <Link
          href={`/${otherLocale}${pathWithoutLocale}`}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 text-[var(--color-text-secondary)] hover:text-[var(--color-gitgot-600)] hover:bg-[var(--color-gitgot-50)]"
        >
          {switchLabel}
        </Link>
      </div>
    </header>
  )
}
