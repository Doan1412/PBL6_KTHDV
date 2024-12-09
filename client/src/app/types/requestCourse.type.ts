import { Category } from './category.type'
import { Teacher } from './teacher.type'

export interface RequestCourse {
  id?: number
  teacher?: Teacher
  category?: Category
  title?: string
  level?: string
  description?: string
  image_url?: string
  status?: string
  created_at?: string
}
