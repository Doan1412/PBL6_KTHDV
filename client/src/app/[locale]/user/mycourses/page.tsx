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
const MyCourses = () => {
  const t = useTranslations('mycourse')
  const [courses, setCourses] = useState<Course[]>([])
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [dataLoaded, setDataLoaded] = useState(false)

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
    const fetchCourses = async () => {
      try {
        const res: { data: { message: { courses: Course[] } } } = await http.get(`users/enrolled_courses`)
        setCourses(res.data.message.courses)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
      } finally {
        setDataLoaded(true)
      }
    }
    fetchCourses()
  }, [dispatch, t])
  if (!courses || courses.length === 0) {
    return (
      <ProgressBar
        onComplete={() => {
          if (dataLoaded) {
            setDataLoaded(true)
          }
        }}
        isComplete={!courses || courses.length === 0}
        NoDataComponent={() => (
          <div className='flex flex-row'>
            <Sidebar activeItem={'myCourse'} />
            <div className='container mx-auto my-8'>
              <h1 className='text-3xl font-bold mb-6 uppercase'>{t('title')}</h1>
              <div className='bg-primary text-white rounded-lg p-6 flex items-center justify-between space-x-8 w-full shadow-lg'>
                <div>
                  <h1 className='text-2xl font-bold mb-2'>{t('no_courses.title')}</h1>
                  <p className='mb-4'>{t('no_courses.description')}</p>
                  <div className='space-x-4'>
                    <a
                      href='/'
                      className='inline-flex items-center px-4 py-2 bg-gray-50 text-teal-700 font-semibold rounded-md shadow hover:bg-gray-100 transition'
                    >
                      <svg
                        width='24px'
                        height='24px'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z'
                          stroke='currentColor'
                          strokeWidth='1.5'
                        />
                        <path
                          d='M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z'
                          stroke='currentColor'
                          strokeWidth='1.5'
                        />
                        <path d='M11 9H8' stroke='#1C274C' strokeWidth='1.5' strokeLinecap='round' />
                        <path
                          d='M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H13M19 15.5H17'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                        <path
                          d='M5 6H8M5.5 13H16.0218C16.9812 13 17.4609 13 17.8366 12.7523C18.2123 12.5045 18.4013 12.0636 18.7792 11.1818L19.2078 10.1818C20.0173 8.29294 20.4221 7.34853 19.9775 6.67426C19.5328 6 18.5054 6 16.4504 6H12'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                      {t('no_courses.store_button')}
                    </a>
                  </div>
                </div>
                <div>
                  <Image src={findImg.src} height={findImg.height} width={findImg.width} alt='rikimo' />
                </div>
              </div>
            </div>
          </div>
        )}
      />
    )
  }
  return (
    <div className='flex flex-row'>
      <Sidebar activeItem={'myCourse'} />
      <div className='container mx-auto my-8'>
        <h1 className='text-3xl font-bold mb-6 uppercase'>{t('title')}</h1>
        <TooltipProvider>
          <div className='flex flex-wrap gap-5 justify-start items-start'>
            {courses.map((course) => (
              <div key={course.id} className='flex-shrink-0'>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default MyCourses
