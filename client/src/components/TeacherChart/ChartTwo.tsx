'use client'
import { ApexOptions } from 'apexcharts'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/src/components/ui/pagination'
import dynamic from 'next/dynamic'
import { AssignmentsCount } from '@/src/app/types/assignmentsCount.type'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
})

type ChartTwoProps = {
  courseAssignments: AssignmentsCount[]
}

const ChartTwo: React.FC<ChartTwoProps> = ({ courseAssignments }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const itemsPerPage = 5
  const t = useTranslations('teacher_dashboard')
  const options: ApexOptions = {
    colors: ['#3C50E0', '#8fb2ef', '#8FD0EF'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    xaxis: {
      categories: [],
      tickPlacement: 'on'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px'
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%'
      }
    },
    fill: {
      opacity: 1
    },
    grid: {
      padding: {
        right: 30,
        left: 30
      }
    }
  }

  const totalPages = Math.ceil(courseAssignments.length / itemsPerPage)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentAssignments = courseAssignments.slice(startIndex, endIndex)

    const truncateTitle = (title: string, maxLength: number) => {
      return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
    }

    const courseTitles = currentAssignments
      .map((assignment) => truncateTitle(assignment.course_title ?? '', 15))
      .filter((title): title is string => !!title)

    const acceptedCounts = currentAssignments.map((assignment) => assignment.accepted || 0)
    const pendingCounts = currentAssignments.map((assignment) => assignment.pending || 0)
    const rejectedCounts = currentAssignments.map((assignment) => assignment.rejected || 0)

    setCategories(courseTitles)
    setSeries([
      { name: t('rejected'), data: rejectedCounts },
      { name: t('pending'), data: pendingCounts },
      { name: t('accepted'), data: acceptedCounts }
    ])
  }, [courseAssignments, currentPage, t])

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
    <div className='col-span-12 rounded-sm border border-stroke p-8 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8'>
      <div className='mb-4 justify-between gap-4 sm:flex'>
        <div>
          <h4 className='text-xl font-semibold text-black dark:text-white'>{t('course_enroll_request')}</h4>
        </div>
      </div>

      <div>
        <div id='chartTwo' className='mb-3'>
          {isMounted && (
            <ReactApexChart
              options={{ ...options, xaxis: { categories } }}
              series={series}
              type='bar'
              height={350}
              width={'100%'}
            />
          )}
        </div>

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
    </div>
  )
}

export default ChartTwo
