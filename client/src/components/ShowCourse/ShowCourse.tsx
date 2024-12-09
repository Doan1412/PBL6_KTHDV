'use client'
import { TooltipProvider } from '../ui/tooltip'
import CourseCard from '../CourseCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import SkeletonCourse from '../SkeletonCourse/SkeletonCourse'
import { useCategories } from '@/src/app/context/CategoriesContext'

export default function ShowCourse() {
  const category = useCategories()

  return (
    <section className='bg-white dark:bg-dark dark:text-white'>
      {category?.length === 0 ? (
        <div className='flex gap-20 justify-center'>
          <SkeletonCourse />
          <SkeletonCourse />
          <SkeletonCourse />
          <SkeletonCourse />
        </div>
      ) : (
        <div>
          {category?.map((category, index) => (
            <div className='container pb-14' key={index}>
              <h1 className='text-4xl font-bold text-left pb-10'>{category?.name}</h1>
              <div className='flex flex-row w-full'>
                <TooltipProvider>
                  <Carousel className='w-full'>
                    <CarouselContent className='-ml-4 md:-ml-1'>
                      {category?.courses?.map((course) => (
                        <CarouselItem key={course?.id} className='pl-4 mb-6 md:basis-1/2 lg:basis-1/4'>
                          <div className='mt-3 h-full'>
                            <CourseCard course={course} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
