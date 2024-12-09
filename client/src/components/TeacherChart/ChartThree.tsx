'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { AssignmentsCount } from '@/src/app/types/assignmentsCount.type'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
})

type ChartThreeProps = {
  courseAssignments: AssignmentsCount[]
}

const ChartThree: React.FC<ChartThreeProps> = ({ courseAssignments }) => {
  const t = useTranslations('teacher_dashboard')
  const [chartData, setChartData] = useState<{ series: number[]; labels: string[] }>({
    series: [],
    labels: []
  })

  const shortenTitle = (title: string, maxLength: number = 10) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title
  }

  useEffect(() => {
    const sortedCourses = [...courseAssignments].sort((a, b) => (b.accepted || 0) - (a.accepted || 0))

    const topFiveCourses = sortedCourses.slice(0, 5)
    const others = sortedCourses.slice(5)

    const othersAcceptedCount = others.reduce((total, course) => total + (course.accepted || 0), 0)

    const acceptedCounts = [...topFiveCourses.map((course) => course.accepted || 0), othersAcceptedCount]
    const courseTitles = [
      ...topFiveCourses.map((course) => shortenTitle(course.course_title || 'Unknown Course')),
      t('others')
    ]

    setChartData({
      series: acceptedCounts,
      labels: courseTitles
    })
  }, [courseAssignments, t])

  const options = {
    chart: {
      fontFamily: 'Satoshi',
      type: 'pie' as 'pie'
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#FFA500', '#00BFFF', '#FF6347'],
    labels: chartData.labels,
    legend: {
      show: false,
      position: 'bottom' as 'bottom',
      fontFamily: 'Satoshi'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent'
        }
      }
    },
    dataLabels: {
      enabled: false
    }
  }

  return (
    <div className='col-span-12 rounded-sm border border-stroke px-5 pb-5 pt-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-8 xl:col-span-4'>
      <div className='mb-9 justify-between gap-4 sm:flex'>
        <div>
          <h5 className='text-xl font-semibold text-black dark:text-white'>{t('students_number')}</h5>
        </div>
      </div>

      <div className='mb-9'>
        <div id='chartThree' className='mx-auto flex justify-center'>
          <ReactApexChart options={options} series={chartData.series} type='donut' />
        </div>
      </div>

      <div className='-mx-8 flex flex-wrap items-center justify-center gap-y-3'>
        {chartData.labels.map((title, index) => (
          <div className='w-full px-8 sm:w-1/2' key={index}>
            <div className='flex w-full items-center'>
              <span className='mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]'></span>
              <p className='flex w-full justify-between text-sm font-medium text-black dark:text-white'>
                <span>{title}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartThree
