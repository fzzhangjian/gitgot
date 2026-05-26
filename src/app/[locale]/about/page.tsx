import { getTranslations } from "next-intl/server"
import { GitFork, Target, BookOpen, Quote } from "lucide-react"

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "about" })

  const items = t.raw("how_items") as string[]

  return (
    <div className="container-wide py-16 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-gitgot-50)] flex items-center justify-center mx-auto mb-6">
          <GitFork size={32} style={{ color: "var(--color-gitgot-500)" }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {t("intro")}
        </p>
      </div>

      <div className="space-y-12">
        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Target size={22} style={{ color: "var(--color-gitgot-500)" }} />
            <h2 className="text-xl font-semibold">{t("mission")}</h2>
          </div>
          <p className="leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {t("mission_desc")}
          </p>
        </div>

        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={22} style={{ color: "var(--color-gitgot-500)" }} />
            <h2 className="text-xl font-semibold">{t("how")}</h2>
          </div>
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--color-gitgot-50)] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold" style={{ color: "var(--color-gitgot-600)" }}>{i + 1}</span>
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[var(--color-gitgot-50)]">
            <Quote size={18} style={{ color: "var(--color-gitgot-500)" }} />
            <span className="font-medium italic" style={{ color: "var(--color-gitgot-700)" }}>
              {t("belief")}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
