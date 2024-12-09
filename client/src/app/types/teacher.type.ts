import { Course } from './course.type'

export type resProfileTeacher = {
  message: {
    profile: Teacher
    follower_count?: number
    is_following?: boolean
  }
}

type resEmail = {
  email?: string
}
export interface Teacher {
  id?: number
  account_id?: number
  bio?: string
  image_url?: string
  experience?: string
  created_at?: string
  updated_at?: string
  job_title?: string
  name?: string
  courses?: Course[]
  account?: resEmail
  course_count?: number
  student_count?: number
  follower_count?: number
}
