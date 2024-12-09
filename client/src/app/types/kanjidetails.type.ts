export type KanjiDetails = {
  character?: string
  meaning?: {
    english?: string
  }
  kunyomi?: {
    hiragana?: string
    romaji?: string
  }
  onyomi?: {
    katakana?: string
    romaji?: string
  }
  examples?: Array<{
    japanese?: string
    meaning?: { english?: string }
    audio?: {
      mp3?: string
      opus?: string
      aac?: string
      ogg?: string
    }
  }>
  kanji?: {
    character?: string
    meaning?: {
      english?: string
    }
    strokes?: {
      count?: number
      timings?: number[]
      images?: string[]
    }
    onyomi?: {
      romaji?: string
      katakana?: string
    }
    kunyomi?: {
      romaji?: string
      hiragana?: string
    }
    video?: {
      poster?: string
      mp4?: string
      webm?: string
    }
  }
  radical?: {
    character?: string
    strokes?: number
    image?: string
    position?: {
      hiragana?: string
      romaji?: string
      icon?: string
    }
    name?: {
      hiragana?: string
      romaji?: string
    }
    meaning?: {
      english?: string
    }
    animation?: string[]
  }
}
