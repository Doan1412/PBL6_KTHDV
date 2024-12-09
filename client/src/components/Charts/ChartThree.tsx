'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { CourseProgress } from '@/src/app/types/courseProgress.type'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
})

interface ChartData {
  series: number[]
}

interface ChartThreeProps {
  progress: CourseProgress[]
}

const ChartThree: React.FC<ChartThreeProps> = ({ progress }) => {
  const t = useTranslations('progress')
  const [chartData, setChartData] = useState<ChartData>({ series: [] })
  const [completedPercent, setCompletedPercent] = useState<number>(0)
  const [inProgressPercent, setInProgressPercent] = useState<number>(0)
  const [notStartedPercent, setNotStartedPercent] = useState<number>(0)
  const options = {
    chart: {
      fontFamily: 'Satoshi',
      type: 'donut' as 'donut'
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF'],
    labels: [t('inProgress'), t('completed'), t('notStarted')],
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

  useEffect(() => {
    let totalLessons = 0
    let totalInProgress = 0
    let totalCompleted = 0

    progress.forEach((course) => {
      totalLessons += course.total_lessons ?? 0
      totalInProgress += course.in_progress ?? 0
      totalCompleted += course.completed ?? 0
    })

    const totalNotStarted = totalLessons - (totalInProgress + totalCompleted)

    const inProgressPercent = totalLessons ? Math.round((totalInProgress / totalLessons) * 100) : 0
    const completedPercent = totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0
    const notStartedPercent = totalLessons ? Math.round((totalNotStarted / totalLessons) * 100) : 0

    setChartData({
      series: [inProgressPercent, completedPercent, notStartedPercent]
    })

    setCompletedPercent(completedPercent)
    setInProgressPercent(inProgressPercent)
    setNotStartedPercent(notStartedPercent)
  }, [progress])

  return (
    <div className='col-span-12 rounded-sm border border-stroke px-5 pb-5 pt-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-8 xl:col-span-4'>
      <div className='mb-9 justify-between gap-4 sm:flex'>
        <div>
          <h5 className='text-xl font-semibold text-black dark:text-white'>{t('general_analysis')}</h5>
        </div>
      </div>

      <div className='mb-9'>
        <div id='chartThree' className='mx-auto flex justify-center'>
          <ReactApexChart options={options} series={chartData.series} type='donut' />
        </div>
      </div>
      <div className='-mx-8 flex flex-wrap items-center justify-center gap-y-3'>
        <div className='w-full px-8 sm:w-1/2'>
          <div className='flex w-full items-center'>
            <span className='mr-2 block h-3 w-full max-w-3 rounded-full bg-primary'></span>
            <p className='flex w-full justify-between text-sm font-medium text-black dark:text-white'>
              <span>{t('completed')}</span>
              <span>{completedPercent}%</span>
            </p>
          </div>
        </div>
        <div className='w-full px-8 sm:w-1/2'>
          <div className='flex w-full items-center'>
            <span className='mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]'></span>
            <p className='flex w-full justify-between text-sm font-medium text-black dark:text-white'>
              <span>{t('inProgress')}</span>
              <span>{inProgressPercent}%</span>
            </p>
          </div>
        </div>
        <div className='w-full px-8 sm:w-1/2'>
          <div className='flex w-full items-center'>
            <span className='mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]'></span>
            <p className='flex w-full justify-between text-sm font-medium text-black dark:text-white'>
              <span>{t('notStarted')}</span>
              <span>{notStartedPercent}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartThree
