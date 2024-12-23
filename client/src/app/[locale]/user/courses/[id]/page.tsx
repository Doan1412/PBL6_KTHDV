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

type RatingTypes = {
  data: {
    message: {
      rating: number
      average_rating: number
    }
  }
}

const CourseDetail = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('show_course')
  const [course, setCourse] = useState<StatusCourse>()
  const [averageRating, SetAverageRating] = useState<number>(0)
  const [ratingStar, SetRatingStar] = useState<number>(0)
  const [isRated, setIsRated] = useState<boolean>(ratingStar > 0)
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

  useEffect(() => {
    if (course?.course?.course_ratings && course.course.course_ratings.length > 0) {
      SetRatingStar(course.course.course_ratings[0].rating || 0)
      SetAverageRating(course.course.average_rating || 0)
    }
  }, [course])

  const handleRatingClick = async (index: number) => {
    if (!isRated) {
      SetRatingStar(index + 1)
    }
  }

  const handleSubmitRating = async (index: number) => {
    if (!isRated) {
      try {
        const res: RatingTypes = await http.post(`courses/${params.id}/ratings`, {
          course_rating: {
            rating: index
          }
        })
        const data = res.data.message
        dispatch(successPopUp(t('rating_success')))
        SetRatingStar(data.rating)
        SetAverageRating(data.average_rating)
        setIsRated(true)
      } catch (error: any) {
        dispatch(failPopUp(error?.response?.data?.error))
      }
    }
  }

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
            {course?.status === 'accepted' && (
              <div className='pl-4 rounded-lg'>
                <h1 className='text-3xl font-extrabold truncate'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, index) => {
                      const ratingThreshold = index + 1
                      return (
                        <svg
                          key={index}
                          className={`w-4 h-4 ms-1 ${
                            (ratingStar ?? 0) >= ratingThreshold
                              ? 'text-yellow-300'
                              : 'text-gray-300 dark:text-gray-500'
                          }`}
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          viewBox='0 0 22 20'
                          onClick={() => {
                            if (ratingStar === 0) {
                              handleRatingClick(index)
                              handleSubmitRating(index + 1)
                            }
                          }}
                          style={{ cursor: ratingStar === 0 ? 'pointer' : 'not-allowed' }}
                        >
                          <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                        </svg>
                      )
                    })}
                    <p className='ml-4 ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>{t('review_star')}</p>
                  </div>
                </h1>
              </div>
            )}

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
          <Card className='w-[350px] shadow-lg rounded-lg sticky top-20 h-[70%]'>
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
              <div className='rounded-lg'>
                <h1 className='text-3xl font-extrabold truncate'>
                  <div className='flex items-center justify-end'>
                    {[...Array(5)].map((_, index) => {
                      const ratingThreshold = index + 1
                      return (
                        <svg
                          key={index}
                          className={`w-4 h-4 ms-1 ${
                            (averageRating ?? 0) >= ratingThreshold
                              ? 'text-yellow-300'
                              : 'text-gray-300 dark:text-gray-500'
                          }`}
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          viewBox='0 0 22 20'
                        >
                          <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                        </svg>
                      )
                    })}
                    <p className='ml-4 ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
                      {averageRating} {t('average_rating')}
                    </p>
                  </div>
                </h1>
              </div>
              <Separator className='my-4' />
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
