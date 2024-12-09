'use client'
import { useTranslations } from 'next-intl'
import { CourseAssignment } from '@/src/app/types/assignment.type'
import moment from 'moment'
import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/src/components/ui/pagination'
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'

interface TableOneProps {
  assignments: CourseAssignment[]
}

const TableOne = ({ assignments }: TableOneProps) => {
  const t = useTranslations('progress')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = assignments.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(assignments.length / itemsPerPage)

  const handlePageChange = (page: number | 'next' | 'prev') => {
    setCurrentPage((prevPage) => {
      const newPage = page === 'next' ? prevPage + 1 : page === 'prev' ? prevPage - 1 : page

      if (newPage >= 1 && newPage <= totalPages) {
        return newPage
      }

      return prevPage
    })
  }

  return (
    <div className='border-stroke px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 col-span-12 rounded-sm border border-stroke p-8 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8'>
      <h4 className='mb-3 text-xl font-semibold text-black dark:text-white'>{t('assignments')}</h4>

      <div className='flex flex-col'>
        <div className='grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4'>
          <div className='px-3 py-2'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>{t('course_title')}</h5>
          </div>
          <div className='px-3 py-2 text-center'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>{t('status')}</h5>
          </div>
          <div className='px-3 py-2 text-center'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>{t('create_at')}</h5>
          </div>
        </div>

        {currentItems.map((assignment, key) => (
          <div
            className={`grid grid-cols-3 ${key === currentItems.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
            key={key}
          >
            <div className='flex items-center p-2.5 xl:p-5'>
              <p className='text-black dark:text-white'>{assignment?.course?.title}</p>
            </div>

            <div className='flex items-center justify-center p-2.5 xl:p-5 text-center'>
              <p className='flex items-center justify-center text-black dark:text-white text-center'>
                {assignment.status === 'accepted' && (
                  <>
                    <FaCheckCircle className='text-green-600 mr-1 text-2xl' />
                  </>
                )}
                {assignment.status === 'pending' && (
                  <>
                    <FaClock className='text-yellow-600 mr-1 text-2xl' />
                  </>
                )}
                {assignment.status === 'rejected' && (
                  <>
                    <FaTimesCircle className='text-red-600 mr-1 text-2xl' />
                  </>
                )}
              </p>
            </div>

            <div className='flex items-center p-2.5 xl:p-5  justify-center'>
              <p className='text-black dark:text-white'>{moment(assignment?.created_at).format('D MMMM YYYY')}</p>
            </div>
          </div>
        ))}
      </div>

      <Pagination className='mb-4'>
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

export default TableOne
