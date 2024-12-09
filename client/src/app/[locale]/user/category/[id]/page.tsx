'use client'
import React, { useEffect, useState } from 'react'
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
import { Label } from '@/src/components/ui/label'
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

const CourseList = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('category')
  const categoryId = params.id
  const dispatch = useAppDispatch()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [sortBy, setSortBy] = useState<string>('Hot')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    const fetchCourses = async (page = 1) => {
      setLoading(true)
      try {
        const response = await http.get(`courses?category_id=${categoryId}&sort=${sortBy.toLowerCase()}&page=${page}`)
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
  }, [categoryId, dispatch, sortBy, t, currentPage])

  const categoryTitle = courses.length > 0 ? courses[0]?.category?.name : ''

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className='container mx-auto py-8 w-9/12 mt-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>{`${t('category')}: ${categoryTitle}`}</h1>
        <div className='flex flex-col space-y-1.5'>
          <Label htmlFor='sort' className='text-lg font-bold'>
            {t('sort_by')}
          </Label>
          <Select onValueChange={setSortBy}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={t('sort_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('sort_label')}</SelectLabel>
                <SelectItem value='default'>{t('sort_default')}</SelectItem>
                <SelectItem value='hot'>{t('sort_hot')}</SelectItem>
                <SelectItem value='new'>{t('sort_new')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <TooltipProvider>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {loading ? (
            <>
              <SkeletonCourse />
              <SkeletonCourse />
              <SkeletonCourse />
            </>
          ) : courses.length > 0 ? (
            courses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <Nodata />
          )}
        </div>
      </TooltipProvider>
      <Pagination>
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
  )
}

export default CourseList
