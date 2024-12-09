'use client'
import * as React from 'react'
import { useEffect, useState, useMemo, Fragment } from 'react'
import { useTranslations } from 'next-intl'
import http from '../../../../utils/http'
import moment from 'moment'
import { useAppDispatch } from '../../../../hooks/store'
import { failPopUp, successPopUp } from '../../../../hooks/features/popup.slice'
import { Course } from '../../../../types/course.type'
import { Card, CardContent, CardFooter, CardHeader } from '../../../../../components/ui/card'
import Image from 'next/image'
import { MdOutlinePlayLesson, MdSystemUpdateAlt } from 'react-icons/md'
import { PiChalkboardTeacher } from 'react-icons/pi'
import { LiaLevelUpAltSolid } from 'react-icons/lia'
import LessonImg from '@/src/app/assets/lesson.png'
import { Separator } from '@/src/components/ui/separator'
import { Button } from '@/src/components/ui/button'
import { LessonScrollArea } from '@/src/components/LessonScrollArea/LessonScrollArea'
import { ProgressBar } from '@/src/components/ProgressBar/ProgressBar'
import Nodata from '@/src/components/Nodata/Nodata'
import Img_default from '@/src/app/assets/default_course_img.png'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

type AssignCourse = {
  course_id: number
  status: string
}

type StatusCourse = {
  course?: Course
  status?: string
  is_assigned?: boolean
}

const CourseDetail = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('show_course')
  const [course, setCourse] = useState<StatusCourse>()
  const dispatch = useAppDispatch()
  const [dataLoaded, setDataLoaded] = useState(false)
  const token = getCookie('authToken')
  const router = useRouter()

  useEffect(() => {
    document.title = t('title')
  })

  useEffect(() => {
    if (params.id) {
      const getCourse = async (id: string | string[]) => {
        try {
          const res: { data: { message: StatusCourse } } = await http.get(`courses/${id}`)
          const data = res.data.message
          setCourse(data)
          setDataLoaded(true)
        } catch (error: any) {
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        }
      }
      getCourse(params.id)
    }
  }, [dispatch, t, params.id])

  const handleAssignCourse = async (teacher_id: number) => {
    if (token && params.id) {
      if (course?.status === 'accepted') {
        router.push(`/user/lesson/${params.id}/?id_teacher=${teacher_id}`)
      } else {
        try {
          const res: { data: { message: AssignCourse } } = await http.post(`courses/${params.id}/assign`)
          const data = res.data.message
          setCourse((prevCourse) => ({ ...prevCourse, status: data.status }))
          dispatch(successPopUp(t('assign_success')))
        } catch {
          dispatch(failPopUp(t('assign_fail')))
        }
      }
    } else {
      router.push('/login')
      dispatch(failPopUp(t('please_login')))
    }
  }

  if (!course) {
    return (
      <div className='w-full flex items-center justify-center'>
        <ProgressBar
          onComplete={() => {
            if (dataLoaded) {
              setDataLoaded(true)
            }
          }}
          isComplete={!course}
          NoDataComponent={Nodata}
        />
      </div>
    )
  }

  return (
    <div className='w-full max-w-full'>
      <div className='flex flex-col lg:flex-row w-full max-w-full mt-5'>
        <div className='lg:flex-1 w-2/3'>
          <div className='lg:ml-20'>
            <div className='p-4 rounded-lg'>
              <h1 className='text-3xl font-extrabold truncate'>{course?.course?.title}</h1>
            </div>

            <div className='border border-gray-300 p-4 mt-6 rounded-lg bg-gray-100'>
              <p className='text-gray-600 leading-loose'>
                {course?.course?.description?.split('\n').map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
              </p>
            </div>
            <div className='flex justify-center w-full my-4'>
              <div className='flex flex-row gap-2 content-center'>
                <Image src={LessonImg.src} height={40} width={40} alt='lesson icon' />
                <span className='font-semibold py-3'>{t('list_lessons')}</span>
              </div>
            </div>
            <div className='flex justify-center'>
              <LessonScrollArea lessons={course?.course?.lessons || []} hidden={true} />
            </div>
          </div>
        </div>

        <div className='lg:flex-none w-1/3 pt-10 flex justify-center'>
          <Card className='w-[350px] shadow-lg rounded-lg sticky top-20 h-[525px]'>
            <CardHeader className='p-0'>
              <Image
                className='rounded-t-lg'
                src={course?.course?.image_url || Img_default.src}
                height={350}
                width={350}
                alt='course image'
              />
            </CardHeader>
            <CardContent className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center space-x-2'>
                  <MdOutlinePlayLesson size={24} className='text-primary' />
                  <span className='text-lg font-medium'>{t('lesson')}</span>
                </div>
                <span className='text-lg font-bold'>
                  {course?.course?.lessons?.length || 0} {t('lesson')}
                </span>
              </div>
              <Separator className='my-4' />
              <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center space-x-2'>
                  <PiChalkboardTeacher size={24} className='text-primary' />
                  <span className='text-lg font-medium'>{t('teacher')}</span>
                </div>
                <span className='text-lg font-bold'>{course?.course?.teacher?.name}</span>
              </div>
              <Separator className='my-4' />
              <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center space-x-2'>
                  <LiaLevelUpAltSolid size={24} className='text-primary' />
                  <span className='text-lg font-medium'>{t('level')}</span>
                </div>
                <span className='text-lg font-bold'>{course?.course?.level}</span>
              </div>
              <Separator className='my-4' />
              <div className='flex justify-between items-center'>
                <div className='flex items-center space-x-2'>
                  <MdSystemUpdateAlt size={24} className='text-primary' />
                  <span className='text-lg font-medium'>{t('update')}</span>
                </div>
                <span className='text-lg font-bold'>{moment(course?.course?.updated_at).format('D MMMM YYYY')}</span>
              </div>
            </CardContent>
            <CardFooter className='px-6'>
              <Button
                className='w-full py-3 text-lg font-semibold rounded'
                onClick={() => handleAssignCourse(course?.course?.teacher_id as number)}
                disabled={['pending'].includes(course?.status as string)}
              >
                {course.is_assigned && course.status === 'pending'
                  ? t('pending')
                  : course.is_assigned && course.status === 'accepted'
                    ? t('enrolled')
                    : t('enroll')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
