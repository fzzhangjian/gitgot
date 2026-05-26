import Link from "next/link"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft, ExternalLink, CheckCircle, GitFork } from "lucide-react"

async function getSolution(slug: string) {
  try {
    const supabase = await createClient()
    const { data: solution } = await supabase
      .from("solutions")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (!solution) return null

    let category = null
    if (solution.category_id) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id, name_zh, name_en, slug")
        .eq("id", solution.category_id)
        .single()
      category = cat
    }

    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("solution_id", solution.id)
      .order("sort_order")

    return { ...solution, category, projects: projects || [] }
  } catch {
    return null
  }
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: "solution" })
  const solution: any = await getSolution(slug)

  if (!solution) notFound()

  const title = locale === "zh" ? solution.title_zh : (solution.title_en || solution.title_zh)
  const description = locale === "zh" ? solution.description_zh : (solution.description_en || solution.description_zh)

  return (
    <div className="container-wide py-12 max-w-4xl mx-auto">
      <Link
        href={`/${locale}/solutions`}
        className="btn-ghost text-sm mb-8 inline-flex"
      >
        <ArrowLeft size={16} />
        {t("back")}
      </Link>

      <div className="mb-8">
        {solution.category && (
          <Link
            href={`/${locale}/categories/${solution.category.slug}`}
            className="tag mb-4 inline-block"
          >
            {locale === "zh"
              ? solution.category.name_zh
              : (solution.category.name_en || solution.category.name_zh)}
          </Link>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {description}
        </p>
      </div>

      <div className="card p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          {solution.verified ? (
            <>
              <CheckCircle size={18} style={{ color: "var(--color-gitgot-500)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--color-gitgot-600)" }}>
                {t("verified")}
              </span>
            </>
          ) : (
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {t("not_verified")}
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold mb-4">{t("github_projects")}</h2>
        <div className="space-y-3">
          {solution.projects && solution.projects.length > 0 ? (
            solution.projects.sort((a: any, b: any) => a.sort_order - b.sort_order).map((project: any) => {
              const projDesc = locale === "zh"
                ? (project.description_zh || null)
                : (project.description_en || project.description_zh || null)
              return (
                <a
                  key={project.id}
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-start gap-3 hover:bg-[var(--color-surface-secondary)] transition-colors"
                >
                  <GitFork size={20} className="mt-0.5 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{project.project_name}</span>
                      <ExternalLink size={12} style={{ color: "var(--color-text-muted)" }} />
                    </div>
                    {projDesc && (
                      <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                        {projDesc}
                      </p>
                    )}
                  </div>
                </a>
              )
            })
          ) : (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {t("no_projects")}
            </p>
          )}
        </div>
      </div>

      {solution.source_url && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">{t("source")}</h2>
          <div className="text-sm space-y-1" style={{ color: "var(--color-text-secondary)" }}>
            {solution.source_platform && <p>{t("platform", { platform: solution.source_platform })}</p>}
            {solution.source_author && <p>{t("by", { author: solution.source_author })}</p>}
          </div>
          <a
            href={solution.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm mt-3 inline-flex"
          >
            {t("view_source")} <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  )
}
