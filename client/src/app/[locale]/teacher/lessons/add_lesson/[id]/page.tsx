'use client'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import updateProfile from '@/src/app/assets/updateProfile.png'
import Image from 'next/image'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import http from '@/src/app/utils/http'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import { Button } from '@/src/components/ui/button'
import { CldUploadButton } from 'next-cloudinary'
import { hasCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { Course } from '@/src/app/types/course.type'

type resCourse = {
  data: {
    message: {
      course: Course
    }
  }
}

export default function AddLessonsPage({ params }: { params: { id: string } }) {
  const t = useTranslations('add_lesson')
  const [course, setCourse] = useState<Course>()
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState('')
  const [listKanji, setListKanji] = useState<string>('')
  const [urlVideo, setUrlVideo] = useState<string>('')
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    if (!hasCookie('authToken')) {
      router.push('/login')
      dispatch(failPopUp(t('login_first')))
      return
    }
  }, [router, dispatch, t])

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const res: resCourse = await http.get(`instructor/courses/${params.id}`)
        setCourse(res.data.message.course)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
      }
    }
    fetchCourseDetail()
  }, [dispatch, t, params.id])

  const handleSubmit = async () => {
    const requestData = {
      content,
      title,
      video_url: urlVideo,
      kanji: convertStringToKanjiArray(listKanji)
    }

    try {
      await http.post(`instructor/courses/${params.id}/lessons`, requestData)
      dispatch(successPopUp(t('update_success')))
      router.push(`/teacher/lessons/${params.id}`)
    } catch {
      dispatch(failPopUp(t('update_failed')))
    }
  }

  const convertStringToKanjiArray = (listKanji: string) => {
    const kanjiList = listKanji.split(',').map((item) => item.trim())
    return kanjiList
  }

  return (
    <div className='flex flex-row'>
      <div className='container mx-auto my-8'>
        <div className='relative'>
          <div className='bg-primary text-white rounded-lg p-6 flex items-center justify-between space-x-8 w-full shadow-lg'>
            <div className='mb-16'>
              <h1 className='text-2xl font-bold mb-2'>{t('title')}</h1>
              <p className='mb-4'>
                {t('add_lesson')} {course?.title}
              </p>
            </div>
            <div>
              <Image src={updateProfile.src} height={updateProfile.height} width={updateProfile.width} alt='rikimo' />
            </div>
          </div>
        </div>
        <div className='flex mt-10 justify-center'>
          <div className='flex-col w-full'>
            <form>
              <div className='grid grid-cols-1 md:grid-cols-2 items-center grid-flow-row gap-4'>
                <div className='flex flex-col space-y-1.5 mt-4'>
                  <Label htmlFor='title' className='text-lg font-bold'>
                    {t('title_lesson')}
                  </Label>
                  <Input
                    id='text'
                    className='border-gray-200 h-10'
                    placeholder={t('title_lesson')}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                  />
                </div>
                <div className='flex flex-col space-y-1.5 mt-4'>
                  <Label htmlFor='course' className='text-lg font-bold'>
                    {t('course')}
                  </Label>
                  <Input
                    id='text'
                    className='border-gray-200 cursor-not-allowed bg-gray-200'
                    placeholder={t('course')}
                    value={course?.title}
                  />
                </div>
              </div>
              <div className='flex flex-col space-y-1.5 mt-4'>
                <Label htmlFor='content' className='text-lg font-bold'>
                  {t('content')}
                </Label>
                <Textarea
                  className='border-gray-200'
                  id='input'
                  rows={5}
                  placeholder={t('write_content')}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                  }}
                />
              </div>
              <div className='flex flex-col space-y-1.5 mt-4'>
                <Label htmlFor='list_kanji' className='text-lg font-bold'>
                  {t('list_kanji')}
                </Label>
                <Textarea
                  className='border-gray-200'
                  id='input'
                  rows={5}
                  placeholder={t('write_list_kanji')}
                  value={listKanji}
                  onChange={(e) => {
                    setListKanji(e.target.value)
                  }}
                />
              </div>
              <div className='flex flex-col space-y-1.5 w-full z-auto justify-start mt-4'>
                <Label className='font-bold text-lg'>{t('url_video')}</Label>
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onSuccess={(result: any) => {
                    setUrlVideo(result?.info?.secure_url)
                  }}
                  onError={(error: any) => {
                    dispatch(failPopUp('Upload failed, please try again'))
                  }}
                  uploadPreset='s2lo0hgq'
                >
                  <label className='flex bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-3 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-6 mr-2 fill-white inline' viewBox='0 0 32 32'>
                      <path
                        d='M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z'
                        data-original='#000000'
                      />
                      <path
                        d='M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z'
                        data-original='#000000'
                      />
                    </svg>
                    {t('upload')}
                  </label>
                </CldUploadButton>

                {urlVideo && <p className='text-green-500 font-medium mt-2'>{t('upload_success')}</p>}
              </div>
            </form>
            <div className='mt-8'>
              <Button
                onClick={() => {
                  handleSubmit()
                }}
              >
                {t('submit_add_lesson')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
