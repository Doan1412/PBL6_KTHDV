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
import { CourseProgress } from '@/src/app/types/courseProgress.type'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
})
interface ChartTwoProps {
  progress: CourseProgress[]
}

const ChartTwo: React.FC<ChartTwoProps> = ({ progress }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const itemsPerPage = 5
  const t = useTranslations('progress')
  const options: ApexOptions = {
    colors: ['#3C50E0', '#6577F3', '#8FD0EF'],
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(0)
      }
    },
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: '100%',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%'
            }
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last'
      }
    },
    dataLabels: {
      enabled: true
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
      fontSize: '14px',
      markers: {
        size: 5
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

  const totalPages = Math.ceil(progress.length / itemsPerPage)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const maxTitleLength = 10

    const truncateTitle = (title: string) => {
      return title.length > maxTitleLength ? title.slice(0, maxTitleLength) + '...' : title
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProgress = progress.slice(startIndex, endIndex)

    const courseTitles = currentProgress.map((course) => truncateTitle(course?.course_title || 'Untitled'))

    const notStartedLessons = currentProgress.map((course) => {
      const totalLessons = course?.total_lessons || 0
      const inProgress = course?.in_progress || 0
      const completed = course?.completed || 0

      return totalLessons ? ((totalLessons - inProgress - completed) / totalLessons) * 100 : 0
    })

    const inProgressLessons = currentProgress.map((course) => {
      const totalLessons = course?.total_lessons || 0
      const inProgress = course?.in_progress || 0

      return totalLessons ? (inProgress / totalLessons) * 100 : 0
    })

    const completedLessons = currentProgress.map((course) => {
      const totalLessons = course?.total_lessons || 0
      const completed = course?.completed || 0

      return totalLessons ? (completed / totalLessons) * 100 : 0
    })

    setCategories(courseTitles)
    setSeries([
      { name: t('completed'), data: completedLessons },
      { name: t('inProgress'), data: inProgressLessons },
      { name: t('notStarted'), data: notStartedLessons }
    ])
  }, [progress, currentPage, t])

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
          <h4 className='text-xl font-semibold text-black dark:text-white'>{t('course_progess')}</h4>
        </div>
      </div>

      <div>
        <div id='chartTwo' className='mb-3 -ml-5'>
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
