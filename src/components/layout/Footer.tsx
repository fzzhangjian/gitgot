import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="border-t border-[var(--color-border)] py-8 mt-16">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span
              className="font-bold text-lg"
              style={{ color: "var(--color-gitgot-500)" }}
            >
              GitGot
            </span>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              {t("tagline")}
            </p>
          </div>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("powered")}
          </p>
        </div>
      </div>
    </footer>
  )
}
