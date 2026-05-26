export interface Solution {
  id: string
  slug: string
  title_zh: string
  title_en: string | null
  description_zh: string
  description_en: string | null
  category_id: string | null
  source_platform: string | null
  source_url: string | null
  source_author: string | null
  verified: boolean
  published: boolean
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  category?: Category | null
  projects?: Project[]
  tags?: Tag[]
}

export interface Project {
  id: string
  solution_id: string
  github_url: string
  project_name: string
  description_zh: string | null
  description_en: string | null
  sort_order: number
}

export interface Category {
  id: string
  name_zh: string
  name_en: string | null
  slug: string
  sort_order: number
  solution_count?: number
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface SolutionFormData {
  title_zh: string
  title_en?: string
  slug: string
  description_zh: string
  description_en?: string
  category_id?: string
  source_platform?: string
  source_url?: string
  source_author?: string
  verified: boolean
  published: boolean
  projects: {
    github_url: string
    project_name: string
    description_zh?: string
    description_en?: string
    sort_order: number
  }[]
  tags?: string[]
}
