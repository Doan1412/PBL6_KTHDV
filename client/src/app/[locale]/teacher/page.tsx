'use client'
import Sidebar from '@/src/components/Sidebar'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp } from '@/src/app/hooks/features/popup.slice'
import http from '@/src/app/utils/http'
import { useTranslations } from 'next-intl'
import CardDataStats from '@/src/components/ui/CardDataStats'
import Nodata from '@/src/components/Nodata/Nodata'
import TableOne from '@/src/components/TeacherChart/Table'
import ChartTwo from '@/src/components/TeacherChart/ChartTwo'
import ChartThree from '@/src/components/TeacherChart/ChartThree'
import ChartOne from '@/src/components/TeacherChart/ChartOne'
import { ProgressBar } from '@/src/components/ProgressBar/ProgressBar'
import { DashboardResponse } from '../../types/dashboardResponse.type'

const TeacherDashboard = () => {
  const t = useTranslations('teacher_dashboard')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [dashboardData, setDashboardData] = useState<DashboardResponse['message'] | null>(null)
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
        const res = await http.get<DashboardResponse>('instructor/dashboard')
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
        <CardDataStats title={t('followers_count')} total={(dashboardData?.followers_count ?? 0).toString()} />
        <CardDataStats title={t('student')} total={(dashboardData.total_accepted_assignments ?? 0).toString()} />
        <CardDataStats title={t('total_course')} total={(dashboardData.course_assignments?.length ?? 0).toString()} />
        <CardDataStats
          title={t('pending_course_requests')}
          total={(dashboardData.course_requests ?? [])
            .filter((request) => request.status === 'pending')
            .length.toString()}
        />
      </div>

      <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <ChartTwo courseAssignments={dashboardData.course_assignments ?? []} />
        <ChartThree courseAssignments={dashboardData.course_assignments ?? []} />
        <div className='col-span-12 xl:col-span-8'>
          <TableOne courseRequests={dashboardData.course_requests ?? []} />
        </div>
        <ChartOne courseRequests={dashboardData.course_requests ?? []} />
      </div>
    </div>
  )
}

export default TeacherDashboard
