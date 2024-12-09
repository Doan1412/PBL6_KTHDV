import { Course } from './course.type'

export interface CourseAssignment {
  user_id?: number
  course_id?: number
  assigned_at?: Date | null
  status?: string
  created_at?: Date
  updated_at?: Date
  course?: Course
}
