'use client'
import * as React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Lesson } from '../../app/types/lesson.type'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { useTranslations } from 'next-intl'
import { Skeleton } from '../ui/skeleton'
import { HiOutlineCheckCircle } from 'react-icons/hi2'
import { IoPlayCircleOutline } from 'react-icons/io5'
import { TbCards } from 'react-icons/tb'
import { LiaLanguageSolid } from 'react-icons/lia'

interface LessonScrollAreaProps {
  lessons: Lesson[]
  hidden?: boolean
  onVideoClick?: (url: string) => void
  onFlashCardClick?: (content: []) => void
  onKanjiClick?: (content: []) => void
  dataLoaded?: boolean
  setTitleLesson?: React.Dispatch<React.SetStateAction<string>>
  setUpdateDayLesson?: React.Dispatch<React.SetStateAction<string>>
  setCreateDayLesson?: React.Dispatch<React.SetStateAction<string>>
  setContentLesson?: React.Dispatch<React.SetStateAction<string>>
  setIdLesson?: React.Dispatch<React.SetStateAction<number | undefined>>
  handleProgressStart?: ((lessonId: number | undefined) => Promise<void>) | undefined
}

export function LessonScrollArea({
  lessons,
  hidden,
  onVideoClick,
  onFlashCardClick,
  onKanjiClick,
  dataLoaded,
  setTitleLesson,
  setCreateDayLesson,
  setContentLesson,
  setUpdateDayLesson,
  setIdLesson,
  handleProgressStart
}: LessonScrollAreaProps) {
  const t = useTranslations('lesson_page_scroll')

  const handleLessonClick = async (lesson: Lesson) => {
    if (onVideoClick) onVideoClick(lesson?.video_url as string)
    if (setTitleLesson) setTitleLesson(lesson?.title as string)
    if (setContentLesson) setContentLesson(lesson?.content as string)
    if (setCreateDayLesson) setCreateDayLesson(lesson?.created_at as string)
    if (setUpdateDayLesson) setUpdateDayLesson(lesson?.updated_at as string)
    if (setIdLesson) setIdLesson(lesson?.id as number)

    if (handleProgressStart) {
      await handleProgressStart(lesson.id)
    }
  }

  return (
    <ScrollArea className='h-[calc(100vh-200px)] w-[85%] rounded-md border-2'>
      <div className='p-4'>
        {dataLoaded ? (
          <div className='grid justify-items-center'>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className='h-4 w-[90%] mt-10' />
            ))}
          </div>
        ) : (
          <Accordion type='single' collapsible className='w-full'>
            {lessons?.map((lesson) => (
              <AccordionItem key={lesson?.id} value={lesson.id?.toString() || ''}>
                <div className='flex justify-between'>
                  <AccordionTrigger>{lesson?.title}</AccordionTrigger>
                  {lesson?.progresses?.[0]?.status === 'completed' && (
                    <div className='flex items-center'>
                      <HiOutlineCheckCircle size={25} color='green' />
                    </div>
                  )}
                </div>
                <AccordionContent>
                  {hidden ? (
                    <div className='text-sm'>{lesson?.content}</div>
                  ) : (
                    <div>
                      <div
                        className='flex gap-1 cursor-pointer mt-1'
                        onClick={() => {
                          handleLessonClick(lesson)
                        }}
                      >
                        <IoPlayCircleOutline size={25} />
                        <p className='flex items-center'>{t('video')}</p>
                      </div>
                      <div
                        className='flex gap-1 cursor-pointer mt-1'
                        onClick={() => onFlashCardClick?.(lesson?.flashcards as [])}
                      >
                        <TbCards size={25} />
                        <p className='flex items-center'>{t('flashcard')}</p>
                      </div>
                      <div
                        className='flex gap-1 cursor-pointer mt-1'
                        onClick={() => onKanjiClick?.(lesson?.kanjis as [])}
                      >
                        <LiaLanguageSolid size={25} />
                        <p className='flex items-center'>{t('kanji')}</p>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </ScrollArea>
  )
}
