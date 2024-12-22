'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { TeachersPerCategory } from '@/src/app/types/dashboardResponse.type'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
})

type ChartThreeProps = {
  courseAssignments?: TeachersPerCategory
}

const ChartThree: React.FC<ChartThreeProps> = ({ courseAssignments }) => {
  const t = useTranslations('admin_dashboard')
  const [chartData, setChartData] = useState<{ series: number[]; labels: string[] }>({
    series: [],
    labels: []
  })

  useEffect(() => {
    const series: number[] = []
    const labels: string[] = []

    if (courseAssignments && typeof courseAssignments === 'object') {
      Object.entries(courseAssignments).forEach(([key, value]) => {
        const label = key.split(', ')[1]?.replace('"', '') || t('unknown')
        labels.push(label)
        series.push(value || 0)
      })
    }

    setChartData({
      series: series.length > 0 ? series : [0],
      labels: labels.length > 0 ? labels : [t('no_data')]
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
          <h5 className='text-xl font-semibold text-black dark:text-white'>{t('teachers_number')}</h5>
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
