export interface RequestAssign {
  id?: number
  full_name?: string
  course_id?: number
  assigned_at?: string
  status?: 'accepted' | 'pending' | 'rejected'
  created_at?: string
  updated_at?: string
  course_title?: string
  course_level?: string
  course_image_url?: string
}
