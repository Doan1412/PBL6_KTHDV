import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import useDebounce from '../../app/hooks/customs/useDebounce'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface TranslationResponse {
  responseData: {
    translatedText: string
  }
  matches: {
    id: number | string
    segment: string
    translation: string
    match: number
  }[]
}

export default function TranslateForm() {
  const t = useTranslations('trans')
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [additionalTranslations, setAdditionalTranslations] = useState<TranslationResponse['matches']>([])
  const [sourceLang, setSourceLang] = useState('vi')
  const [targetLang, setTargetLang] = useState('ja')
  const debouncedInput = useDebounce(inputText, 500)

  const handleTranslate = async (text: string, source: string, target: string): Promise<void> => {
    if (!text.trim()) {
      setTranslatedText('')
      setAdditionalTranslations([])
      return
    }

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
      )
      const data: TranslationResponse = await response.json()
      setTranslatedText(data.responseData.translatedText)
      setAdditionalTranslations(data.matches)
    } catch (error) {
      console.error('Error during translation:', error)
    }
  }
  useEffect(() => {
    if (debouncedInput) {
      handleTranslate(debouncedInput, sourceLang, targetLang)
    }
  }, [debouncedInput, sourceLang, targetLang])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInputText(text)
  }

  return (
    <div className='flex flex-row gap-8 mx-6 md:mx-12 lg:mx-24'>
      <div className='flex flex-col basis-1/2 space-y-4'>
        <div>
          <Select value={sourceLang} onValueChange={setSourceLang}>
            <SelectTrigger className='w-full max-w-xs'>
              <SelectValue placeholder={t('fr_lang')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='vi'>{t('vi')}</SelectItem>
              <SelectItem value='en'>{t('en')}</SelectItem>
              <SelectItem value='ja'>{t('ja')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='text-xl'>
          <Textarea
            id='input'
            className='mt-2 p-3 text-lg border border-gray-300 rounded-lg'
            rows={5}
            placeholder={t('input')}
            value={inputText}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className='flex flex-col basis-1/2 space-y-4'>
        <div>
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className='w-full max-w-xs'>
              <SelectValue placeholder={t('to_lang')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='vi'>{t('vi')}</SelectItem>
              <SelectItem value='en'>{t('en')}</SelectItem>
              <SelectItem value='ja'>{t('ja')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col space-y-4'>
          <Textarea
            id='output'
            className='mt-2 p-3 text-lg border border-gray-300 rounded-lg'
            rows={5}
            readOnly
            value={translatedText}
          />
          {additionalTranslations.length > 0 && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold'>{t('additional_translations')}</h3>
              <ul className='list-disc list-inside space-y-1'>
                {additionalTranslations.map((match) => (
                  <li key={match.id}>
                    <Badge variant='outline' className='text-md rounded-full py-1 px-3'>
                      {match.translation}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
