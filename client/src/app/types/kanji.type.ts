export interface Kanji {
  id?: number
  lesson_id?: number
  character?: string
  image_url?: string | null
  created_at?: string
  updated_at?: string
  meaning?: {
    english?: string
  }
}
