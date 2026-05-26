import Link from "next/link"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight } from "lucide-react"

async function getCategory(slug: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("categories")
      .select("id, name_zh, name_en, slug")
      .eq("slug", slug)
      .single()
    return data
  } catch {
    return null
  }
}

async function getSolutionsByCategory(categoryId: string, locale: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("solutions")
      .select("id, slug, title_zh, title_en, description_zh, description_en, view_count, published_at")
      .eq("published", true)
      .eq("category_id", categoryId)
      .order("published_at", { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return (
      <div className="container-wide py-20 text-center" style={{ color: "var(--color-text-muted)" }}>
        <p className="text-lg">分类未找到 / Category not found</p>
        <Link href={`/${locale}/solutions`} className="btn-ghost text-sm mt-4 inline-flex">
          返回方案库
        </Link>
      </div>
    )
  }

  const solutions = await getSolutionsByCategory(category.id, locale)
  const name = locale === "zh" ? category.name_zh : (category.name_en || category.name_zh)

  return (
    <div className="container-wide py-12">
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
        {solutions.length} 个方案
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <Link
            key={solution.id}
            href={`/${locale}/solutions/${solution.slug}`}
            className="card p-6 block"
          >
            <h3 className="font-semibold text-lg mb-2">
              {locale === "zh" ? solution.title_zh : (solution.title_en || solution.title_zh)}
            </h3>
            <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
              {locale === "zh" ? solution.description_zh : (solution.description_en || solution.description_zh)}
            </p>
            <div className="flex items-center gap-2">
              <ArrowRight size={14} style={{ color: "var(--color-text-muted)" }} />
            </div>
          </Link>
        ))}
      </div>

      {solutions.length === 0 && (
        <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
          <p>该分类暂无方案</p>
        </div>
      )}
    </div>
  )
}
