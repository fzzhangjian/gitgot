"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, ExternalLink, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Solution } from "@/lib/types"

export default function AdminSolutionsPage() {
  const t = useTranslations("admin")
  const router = useRouter()
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [locale, setLocale] = useState("zh")

  useEffect(() => {
    setLocale(window.location.pathname.split("/")[1])
  }, [])

  useEffect(() => {
    if (!locale) return
    const fetch = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("solutions")
        .select("*, category:categories(*)")
        .order("created_at", { ascending: false })

      if (!error && data) setSolutions(data as Solution[])
      setLoading(false)
    }
    fetch()
  }, [locale])

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirm_delete"))) return
    const supabase = createClient()
    const { error } = await supabase.from("solutions").delete().eq("id", id)
    if (!error) setSolutions(solutions.filter((s) => s.id !== id))
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--color-gitgot-500)] border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("solutions")}</h1>
        <Link
          href={`/${locale}/admin/solutions/new`}
          className="btn-primary text-sm"
        >
          <Plus size={16} />
          {t("new_solution")}
        </Link>
      </div>

      <div className="space-y-3">
        {solutions.map((solution) => (
          <div
            key={solution.id}
            className="card p-4 flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">
                  {solution.title_zh}
                </h3>
                {solution.published ? (
                  <span className="tag text-xs bg-green-50 text-green-700">{t("published")}</span>
                ) : (
                  <span className="tag text-xs bg-yellow-50 text-yellow-700">{t("draft")}</span>
                )}
                {solution.verified && (
                  <span className="tag text-xs bg-blue-50 text-blue-700">{t("verify")}</span>
                )}
              </div>
              <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                {solution.slug}
                {solution.category && ` · ${locale === "zh" ? solution.category.name_zh : (solution.category.name_en || solution.category.name_zh)}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <Link
                href={`/${locale}/admin/solutions/${solution.id}`}
                className="btn-ghost text-xs p-2"
              >
                <Edit size={14} />
              </Link>
              <Link
                href={`/${locale}/solutions/${solution.slug}`}
                target="_blank"
                className="btn-ghost text-xs p-2"
              >
                <ExternalLink size={14} />
              </Link>
              <button
                onClick={() => handleDelete(solution.id)}
                className="btn-ghost text-xs p-2 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {solutions.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
            <p className="mb-4">{t("no_projects")}</p>
            <Link
              href={`/${locale}/admin/solutions/new`}
              className="btn-primary text-sm"
            >
              <Plus size={16} />
              {t("new_solution")}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
