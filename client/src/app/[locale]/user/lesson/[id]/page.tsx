'use client'
import React, { Fragment, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/src/app/hooks/store'
import { useGetTeacherInfoQuery } from '@/src/app/hooks/service/teacher_infor.service'
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import http from '@/src/app/utils/http'
import { LessonScrollArea } from '@/src/components/LessonScrollArea/LessonScrollArea'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import avtDefault from '@/src/app/assets/avtDefault.png'
import { Skeleton } from '@/src/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'
import { Button } from '@/src/components/ui/button'
import { LuBellRing } from 'react-icons/lu'
import { AiOutlineUserDelete } from 'react-icons/ai'
import { Card, CardContent, CardDescription, CardHeader } from '@/src/components/ui/card'
import { TbInfoSquareRounded } from 'react-icons/tb'
import { Lesson } from '@/src/app/types/lesson.type'
import { ContentType } from '@/src/app/types/contentTypes.type'
import { getCookie } from 'cookies-next'
import FlashcardList from '@/src/components/FlashcardList/FlashcardList'
import { Flashcard } from '@/src/app/types/flashcard.type'
import KanjiList from '@/src/components/KanjiList'
import { Kanji } from '@/src/app/types/kanji.type'

type ResLesson = {
  data: {
    message: {
      lessons: Lesson[]
    }
  }
}

export default function PageLesson({ params }: { params: { id: string } }) {
  const t = useTranslations('lesson_page')
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [currentContent, setCurrentContent] = useState<ContentType>({ type: null })
  const [titleLesson, setTitleLesson] = useState('')
  const [contentLesson, setContentLesson] = useState('')
  const [createDayLesson, setCreateDayLesson] = useState('')
  const [updateDayLesson, setUpdateDayLesson] = useState('')
  const [IdLesson, setIdLesson] = useState<number>()
  const [position, setPosition] = useState<boolean>(false)
  const [followerCount, setFollowerCount] = useState<number>(0)
  const dispatch = useAppDispatch()
  const pramTeacherId = useSearchParams()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const { data, isFetching } = useGetTeacherInfoQuery(pramTeacherId.get('id_teacher') as string)
  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    setPosition(data?.message?.is_following as boolean)
    setFollowerCount(data?.message?.follower_count as number)
  }, [data?.message?.follower_count, data?.message?.is_following])

  const handleContentClick = useCallback(
    (
      type: 'video' | 'flashcard' | 'kanji',
      content: { url?: string; flashCardContent?: Flashcard[]; kanjiContent?: Kanji[] }
    ) => {
      setCurrentContent({ type, ...content })
    },
    []
  )

  useEffect(() => {
    const token = getCookie('authToken')
    if (!token) {
      router.push('/login')
      dispatch(failPopUp(t('no_token_message')))
      return
    }
  }, [dispatch, router, t])

  const fetchLessons = useCallback(
    async (id: string) => {
      try {
        const res: ResLesson = await http.get(`courses/${id}/lessons`)
        setLessons(res.data.message.lessons)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, t, router]
  )

  useEffect(() => {
    if (params.id) {
      fetchLessons(params.id)
    }
  }, [params.id, fetchLessons])

  const teacherImage = useMemo(() => {
    return data?.message?.profile?.image_url || avtDefault.src
  }, [data])

  useEffect(() => {
    const videoElement = videoRef.current

    const handleTimeUpdate = async () => {
      if (videoElement) {
        const currentTime = videoElement.currentTime
        const duration = videoElement.duration

        if (currentTime >= (2 / 3) * duration) {
          try {
            await http.put(`progress/${IdLesson}`, {
              progress: {
                status: 'completed'
              }
            })
            setLessons((prevLessons) =>
              prevLessons?.map((lesson) =>
                lesson.id === IdLesson ? { ...lesson, progresses: [{ status: 'completed' }] } : lesson
              )
            )
            videoElement.removeEventListener('timeupdate', handleTimeUpdate)
          } catch (error: any) {
            dispatch(failPopUp(error?.response?.data?.error))
          }
        }
      }
    }

    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [currentContent, IdLesson, dispatch])

  const handleProgressStart = async (lessonId: number | undefined) => {
    if (lessonId === undefined) {
      return
    }

    try {
      const res: { message: string } = await http.post('progress', {
        progress: {
          lesson_id: lessonId,
          status: 'in_progress'
        }
      })
    } catch (error: any) {
      dispatch(successPopUp(error?.response?.data?.error))
    }
  }

  const followTeacher = async () => {
    try {
      const res: { message: string } = await http.post(`follows?teacher_id=${pramTeacherId.get('id_teacher')}`)
      dispatch(successPopUp(res.message))
      setPosition(true)
      setFollowerCount((prevFollowerCount) => prevFollowerCount + 1)
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || t('update_fail')
      dispatch(failPopUp(message))
    }
  }

  const unfollowTeacher = async () => {
    try {
      const res: { message: string } = await http.delete(`follows?teacher_id=${pramTeacherId.get('id_teacher')}`)
      dispatch(successPopUp(res.message))
      setPosition(false)
      setFollowerCount((prevFollowerCount) => prevFollowerCount - 1)
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || t('update_fail')
      dispatch(failPopUp(message))
    }
  }

  return (
    <div className='grid grid-flow-row-dense grid-cols-1 lg:grid-cols-4 w-full'>
      <div className='col-span-1 lg:col-span-3 h-full mt-10 flex justify-center w-full'>
        <div className='flex-col w-full'>
          {currentContent.type === 'video' && currentContent.url ? (
            <div className='flex justify-center'>
              <video
                ref={videoRef}
                width='87%'
                height='auto'
                controls
                className='rounded-2xl'
                src={currentContent.url}
              />
            </div>
          ) : currentContent.type === 'flashcard' ? (
            <div className='w-full'>
              <FlashcardList flashcards={currentContent.flashCardContent || []} />
            </div>
          ) : currentContent.type === 'kanji' ? (
            <div className='flex justify-center'>
              <div className='w-[85%]'>
                <KanjiList kanjis={currentContent.kanjiContent || []} />
              </div>
            </div>
          ) : (
            <div className='h-full flex justify-center items-center'>
              <h1 className='font-semibold text-2xl'>{t('select_one_lesson')}</h1>
            </div>
          )}

          <div className='mt-5 mx-11 lg:mx-20'>
            <h1 className='font-semibold text-2xl'>{titleLesson}</h1>
            {titleLesson && (
              <div className='flex-col lg:flex-row mt-2'>
                <div className='flex'>
                  {isFetching ? (
                    <Skeleton className='h-14 w-14 rounded-full' />
                  ) : (
                    <Avatar className='h-14 w-14'>
                      <AvatarImage src={teacherImage} />
                    </Avatar>
                  )}

                  <div className='flex items-center ml-4'>
                    <div className='flex-row'>
                      {isFetching ? (
                        <div className='space-y-2'>
                          <Skeleton className='h-4 w-[250px]' />
                          <Skeleton className='h-4 w-[200px]' />
                        </div>
                      ) : (
                        <div className='flex gap-8'>
                          <div>
                            <h1 className='text-xl font-black'>{data?.message?.profile?.name}</h1>
                            <h2 className='flex gap-3 mt-1 text-gray'>
                              {followerCount} {t('follower')}
                            </h2>
                          </div>
                          <div className='mt-2'>
                            {position ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant='outline' className='rounded-full bg-gray-300'>
                                    <>
                                      <LuBellRing className='mr-2' />
                                      {t('subscribed')}
                                    </>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-56'>
                                  <DropdownMenuRadioGroup
                                    value={position ? 'subscribed' : 'unsubscribed'}
                                    onValueChange={() => unfollowTeacher()}
                                  >
                                    <DropdownMenuRadioItem value='subscribed'>
                                      <LuBellRing className='mr-2' />
                                      {t('all')}
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='unsubscribed'>
                                      <AiOutlineUserDelete className='mr-2' />
                                      {t('unsubscribe')}
                                    </DropdownMenuRadioItem>
                                  </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <Button
                                onClick={() => followTeacher()}
                                variant='outline'
                                className='rounded-full bg-gray-300'
                              >
                                {t('subscribe')}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Card className='mt-6 w-[93%] bg-gray-200'>
                  {isFetching ? (
                    <div className='space-y-2 m-5'>
                      <Skeleton className='h-4 w-2/5 my-1' />
                      <Skeleton className='h-4 w-1/3 my-1' />
                    </div>
                  ) : (
                    <Fragment>
                      <CardHeader>
                        <CardDescription>{contentLesson}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <h1 className='text-lg font-black'>{t('lesson_details')}</h1>
                        <div className='flex mt-3'>
                          <TbInfoSquareRounded size={25} className='mr-2 ml-1' />
                          {t('create_day')} {new Date(createDayLesson).toISOString().split('T')[0] || 'N/A'}
                        </div>
                        <div className='flex mt-3'>
                          <TbInfoSquareRounded size={25} className='mr-2 ml-1' />
                          {t('update_date')} {new Date(updateDayLesson).toISOString().split('T')[0] || 'N/A'}
                        </div>
                      </CardContent>
                    </Fragment>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='hidden lg:flex lg:flex-col lg:col-span-1 h-full mt-10'>
        <LessonScrollArea
          lessons={lessons as []}
          hidden={false}
          onVideoClick={(url) => handleContentClick('video', { url })}
          onFlashCardClick={(content) => handleContentClick('flashcard', { flashCardContent: content })}
          onKanjiClick={(content) => handleContentClick('kanji', { kanjiContent: content })}
          dataLoaded={isLoading}
          setTitleLesson={setTitleLesson}
          setUpdateDayLesson={setUpdateDayLesson}
          setCreateDayLesson={setCreateDayLesson}
          setContentLesson={setContentLesson}
          setIdLesson={setIdLesson}
          handleProgressStart={handleProgressStart}
        />
      </div>
    </div>
  )
}
