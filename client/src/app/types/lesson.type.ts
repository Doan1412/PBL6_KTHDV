import { Course } from './course.type'
import { Flashcard } from './flashcard.type'

export interface Lesson {
  id?: number
  course_id?: number
  title?: string
  content?: string
  video_url?: string
  created_at?: string
  updated_at?: string
  kanjis?: string[]
  flashcards?: Flashcard[]
  course?: Pick<Course, 'id' | 'teacher' | 'title'>
  course_title?: string
  progresses?: [{ status: string }]
}
