import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Course } from '@/src/app/types/course.type'
import Img_default from '@/src/app/assets/default_course_img.png'
import Link from 'next/link'
interface CourseCardProps {
  course: Course
  teacher?: string
}

const CourseCard = ({ course, teacher }: CourseCardProps) => {
  const router = useRouter()
  const t = useTranslations('course_card')
  const handleViewDetails = () => {
    router.push(`/user/courses/${course.id}`)
  }

  return (
    <Card className='w-[300px] max-w-sm mx-auto flex flex-col h-full transition-transform duration-300 ease-in-out transform hover:scale-105'>
      <CardHeader className='pb-2'>
        <Image
          src={course?.image_url || Img_default.src}
          alt={course?.title || ''}
          height={38}
          width={500}
          className='w-full h-38 object-cover rounded-lg'
        />
        <CardDescription className='overflow-hidden whitespace-nowrap text-ellipsis'>
          {course?.category?.name ? `${t('category')} : ${course?.category?.name}` : ''}
        </CardDescription>
        <div className='w-full'>
          <Tooltip>
            <TooltipTrigger className='w-full text-left'>
              <Link href={`/user/courses/${course.id}`}>
                <CardTitle className='text-lg uppercase font-bold truncate'>{course?.title}</CardTitle>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='top'>
              <p>{course?.title}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent className='flex-grow'>
        <div className='mb-3 rounded-lg'>
          <h1 className='text-3xl font-extrabold truncate'>
            <div className='flex items-center'>
              {[...Array(5)].map((_, index) => {
                const ratingThreshold = index + 1
                return (
                  <svg
                    key={index}
                    className={`w-4 h-4 ms-1 ${
                      (course?.average_rating ?? 0) >= ratingThreshold
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
                {course?.average_rating} {t('average_rating')}
              </p>
            </div>
          </h1>
        </div>
        <div className='flex items-center mb-3 space-x-2'>
          <svg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M10.05 2.53004L4.03002 6.46004C2.10002 7.72004 2.10002 10.54 4.03002 11.8L10.05 15.73C11.13 16.44 12.91 16.44 13.99 15.73L19.98 11.8C21.9 10.54 21.9 7.73004 19.98 6.47004L13.99 2.54004C12.91 1.82004 11.13 1.82004 10.05 2.53004Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M5.63 13.08L5.62 17.77C5.62 19.04 6.6 20.4 7.8 20.8L10.99 21.86C11.54 22.04 12.45 22.04 13.01 21.86L16.2 20.8C17.4 20.4 18.38 19.04 18.38 17.77V13.13'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path d='M21.4 15V9' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
          <p
            className='font-medium cursor-pointer'
            onClick={() => {
              router.push(`/user/teacher/${course?.teacher_id}`)
            }}
          >
            {course?.teacher?.name ? course?.teacher?.name : teacher || ''}
          </p>
        </div>

        <div className='flex items-center space-x-2'>
          <svg width='24px' height='24px' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
            <path
              stroke='#ffffff'
              d='M4.29289,4.297105 L8,0.59 L11.7071,4.297105 C12.0976,4.687635 12.0976,5.320795 11.7071,5.711315 C11.3166,6.101845 10.6834,6.101845 10.2929,5.711315 L9,4.418425 L9,11.004215 C9,11.004515 9,11.003915 9,11.004215 L9,12.004215 C9,12.556515 9.44772,13.004215 10,13.004215 L14,13.004215 C14.5523,13.004215 15,13.451915 15,14.004215 C15,14.556515 14.5523,15.004215 14,15.004215 L10,15.004215 C8.34315,15.004215 7,13.661115 7,12.004215 L7,4.418425 L5.70711,5.711315 C5.31658,6.101845 4.68342,6.101845 4.29289,5.711315 C3.90237,5.320795 3.90237,4.687635 4.29289,4.297105 Z'
            />
          </svg>
          <span className=' '>{course?.level}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleViewDetails} className='w-full'>
          {t('detail')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CourseCard
