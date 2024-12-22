'use client'
import { ApexOptions } from 'apexcharts'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type CourseRequest = {
  id?: number
  title?: string
  description?: string
  status?: string
  teacher_id?: number
  created_at?: Date
  teacher_name?: string
}

type ChartTwoProps = {
  courseAssignments?: CourseRequest[]
}

const ChartTwo: React.FC<ChartTwoProps> = ({ courseAssignments = [] }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const t = useTranslations('admin_dashboard')

  useEffect(() => {
    if (!Array.isArray(courseAssignments)) return

    const acceptedCounts = courseAssignments.filter((a) => a?.status === 'approved').length
    const pendingCounts = courseAssignments.filter((a) => a?.status === 'pending').length
    const rejectedCounts = courseAssignments.filter((a) => a?.status === 'rejected').length

    setCategories([t('approved'), t('pending'), t('rejected')])
    setSeries([
      { name: t('approved'), data: [acceptedCounts] },
      { name: t('pending'), data: [pendingCounts] },
      { name: t('rejected'), data: [rejectedCounts] }
    ])
  }, [courseAssignments, t])

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
      categories,
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

  if (!series.length || !categories.length) return <div>{t('loading')}</div>

  return (
    <div className='col-span-12 rounded-sm border border-stroke p-8 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8'>
      <div className='mb-4 justify-between gap-4 sm:flex'>
        <div>
          <h4 className='text-xl font-semibold text-black dark:text-white'>{t('course_enroll_request')}</h4>
        </div>
      </div>

      <div>
        <div id='chartTwo' className='mb-3'>
          <ReactApexChart
            options={{ ...options, xaxis: { categories: categories || [] } }}
            series={series}
            type='bar'
            height={350}
            width={'100%'}
          />
        </div>
      </div>
    </div>
  )
}

export default ChartTwo
