'use client'
import { useAppDispatch } from '@/src/app/hooks/store'
import { Pagy } from '@/src/app/types/pagy.type'
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
import { RequestAssign } from '@/src/app/types/requestAssign.type'
import RequestAssignTable from '@/src/components/RequestAssignTable'

type ResponseRequestsAssignment = {
  data: {
    message: {
      course_assignments: RequestAssign[]
      pagy: Pagy
    }
  }
}

const ListRequestsCourse = () => {
  const t = useTranslations('list_requests_course')
  const [requests, setRequests] = useState<RequestAssign[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchUser, setSearchUser] = useState('')
  const [searchCourse, setSearchCourse] = useState('')
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
          const res: ResponseRequestsAssignment = await http.get(
            `instructor/course_assignments?page=${currentPage}&q[user_full_name_cont]=${searchUser}&q[course_title_cont]=${searchCourse}&q[status_eq]=${queryParam}`
          )
          const data = res.data.message
          setDataLoaded(true)
          setRequests(data.course_assignments)
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
  }, [currentPage, searchTriggered, dispatch, t, searchUser, filterStatus, searchCourse])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setSearchTriggered(true)
    }
  }

  const handleAcceptReject = async (request: RequestAssign, status: 'accepted' | 'rejected') => {
    try {
      const res: { message: string } = await http.patch(`instructor/course_assignments/${request.id}/update_status`, {
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
          placeholder={t('searchUser')}
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className='mr-2 w-72 p-[19px]'
        />
        <Input
          type='text'
          placeholder={t('searchTitle')}
          value={searchCourse}
          onChange={(e) => setSearchCourse(e.target.value)}
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
              <SelectItem value='1'>{t('accepted')}</SelectItem>
              <SelectItem value='0'>{t('pending')}</SelectItem>
              <SelectItem value='2'>{t('rejected')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className='border p-[19px] text-white'>
          {t('search')}
        </Button>
      </div>
      <RequestAssignTable requests={requests} dataLoaded={dataLoaded} handleAcceptReject={handleAcceptReject} />
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

export default ListRequestsCourse
