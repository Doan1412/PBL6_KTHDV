import { Category } from './category.type'
import { Lesson } from './lesson.type'
import { Teacher } from './teacher.type'
import { AssignmentsCount } from './assignmentsCount.type'
import { CourseRating } from './course_rating.type'
export interface Course {
  id?: number
  category_id?: number
  title?: string
  level?: string
  description?: string
  teacher_id?: number
  created_at?: string
  updated_at?: string
  image_url?: string
  lessons?: Lesson[]
  teacher?: Teacher
  category?: Category
  assignments_count?: AssignmentsCount
  average_rating?: number
  course_ratings?: CourseRating[]
}
