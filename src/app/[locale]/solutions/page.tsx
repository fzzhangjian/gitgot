import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { Search, ArrowRight } from "lucide-react"

async function getSolutions(locale: string, search?: string, categorySlug?: string) {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("solutions")
      .select("id, slug, title_zh, title_en, description_zh, description_en, view_count, published_at, category_id")
      .eq("published", true)

    if (search) {
      query = query.or(`title_zh.ilike.%${search}%,title_en.ilike.%${search}%,description_zh.ilike.%${search}%,description_en.ilike.%${search}%`)
    }

    const { data: raw } = await query.order("published_at", { ascending: false })

    if (!raw) return []

    const solutions = await Promise.all(
      raw.map(async (s: any) => {
        let cat = null
        if (categorySlug) {
          const { data: c } = await supabase
            .from("categories")
            .select("id, name_zh, name_en, slug")
            .eq("slug", categorySlug)
            .single()
          cat = c
        } else if (s.category_id) {
          const { data: c } = await supabase
            .from("categories")
            .select("id, name_zh, name_en, slug")
            .eq("id", s.category_id)
            .single()
          cat = c
        }
        return { ...s, category: cat }
      })
    )

    if (categorySlug) {
      return solutions.filter((s) => s.category?.slug === categorySlug)
    }
    return solutions
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("categories")
      .select("id, name_zh, name_en, slug, sort_order")
      .order("sort_order")
    return data || []
  } catch {
    return []
  }
}

export default async function SolutionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { locale } = await params
  const { q, category } = await searchParams
  const t = await getTranslations({ locale, namespace: "solutions" })
  const solutions = await getSolutions(locale, q, category)
  const categories = await getCategories()

  return (
    <div className="container-wide py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>

      <form className="mb-8" method="GET">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            name="q"
            defaultValue={q || ""}
            placeholder={t("search")}
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-gitgot-500)] transition-colors"
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/${locale}/solutions`}
          className={`tag px-3 py-1.5 ${!category ? "bg-[var(--color-gitgot-500)] text-white" : ""}`}
        >
          {t("all")}
        </Link>
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/${locale}/solutions?category=${cat.slug}`}
            className={`tag px-3 py-1.5 ${category === cat.slug ? "bg-[var(--color-gitgot-500)] text-white" : ""}`}
          >
            {locale === "zh" ? cat.name_zh : (cat.name_en || cat.name_zh)}
          </Link>
        ))}
      </div>

      {solutions.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
          <p className="text-lg">{t("no_results")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution: any) => (
            <Link
              key={solution.id}
              href={`/${locale}/solutions/${solution.slug}`}
              className="card p-6 block"
            >
              {solution.category && (
                <span className="tag mb-3">
                  {locale === "zh"
                    ? solution.category.name_zh
                    : (solution.category.name_en || solution.category.name_zh)}
                </span>
              )}
              <h3 className="font-semibold text-lg mb-2">
                {locale === "zh" ? solution.title_zh : (solution.title_en || solution.title_zh)}
              </h3>
              <p className="text-sm mb-4 line-clamp-3" style={{ color: "var(--color-text-secondary)" }}>
                {locale === "zh"
                  ? solution.description_zh
                  : (solution.description_en || solution.description_zh)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {t("view_count", { count: solution.view_count || 0 })}
                </span>
                <ArrowRight size={14} style={{ color: "var(--color-text-muted)" }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
