import { Flashcard } from './flashcard.type'
import { Kanji } from './kanji.type'

export type ContentType = {
  type: 'video' | 'flashcard' | 'kanji' | null
  url?: string
  flashCardContent?: Flashcard[]
  kanjiContent?: Kanji[]
}
