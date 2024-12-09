'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Course } from '@/src/app/types/course.type'
import CourseCard from '@/src/components/CourseCard'
import { TooltipProvider } from '@/src/components/ui/tooltip'
import http from '@/src/app/utils/http'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import SkeletonCourse from '@/src/components/SkeletonCourse/SkeletonCourse'
import Nodata from '@/src/components/Nodata/Nodata'
import { useTranslations } from 'next-intl'
import { failPopUp } from '@/src/app/hooks/features/popup.slice'
import { useAppDispatch } from '@/src/app/hooks/store'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/src/components/ui/pagination'
import { useSearchParams } from 'next/navigation'
import { useCategories } from '@/src/app/context/CategoriesContext'

const SearchCourse = () => {
  const t = useTranslations('course_search')
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const categories = useCategories()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [level, setLevel] = useState<string>('none')
  const [category, setCategory] = useState<string>('none')
  const [sort, setSort] = useState<string>('latest')
  const query = useMemo(() => searchParams.get('query') || '', [searchParams])

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    const fetchCourses = async (page = 1) => {
      setLoading(true)
      const filterLevel = level === 'none' ? null : level
      const filterCategory = category === 'none' ? null : category
      const filterSort = sort === 'none' ? null : sort
      try {
        const response = await http.get(
          `courses/search?q=${query}&page=${page}&level=${filterLevel || ''}&category=${filterCategory || ''}&sort=${filterSort || ''}`
        )
        const data = response.data.message
        setCourses(data.courses)
        setCurrentPage(data.pagy.current_page)
        setTotalPages(data.pagy.pages)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
      } finally {
        setLoading(false)
      }
    }
    fetchCourses(currentPage)
  }, [dispatch, t, currentPage, query, level, category, sort])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className='py-8 w-full mt-4 px-12'>
      <div className='flex w-full'>
        <div className='w-1/5 p-4 border-r pr-8'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-4'>{t('filter')}</h2>
            <Select onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_level')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('level')}</SelectLabel>
                  {['N1', 'N2', 'N3', 'N4', 'N5', 'none'].map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl === 'none' ? t('none') : lvl}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='mb-6'>
            <Select onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('category1')}</SelectLabel>
                  {categories?.map((cat) => (
                    <SelectItem key={cat?.id} value={String(cat?.id)}>
                      {cat?.name}
                    </SelectItem>
                  ))}
                  <SelectItem value='none'>{t('none')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='mb-6'>
            <Select onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder={t('sort_by')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('sort')}</SelectLabel>
                  <SelectItem value='latest'>{t('latest')}</SelectItem>
                  <SelectItem value='hot'>{t('hot')}</SelectItem>
                  <SelectItem value='none'>{t('none')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='w-4/5 px-8'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold'>{`${t('result_for')}: ${query}`}</h1>
          </div>
          <TooltipProvider>
            {loading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                <SkeletonCourse />
                <SkeletonCourse />
                <SkeletonCourse />
              </div>
            ) : courses.length > 0 ? (
              <div className='flex flex-wrap -mx-2'>
                {courses.map((course) => (
                  <div key={course.id} className='px-4 mb-4'>
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            ) : (
              <div className='my-10 flex justify-center'>
                <Nodata />
              </div>
            )}
          </TooltipProvider>

          <Pagination className='mt-4'>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href='#' onClick={() => handlePageChange(currentPage - 1)}>
                    {t('previous')}
                  </PaginationPrevious>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href='#'>{currentPage}</PaginationLink>
              </PaginationItem>
              {currentPage < totalPages && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#' onClick={() => handlePageChange(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href='#' onClick={() => handlePageChange(currentPage + 1)}>
                    {t('next')}
                  </PaginationNext>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default SearchCourse
