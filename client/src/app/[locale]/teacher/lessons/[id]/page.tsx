'use client'
import { useAppDispatch } from '@/src/app/hooks/store'
import { Pagy } from '@/src/app/types/pagy.type'
import http from '@/src/app/utils/http'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/src/components/ui/pagination'
import { failPopUp } from '@/src/app/hooks/features/popup.slice'
import { Lesson } from '@/src/app/types/lesson.type'
import LessonsTable from '@/src/components/LessonsTable'
import { Button } from '@/src/components/ui/button'
import { useRouter } from 'next/navigation'

type ResponseLessons = {
  data: {
    message: {
      course_title: string
      lessons: Lesson[]
      pagy: Pagy
    }
  }
}

export default function LessonsPage({ params }: { params: { id: string } }) {
  const t = useTranslations('list_lesson')
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [course, setCourse] = useState<string>('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTriggered, setSearchTriggered] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    if (searchTriggered) {
      const getListLessons = async () => {
        try {
          const res: ResponseLessons = await http.get(`instructor/courses/${params.id}/lessons?page=${currentPage}`)
          const data = res.data.message
          setDataLoaded(true)
          setCourse(data.course_title)
          setLessons(data.lessons)
          setTotalPages(data.pagy.pages ?? 1)
          setCurrentPage(data.pagy.current_page ?? 1)
        } catch (error: any) {
          setDataLoaded(true)
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        }
      }
      getListLessons()
      setSearchTriggered(false)
    }
  }, [currentPage, searchTriggered, dispatch, t, params.id])

  const handlePageChange = (page: number | 'next' | 'prev') => {
    setCurrentPage((prevPage) => {
      const newPage = page === 'next' ? prevPage + 1 : page === 'prev' ? prevPage - 1 : page

      if (newPage >= 1 && newPage <= totalPages) {
        setSearchTriggered(true)
        return newPage
      }

      return prevPage
    })
  }

  const generatePagination = () => {
    const pageNumbers: (number | string)[] = []
    const delta = 2

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pageNumbers.push(i)
      } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
        pageNumbers.push('...')
      }
    }

    return pageNumbers
  }

  return (
    <div className='h-full'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold mb-4'>
          {t('lessons_list_title')}: {course}
        </h1>
        <Button onClick={() => router.push(`/teacher/lessons/add_lesson/${params.id}`)} className='mr-24'>
          {t('add_course')}
        </Button>
      </div>
      <LessonsTable lessons={lessons} dataLoaded={dataLoaded} setLessons={setLessons} />
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious className='cursor-pointer' onClick={() => handlePageChange('prev')}>
                {t('previous')}
              </PaginationPrevious>
            </PaginationItem>
          )}
          {generatePagination().map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <span>...</span>
              ) : (
                <PaginationLink
                  className={`cursor-pointer ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext className='cursor-pointer' onClick={() => handlePageChange('next')}>
                {t('next')}
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
