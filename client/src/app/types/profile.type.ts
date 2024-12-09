export interface Profile {
  profile?: {
    id?: number
    account_id?: number
    full_name?: string
    bio?: string
    goals?: string
    image_url?: string
    created_at?: string
    updated_at?: string
    sex?: string
    account?: {
      email?: string
    }
  }
}
