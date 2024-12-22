import { RequestCourse } from './requestCourse.type'

type CourseAssignment = {
  course_title?: string
  assignments_pending?: number
  assignments_accepted?: number
  assignments_rejected?: number
}

export type DashboardResponse = {
  message: {
    followers_count?: number
    course_assignments?: CourseAssignment[]
    course_requests?: RequestCourse[]
    total_accepted_assignments?: number
  }
}

export type Message = {
  total_assigned_courses?: number
  total_teachers?: number
  total_users?: number
  total_courses?: number
  course_requests?: CourseRequest[]
  teachers_per_category?: TeachersPerCategory
}

export type CourseRequest = {
  id?: number
  title?: string
  description?: string
  status?: string
  teacher_id?: number
  created_at?: Date
  teacher_name?: string
}

export type TeachersPerCategory = {
  '[1, "Japanese Language Basics"]'?: number
  '[2, "Intermediate Japanese"]'?: number
  '[3, "Advanced Japanese"]'?: number
  '[4, "Japanese Culture"]'?: number
  '[5, "JLPT Preparation"]'?: number
  '[6, "Japanese for Travel"]'?: number
}

export type DashboardResponse_Admin = {
  message?: Message
}
