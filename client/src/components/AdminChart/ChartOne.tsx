'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { CourseRequest } from '@/src/app/types/dashboardResponse.type'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
})

type ChartOneProps = {
  courseRequests?: CourseRequest[]
}

const ChartOne = ({ courseRequests = [] }: ChartOneProps) => {
  const t = useTranslations('admin_dashboard')

  const getStatusCount = (status: string) => {
    if (!Array.isArray(courseRequests)) return 0
    return courseRequests.filter((request) => request.status === status).length
  }

  const chartData = {
    series: [getStatusCount('approved'), getStatusCount('pending'), getStatusCount('rejected')],
    options: {
      chart: {
        type: 'polarArea' as 'polarArea',
        fontFamily: 'Satoshi, sans-serif'
      },
      labels: ['Approved', 'Pending', 'Rejected'],
      fill: {
        opacity: 0.8
      },
      stroke: {
        width: 1
      },
      legend: {
        position: 'bottom' as 'bottom'
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0
          },
          spokes: {
            strokeWidth: 0
          }
        }
      },
      theme: {
        monochrome: {
          enabled: true,
          shadeTo: 'light' as 'light',
          shadeIntensity: 0.6
        }
      }
    }
  }

  return (
    <div className='col-span-12 rounded-sm border border-stroke px-5 pb-5 pt-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-8 xl:col-span-4 h-full'>
      <div className='mb-10 justify-between gap-4 sm:flex'>
        <div>
          <h5 className='text-xl font-semibold text-black dark:text-white'>{t('general_analysis')}</h5>
        </div>
      </div>

      <div className='mb-5 h-full'>
        <div id='chartThree' className='mx-auto flex justify-center mb-5 h-full'>
          <ReactApexChart options={chartData.options} series={chartData.series} type='polarArea' width={400} />
        </div>
      </div>
    </div>
  )
}

export default ChartOne
