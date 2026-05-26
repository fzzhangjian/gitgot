"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { LogOut, Plus, List } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const [locale, setLocale] = useState<string>("zh")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("admin")

  useEffect(() => {
    const resolveParams = async () => {
      const { locale: l } = await params
      setLocale(l)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--color-gitgot-500)] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    if (typeof window !== "undefined") {
      router.push(`/${locale}/admin/login`)
    }
    return null
  }

  return (
    <div>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
        <div className="container-wide flex items-center justify-between h-12">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/admin/solutions`}
              className="btn-ghost text-xs"
            >
              <List size={14} />
              {t("solutions")}
            </Link>
            <Link
              href={`/${locale}/admin/solutions/new`}
              className="btn-ghost text-xs"
            >
              <Plus size={14} />
              {t("new_solution")}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {user.email || user.user_metadata?.user_name}
            </span>
            <button onClick={handleLogout} className="btn-ghost text-xs">
              <LogOut size={14} />
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
      <div className="container-wide py-8">{children}</div>
    </div>
  )
}
