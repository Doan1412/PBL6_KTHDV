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
