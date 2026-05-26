"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { GitFork } from "lucide-react"

export default function AdminLoginPage() {
  const t = useTranslations("admin")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/admin/solutions`,
      },
    })
    if (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-2">{t("login_title")}</h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
          {t("login_desc")}
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          <GitFork size={18} />
          {loading ? "..." : t("login_github")}
        </button>
      </div>
    </div>
  )
}
