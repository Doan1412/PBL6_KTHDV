import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Img from '@/src/app/assets/no_data.svg'
import { Skeleton } from '@/src/components/ui/skeleton'
import { Lesson } from '@/src/app/types/lesson.type'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/src/components/ui/alert-dialog'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { BsTrashFill } from 'react-icons/bs'
import { Button } from '@/src/components/ui/button'
import http from '@/src/app/utils/http'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import { Dispatch, SetStateAction, useState } from 'react'
import { TbEdit } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import CreateFlashcardDialog from '../CreateFlashcardDialog/CreateFlashcardDialog'

interface LessonTableProps {
  lessons: Lesson[]
  dataLoaded: boolean
  setLessons: Dispatch<SetStateAction<Lesson[]>>
}

const LessonsTable: React.FC<LessonTableProps> = ({ lessons, dataLoaded, setLessons }) => {
  const t = useTranslations('lessons_table')
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleDeleteLesson = async (id_lesson: number) => {
    try {
      await http.delete(`instructor/lessons/${id_lesson}`)
      dispatch(successPopUp(t('delete_success')))
      setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.id !== id_lesson))
    } catch {
      dispatch(failPopUp(t('delete_fail')))
    }
  }

  return (
    <div className='w-[98%] flex justify-center rounded-lg shadow-xl m-5'>
      <Table className='w-full max-w-6xl mx-8 my-3'>
        <TableHeader className='dark:bg-background'>
          <TableRow>
            <TableHead className='uppercase font-bold text-center'>#</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('title')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('action')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('details')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!dataLoaded ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>
                  <Skeleton className='w-6 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-24 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-16 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-16 h-6 mx-auto' />
                </TableCell>
              </TableRow>
            ))
          ) : lessons?.length > 0 ? (
            lessons.map((lesson, index) => (
              <TableRow key={lesson.id}>
                <TableCell className='flex items-center justify-center font-medium'>{index + 1}</TableCell>
                <TableCell>{lesson?.title}</TableCell>
                <TableCell>
                  <div className='flex items-center justify-center cursor-pointer'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='link'>
                          <BsTrashFill color='red' size={25} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('confirm_delete')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('content_delete_lesson')} <strong>{lesson?.title}</strong>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction type='submit' onClick={() => handleDeleteLesson(lesson?.id as number)}>
                            {t('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <TbEdit
                      size={25}
                      color='lightblue'
                      onClick={() => router.push(`/teacher/lessons/edit_lesson/${lesson?.id}`)}
                      className='mr-2'
                    />
                    <CreateFlashcardDialog lessonId={lesson?.id as number} />
                  </div>
                </TableCell>
                <TableCell className='cursor-pointer flex items-center justify-center'>
                  <AlertDialog>
                    <AlertDialogTrigger className='cursor-pointer'>
                      <DocumentMagnifyingGlassIcon className='w-6 h-6' />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('view_details_lesson')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div>
                            <p>
                              <strong>{t('title')}:</strong> {lesson?.title}
                            </p>
                            <p>
                              <strong>{t('content')}:</strong> {lesson?.content}
                            </p>
                            <p>
                              <strong>{t('createdAt')}:</strong>{' '}
                              {new Date(lesson?.created_at ?? '').toLocaleDateString()}
                            </p>
                            {lesson?.video_url && (
                              <div>
                                <strong>{t('video')}:</strong>
                                <video className='w-full h-auto mt-2' controls src={lesson.video_url}>
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>{t('close')}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className='text-center'>
                <div className='flex justify-center'>
                  <Image src={Img} alt={t('no_data')} width={500} height={500} className='mx-auto' />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default LessonsTable
