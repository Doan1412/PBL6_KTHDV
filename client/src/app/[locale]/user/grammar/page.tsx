'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Img from '../../../assets/trans_bg.png'
import { Textarea } from '@/src/components/ui/textarea'
import { TbTextGrammar } from 'react-icons/tb'
import { Button } from '@/src/components/ui/button'
import http from '@/src/app/utils/http'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp } from '@/src/app/hooks/features/popup.slice'
import { IoCheckmarkDone } from 'react-icons/io5'
import { IoCloseOutline } from 'react-icons/io5'

export default function CheckGrammarPage() {
  const t = useTranslations('grammar')
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<string | null>('')
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingPercent, setLoadingPercent] = useState<number>(0)

  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = t('title')
  }, [t])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInputText(text)
  }

  const simulateLoading = async () => {
    for (let i = 1; i <= 95; i++) {
      await new Promise((resolve) => setTimeout(resolve, 150))
      setLoadingPercent(i)
    }
  }

  const handleCheckGrammar = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setLoadingPercent(0)
    setRecommendation(null)
    try {
      simulateLoading()

      const response = await http.post(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        text: inputText
      })
      const data = response.data
      setResult(data.prediction)
      setRecommendation(data.suggestion || null)
      setLoadingPercent(100)
    } catch {
      dispatch(failPopUp(t('check_grammar_failed')))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mt-[4%]'>
      <div className='fixed bottom-14 w-full flex justify-center z-[-1] mt-4 opacity-75'>
        <Image src={Img.src} alt='translate' width={1300} height={1500}></Image>
      </div>
      <div className='flex ml-[10%] gap-2'>
        <TbTextGrammar size={25} />
        <p className='font-semibold text-2xl'>{t('title')}</p>
      </div>
      <div className='mt-[1%] ml-[10%] mr-[10%]'>
        <Textarea
          id='input'
          className='mt-2 text-lg border border-gray-300 rounded-lg'
          rows={5}
          placeholder={t('input')}
          value={inputText}
          onChange={handleInputChange}
        />
      </div>
      <div className='w-[90%] flex justify-end mt-[1%]'>
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            handleCheckGrammar(e)
          }}
          disabled={loading}
        >
          {t('check_grammar')}
        </Button>
      </div>
      {loading && (
        <div className='w-[15%] ml-[10%] text-center'>
          <div className='top-[-25px] left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-500 animate-bounce'>
            {t('loading_text')}
          </div>
          <div className='bg-gray-200 rounded-full h-4 mt-[5%]'>
            <div
              className='bg-primary h-4 rounded-full transition-all duration-75'
              style={{ width: `${loadingPercent}%` }}
            ></div>
          </div>
          <p className='text-sm mt-2'>{loadingPercent}%</p>
        </div>
      )}

      {!loading && (
        <div className='w-[55%] mt-[1%] ml-[10%] text-lg font-semibold'>
          {result === 'Correct' && (
            <div className='flex gap-3'>
              <IoCheckmarkDone size={25} />
              <p className='text-green-500'>{t('grammar_correct')}</p>
            </div>
          )}
          {result === 'Incorrect' && (
            <div className='flex gap-3'>
              <IoCloseOutline size={25} />
              <p className='text-red-500'>{t('grammar_incorrect')}</p>
            </div>
          )}
          {result === null && (
            <div className='flex gap-3'>
              <IoCloseOutline size={25} />
              <p className='text-red-500'>{t('error_occurred')}</p>
            </div>
          )}
          {recommendation && (
            <div className='mt-2'>
              <p>
                {t('recommendation')}: {recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
