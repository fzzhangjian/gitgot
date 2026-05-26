import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, BookOpen, GitFork } from "lucide-react"

interface SolutionCard {
  id: string
  slug: string
  title_zh: string
  title_en: string | null
  description_zh: string
  description_en: string | null
  view_count: number
  published_at: string | null
  category: {
    id: string
    name_zh: string
    name_en: string | null
    slug: string
  } | null
}

async function getSolutions() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("solutions")
      .select("id, slug, title_zh, title_en, description_zh, description_en, view_count, published_at, category_id")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(6)

    if (!data) return []

    const solutions: SolutionCard[] = await Promise.all(
      data.map(async (s) => {
        let category = null
        if (s.category_id) {
          const { data: cat } = await supabase
            .from("categories")
            .select("id, name_zh, name_en, slug")
            .eq("id", s.category_id)
            .single()
          category = cat
        }
        return { ...s, category }
      })
    )
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })
  const solutions = await getSolutions()
  const categories = await getCategories()

  return (
    <div>
      <section className="py-20 md:py-28 text-center">
        <div className="container-wide max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            {t("subtitle")}
          </p>
          <Link
            href={`/${locale}/solutions`}
            className="btn-primary text-base px-8 py-3"
          >
            <BookOpen size={18} />
            {t("browse")}
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-12">
          <div className="container-wide">
            <h2 className="text-xl font-semibold mb-6">{t("categories")}</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/categories/${cat.slug}`}
                  className="tag px-4 py-2 text-sm"
                >
                  {locale === "zh" ? cat.name_zh : (cat.name_en || cat.name_zh)}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{t("latest")}</h2>
            <Link
              href={`/${locale}/solutions`}
              className="btn-ghost text-sm"
            >
              {t("browse")} <ArrowRight size={16} />
            </Link>
          </div>

          {solutions.length === 0 ? (
            <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
              <GitFork size={48} className="mx-auto mb-4 opacity-40" />
              <p>内容准备中，敬请期待</p>
              <p className="text-sm mt-1">Content coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.map((solution) => (
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
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
                    {locale === "zh"
                      ? solution.description_zh
                      : (solution.description_en || solution.description_zh)}
                  </p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <span>{t("count", { count: solution.view_count || 0 })}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
