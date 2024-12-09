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
import { Teacher } from '@/src/app/types/teacher.type'
import TeachersTable from '@/src/components/TeachersTable'
import { useCategories } from '@/src/app/context/CategoriesContext'

type ResponseTeachers = {
  data: {
    message: {
      teachers: Teacher[]
      pagy: Pagy
    }
  }
}

export default function TeachersPage() {
  const t = useTranslations('list_teacher')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const category = useCategories()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTeacher, setSearchTeacher] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [searchTriggered, setSearchTriggered] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    if (searchTriggered) {
      const getListTeachers = async () => {
        try {
          const res: ResponseTeachers = await http.get(
            `admin/teachers?page=${currentPage}&q[name_or_account_email_cont]=${searchTeacher}`
          )
          const data = res.data.message
          setDataLoaded(true)
          setTeachers(data.teachers)
          setTotalPages(data.pagy.pages ?? 1)
          setCurrentPage(data.pagy.current_page ?? 1)
        } catch (error: any) {
          setDataLoaded(true)
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        }
      }
      getListTeachers()
      setSearchTriggered(false)
    }
  }, [currentPage, searchTriggered, dispatch, t, searchTeacher, filterCategory])

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
          placeholder={t('searchNameOrEmail')}
          value={searchTeacher}
          onChange={(e) => setSearchTeacher(e.target.value)}
          className='mr-2 w-1/6 p-[19px]'
        />
        <Button onClick={handleSearch} className='border p-[19px] text-white'>
          {t('search')}
        </Button>
      </div>
      <TeachersTable teachers={teachers} dataLoaded={dataLoaded} setTeachers={setTeachers} />
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
