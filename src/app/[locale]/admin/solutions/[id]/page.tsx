"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Category, Solution } from "@/lib/types"

interface ProjectForm {
  github_url: string
  project_name: string
  description_zh: string
  description_en: string
  sort_order: number
}

export default function AdminSolutionEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const t = useTranslations("admin")
  const router = useRouter()
  const [locale, setLocale] = useState("zh")
  const [solutionId, setSolutionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [form, setForm] = useState({
    title_zh: "",
    title_en: "",
    slug: "",
    description_zh: "",
    description_en: "",
    category_id: "",
    source_platform: "",
    source_url: "",
    source_author: "",
    verified: false,
    published: false,
  })

  const [projects, setProjects] = useState<ProjectForm[]>([])

  useEffect(() => {
    const resolve = async () => {
      const { locale: l, id } = await params
      setLocale(l)
      if (id !== "new") setSolutionId(id)
    }
    resolve()
  }, [params])

  useEffect(() => {
    if (!locale) return
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order")
      if (data) setCategories(data as Category[])
    }
    fetchCategories()
  }, [locale])

  useEffect(() => {
    if (!solutionId || !locale) return
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("solutions")
        .select("*, projects(*)")
        .eq("id", solutionId)
        .single()
      if (data) {
        const s = data as Solution & { projects: any[] }
        setForm({
          title_zh: s.title_zh,
          title_en: s.title_en || "",
          slug: s.slug,
          description_zh: s.description_zh,
          description_en: s.description_en || "",
          category_id: s.category_id || "",
          source_platform: s.source_platform || "",
          source_url: s.source_url || "",
          source_author: s.source_author || "",
          verified: s.verified,
          published: s.published,
        })
        if (s.projects) {
          setProjects(
            s.projects.map((p) => ({
              github_url: p.github_url,
              project_name: p.project_name,
              description_zh: p.description_zh || "",
              description_en: p.description_en || "",
              sort_order: p.sort_order,
            }))
          )
        }
      }
    }
    fetch()
  }, [solutionId, locale])

  const addProject = () => {
    setProjects([
      ...projects,
      { github_url: "", project_name: "", description_zh: "", description_en: "", sort_order: projects.length },
    ])
  }

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const updateProject = (index: number, field: keyof ProjectForm, value: string | number) => {
    const updated = [...projects]
    ;(updated[index] as any)[field] = value
    setProjects(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const solutionData = {
      ...form,
      category_id: form.category_id || null,
      source_platform: form.source_platform || null,
      source_url: form.source_url || null,
      source_author: form.source_author || null,
    }

    try {
      if (solutionId) {
        await supabase.from("solutions").update(solutionData).eq("id", solutionId)
        await supabase.from("projects").delete().eq("solution_id", solutionId)
        if (projects.length > 0) {
          await supabase.from("projects").insert(
            projects.map((p) => ({ ...p, solution_id: solutionId }))
          )
        }
      } else {
        const { data } = await supabase.from("solutions").insert(solutionData).select("id").single()
        if (data && projects.length > 0) {
          await supabase.from("projects").insert(
            projects.map((p) => ({ ...p, solution_id: data.id }))
          )
        }
      }
      router.push(`/${locale}/admin/solutions`)
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  return (
    <div>
      <Link
        href={`/${locale}/admin/solutions`}
        className="btn-ghost text-sm mb-6 inline-flex"
      >
        <ArrowLeft size={16} />
        {t("cancel")}
      </Link>

      <h1 className="text-2xl font-bold mb-6">
        {solutionId ? t("edit_solution") : t("new_solution")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">基本信息</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">标题 (中文) *</label>
              <input
                required
                value={form.title_zh}
                onChange={(e) => setForm({ ...form, title_zh: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gitgot-500)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">标题 (English)</label>
              <input
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gitgot-500)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="e.g. local-llm-rag-stack"
              className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gitgot-500)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">描述 (中文) *</label>
              <textarea
                required
                rows={3}
                value={form.description_zh}
                onChange={(e) => setForm({ ...form, description_zh: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gitgot-500)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">描述 (English)</label>
              <textarea
                rows={3}
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gitgot-500)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
              >
                <option value="">无</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_zh} / {cat.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">已发布</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.verified}
                  onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">已验证 GitHub 项目</span>
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">来源信息</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">来源平台</label>
              <input
                value={form.source_platform}
                onChange={(e) => setForm({ ...form, source_platform: e.target.value })}
                placeholder="抖音 / B站 / 小红书"
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">作者</label>
              <input
                value={form.source_author}
                onChange={(e) => setForm({ ...form, source_author: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">原文链接</label>
              <input
                value={form.source_url}
                onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">开源项目列表</h2>
            <button type="button" onClick={addProject} className="btn-ghost text-sm">
              <Plus size={14} />
              添加项目
            </button>
          </div>

          {projects.map((project, index) => (
            <div key={index} className="p-4 border border-[var(--color-border)] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">项目 #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="btn-ghost text-xs p-1 text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">GitHub URL *</label>
                  <input
                    required
                    value={project.github_url}
                    onChange={(e) => updateProject(index, "github_url", e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">项目名 *</label>
                  <input
                    required
                    value={project.project_name}
                    onChange={(e) => updateProject(index, "project_name", e.target.value)}
                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">作用描述 (中文)</label>
                  <input
                    value={project.description_zh}
                    onChange={(e) => updateProject(index, "description_zh", e.target.value)}
                    placeholder="在这个方案中的作用"
                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">作用描述 (English)</label>
                  <input
                    value={project.description_en}
                    onChange={(e) => updateProject(index, "description_en", e.target.value)}
                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--color-text-muted)" }}>
              还没有添加项目，点击上方按钮添加
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={16} />
            {saving ? "..." : t("save")}
          </button>
          <Link href={`/${locale}/admin/solutions`} className="btn-ghost">
            {t("cancel")}
          </Link>
        </div>
      </form>
    </div>
  )
}
