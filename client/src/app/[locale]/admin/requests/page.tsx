'use client'
import { useAppDispatch } from '@/src/app/hooks/store'
import { Pagy } from '@/src/app/types/pagy.type'
import { User } from '@/src/app/types/user.type'
import http from '@/src/app/utils/http'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import { RequestCourse } from '@/src/app/types/requestCourse.type'
import RequestTable from '@/src/components/RequestTable'

type ResponseRequests = {
  data: {
    message: {
      request_courses: RequestCourse[]
      pagy: Pagy
    }
  }
}

const ListRequests = () => {
  const t = useTranslations('list_requests')
  const [requests, setRequests] = useState<RequestCourse[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTriggered, setSearchTriggered] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    if (searchTriggered) {
      const getListRequests = async () => {
        try {
          const queryParam = filterStatus === 'all' ? '' : filterStatus
          const res: ResponseRequests = await http.get(
            `admin/request_courses?page=${currentPage}&q[title_cont]=${searchTerm}&q[status_eq]=${queryParam}`
          )
          const data = res.data.message
          setDataLoaded(true)
          setRequests(data.request_courses)
          setTotalPages(data.pagy.pages ?? 1)
          setCurrentPage(data.pagy.current_page ?? 1)
        } catch (error: any) {
          setDataLoaded(true)
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        }
      }
      getListRequests()
      setSearchTriggered(false)
    }
  }, [currentPage, searchTriggered, dispatch, t, searchTerm, filterStatus])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setSearchTriggered(true)
    }
  }

  const handleAcceptReject = async (request: RequestCourse, status: 'approved' | 'rejected') => {
    try {
      const res: { message: string } = await http.patch(`/admin/request_courses/${request.id}/update_status`, {
        status
      })

      dispatch(successPopUp(res.message))

      setRequests((prevRequests) => prevRequests.map((r) => (r.id === request.id ? { ...r, status } : r)))
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || t('update_fail')
      dispatch(failPopUp(message))
    }
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
          placeholder={t('searchTitle')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='mr-2 w-72 p-[19px]'
        />
        <Select
          onValueChange={(e: string) => {
            setFilterStatus(e)
          }}
        >
          <SelectTrigger className='w-36 mr-2'>
            <SelectValue placeholder={t('filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('status')}</SelectLabel>
              <SelectItem value='all'>{t('allStatus')}</SelectItem>
              <SelectItem value='1'>{t('approved')}</SelectItem>
              <SelectItem value='0'>{t('pending')}</SelectItem>
              <SelectItem value='2'>{t('rejected')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className='border p-[19px] text-white'>
          {t('search')}
        </Button>
      </div>
      <RequestTable requests={requests} dataLoaded={dataLoaded} handleAcceptReject={handleAcceptReject} />
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
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink href='#' onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
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

export default ListRequests
