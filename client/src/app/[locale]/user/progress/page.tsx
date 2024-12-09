'use client'
import CourseCard from '../../../../components/CourseCard'
import { TooltipProvider } from '../../../../components/ui/tooltip'
import Sidebar from '@/src/components/Sidebar'
import Image from 'next/image'
import findImg from '@/src/app/assets/rikimo_note.png'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Course } from '@/src/app/types/course.type'
import http from '@/src/app/utils/http'
import { failPopUp } from '@/src/app/hooks/features/popup.slice'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/src/app/hooks/store'
import { ProgressBar } from '@/src/components/ProgressBar/ProgressBar'
import { AssignmentsCount } from '@/src/app/types/assignmentsCount.type'
import ChartTwo from '@/src/components/Charts/ChartTwo'
import TableOne from '@/src/components/Tables/TableOne'
import CardDataStats from '@/src/components/ui/CardDataStats'
import ChartThree from '@/src/components/Charts/ChartThree'
import { CourseAssignment } from '@/src/app/types/assignment.type'
import ChartOne from '@/src/components/Charts/ChartOne'
import Nodata from '@/src/components/Nodata/Nodata'
import { CourseProgress } from '@/src/app/types/courseProgress.type'

type UserProgressResponse = {
  data: {
    message: {
      progress: CourseProgress[]
      assignment: CourseAssignment[]
    }
  }
}

const ProgressPage = () => {
  const t = useTranslations('progress')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [progress, setProgress] = useState<CourseProgress[]>([])
  const [assignment, setAssignment] = useState<CourseAssignment[]>([])

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    const token = getCookie('authToken')
    if (!token) {
      router.push('/login')
      dispatch(failPopUp(t('no_token_message')))
      return
    }
  }, [dispatch, router, t])

  useEffect(() => {
    const fetchProgess = async () => {
      try {
        const res: UserProgressResponse = await http.get(`progress/myprogress`)
        const data = res.data.message
        setProgress(data.progress)
        setAssignment(data.assignment)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
      }
    }
    fetchProgess()
  }, [dispatch, t])

  if (!progress || progress.length === 0 || !assignment) {
    return (
      <ProgressBar
        onComplete={() => {
          if (dataLoaded) {
            setDataLoaded(true)
          }
        }}
        isComplete={!progress || progress.length === 0 || !assignment}
        NoDataComponent={() => (
          <div className='flex flex-row'>
            <Sidebar activeItem={'dashboard'} />
            <div className='container mx-auto my-8'>
              <h1 className='text-3xl font-bold mb-6 uppercase'>{t('title')}</h1>
              <div className='text-white rounded-lg p-6 flex items-center justify-between space-x-8 w-full'>
                <Nodata />
              </div>
            </div>
          </div>
        )}
      />
    )
  }
  return (
    <div className='flex flex-row'>
      <Sidebar activeItem={'dashboard'} />
      <div className='container mx-auto my-8 '>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
          <CardDataStats title={t('total_course')} total={progress.length.toString()} />
          <CardDataStats title={t('total_assignments')} total={assignment.length.toString()} />
          <CardDataStats
            title={t('total_complete_lesson')}
            total={progress.reduce((total, course) => total + (course?.completed ?? 0), 0).toString()}
          />
          <CardDataStats
            title={t('total_inprogress_lesson')}
            total={progress.reduce((total, course) => total + (course?.in_progress ?? 0), 0).toString()}
          />
        </div>

        <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
          <ChartTwo progress={progress} />
          <ChartThree progress={progress} />
          <div className='col-span-12 xl:col-span-8'>
            <TableOne assignments={assignment} />
          </div>
          <ChartOne assignments={assignment} />
        </div>
      </div>
    </div>
  )
}

export default ProgressPage
