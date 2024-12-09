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
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import { failPopUp } from '@/src/app/hooks/features/popup.slice'
import { Course } from '@/src/app/types/course.type'
import CoursesTable from '@/src/components/CoursesTable'
import { useCategories } from '@/src/app/context/CategoriesContext'

type ResponseCourses = {
  data: {
    message: {
      courses: Course[]
      pagy: Pagy
    }
  }
}

export default function CoursesPage() {
  const t = useTranslations('list_course')
  const [courses, setCourses] = useState<Course[]>([])
  const category = useCategories()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchCourse, setSearchCourse] = useState('')
  const [searchTeacher, setSearchTeacher] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [searchTriggered, setSearchTriggered] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    if (searchTriggered) {
      const getListCourses = async () => {
        try {
          const res: ResponseCourses = await http.get(
            `admin/courses?page=${currentPage}&q[title_cont]=${searchCourse}&q[level_eq]=${filterLevel}&q[teacher_name_cont]=${searchTeacher}&q[category_name_cont]=${filterCategory}`
          )
          const data = res.data.message
          setDataLoaded(true)
          setCourses(data.courses)
          setTotalPages(data.pagy.pages ?? 1)
          setCurrentPage(data.pagy.current_page ?? 1)
        } catch (error: any) {
          setDataLoaded(true)
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        }
      }
      getListCourses()
      setSearchTriggered(false)
    }
  }, [currentPage, searchTriggered, dispatch, t, searchCourse, filterLevel, filterCategory, searchTeacher])

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

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchTriggered(true)
  }

  return (
    <div className='h-full'>
      <div className='flex mb-4 ml-5'>
        <Input
          type='text'
          placeholder={t('searchCourse')}
          value={searchCourse}
          onChange={(e) => setSearchCourse(e.target.value)}
          className='mr-2 w-1/6 p-[19px]'
        />
        <Input
          type='text'
          placeholder={t('searchTeacher')}
          value={searchTeacher}
          onChange={(e) => setSearchTeacher(e.target.value)}
          className='mr-2 w-1/6 p-[19px]'
        />
        <Select
          onValueChange={(e: string) => {
            setFilterCategory(e)
          }}
        >
          <SelectTrigger className='w-1/6 mr-2'>
            <SelectValue placeholder={t('filterCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('categories')}</SelectLabel>
              {category?.map((category, index) => (
                <SelectItem key={index} value={category?.name as string}>
                  {category?.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(e: string) => {
            setFilterLevel(e)
          }}
        >
          <SelectTrigger className='w-36 mr-2'>
            <SelectValue placeholder={t('filterLevel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('status')}</SelectLabel>
              <SelectItem value='N1'>{t('N1')}</SelectItem>
              <SelectItem value='N2'>{t('N2')}</SelectItem>
              <SelectItem value='N3'>{t('N3')}</SelectItem>
              <SelectItem value='N4'>{t('N4')}</SelectItem>
              <SelectItem value='N5'>{t('N5')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className='border p-[19px] text-white'>
          {t('search')}
        </Button>
      </div>
      <CoursesTable courses={courses} dataLoaded={dataLoaded} setCourses={setCourses} role='admin' />
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious className='cursor-pointer' onClick={() => handlePageChange('prev')}>
                {t('previous')}
              </PaginationPrevious>
            </PaginationItem>
          )}

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink className='cursor-pointer' onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PaginationLink>
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
