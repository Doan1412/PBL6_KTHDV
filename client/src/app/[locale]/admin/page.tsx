'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../hooks/store'
import { getCookie } from 'cookies-next'
import { failPopUp } from '../../hooks/features/popup.slice'
import http from '../../utils/http'
import { ProgressBar } from '@/src/components/ProgressBar/ProgressBar'
import Nodata from '@/src/components/Nodata/Nodata'
import CardDataStats from '@/src/components/ui/CardDataStats'
import ChartTwo from '@/src/components/AdminChart/ChartTwo'
import ChartThree from '@/src/components/AdminChart/ChartThree'
import ChartOne from '@/src/components/AdminChart/ChartOne'
import TableOne from '@/src/components/AdminChart/Table'
import { DashboardResponse_Admin } from '../../types/dashboardResponse.type'

export default function AdminPage() {
  const t = useTranslations('admin_dashboard')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [dashboardData, setDashboardData] = useState<DashboardResponse_Admin['message'] | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    const token = getCookie('authToken')
    if (!token) {
      router.push('/login')
      dispatch(failPopUp(t('no_token_message')))
    }
  }, [dispatch, router, t])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await http.get<DashboardResponse_Admin>('admin/dashboard_stats')
        setDashboardData(res.data.message)
        setDataLoaded(true)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
      }
    }
    fetchDashboard()
  }, [dispatch, t])

  if (!dataLoaded || !dashboardData) {
    return (
      <div className='flex h-full items-center'>
        <ProgressBar
          onComplete={() => {
            if (dataLoaded) {
              setDataLoaded(true)
            }
          }}
          isComplete={!dataLoaded || !dashboardData}
          NoDataComponent={() => (
            <div className='container mx-auto my-8'>
              <h1 className='text-3xl font-bold mb-6 uppercase'>{t('title')}</h1>
              <div className='text-white rounded-lg p-6 flex items-center justify-between space-x-8 w-full'>
                <Nodata />
              </div>
            </div>
          )}
        />
      </div>
    )
  }

  return (
    <div className='container mx-auto my-8'>
      <h1 className='text-3xl font-bold mb-6 uppercase'>{t('title')}</h1>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
        <CardDataStats
          title={t('total_assigned_courses')}
          total={(dashboardData?.total_assigned_courses ?? 0).toString()}
        />
        <CardDataStats title={t('total_teachers')} total={(dashboardData?.total_teachers ?? 0).toString()} />
        <CardDataStats title={t('total_users')} total={(dashboardData?.total_users ?? 0).toString()} />
        <CardDataStats title={t('total_courses')} total={(dashboardData?.total_courses ?? 0).toString()} />
      </div>

      <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <ChartTwo courseAssignments={dashboardData?.course_requests ?? []} />
        <ChartThree courseAssignments={dashboardData?.teachers_per_category || {}} />
        <div className='col-span-12 xl:col-span-8'>
          <TableOne courseRequests={dashboardData.course_requests ?? []} />
        </div>
        <ChartOne courseRequests={dashboardData.course_requests ?? []} />
      </div>
    </div>
  )
}
