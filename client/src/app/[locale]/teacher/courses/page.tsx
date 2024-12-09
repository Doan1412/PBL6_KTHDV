'use client'
import { useAppDispatch } from '@/src/app/hooks/store'
import { Pagy } from '@/src/app/types/pagy.type'
import http from '@/src/app/utils/http'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/src/components/ui/pagination'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import { Course } from '@/src/app/types/course.type'
import CoursesTable from '@/src/components/CoursesTable'
import { useCategories } from '@/src/app/context/CategoriesContext'
import { Textarea } from '@/src/components/ui/textarea'
import { Label } from '@/src/components/ui/label'
import { CldUploadButton } from 'next-cloudinary'

type ResponseCourses = {
  data: {
    message: {
      courses: Course[]
      pagy: Pagy
    }
  }
}

export default function CoursesPage() {
  const t = useTranslations('list_course')
  const [courses, setCourses] = useState<Course[]>([])
  const category = useCategories()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchCourse, setSearchCourse] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [searchTriggered, setSearchTriggered] = useState(true)
  const dispatch = useAppDispatch()
  const [categoryId, setCategoryId] = useState<number>(-1)
  const [title, setTitle] = useState<string>('')
  const [level, setLevel] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    if (searchTriggered) {
      const getListCourses = async () => {
        try {
          const res: ResponseCourses = await http.get(
            `instructor/courses?page=${currentPage}&q[title_cont]=${searchCourse}&q[level_eq]=${filterLevel}&q[category_name_cont]=${filterCategory}`
          )
          const data = res.data.message
          setDataLoaded(true)
          setCourses(data.courses)
          setTotalPages(data.pagy.pages ?? 1)
          setCurrentPage(data.pagy.current_page ?? 1)
        } catch (error: any) {
          setDataLoaded(true)
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        }
      }
      getListCourses()
      setSearchTriggered(false)
    }
  }, [currentPage, searchTriggered, dispatch, t, searchCourse, filterLevel, filterCategory])

  const handlePageChange = (page: number | 'next' | 'prev') => {
    setCurrentPage((prevPage) => {
      const newPage = page === 'next' ? prevPage + 1 : page === 'prev' ? prevPage - 1 : page

      if (newPage >= 1 && newPage <= totalPages) {
        setSearchTriggered(true)
        return newPage
      }

      return prevPage
    })
  }

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchTriggered(true)
  }

  const resetForm = () => {
    setTitle('')
    setCategoryId(1)
    setLevel('')
    setDescription('')
    setImageUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    const requestData = {
      request_course: {
        category_id: categoryId,
        title,
        level,
        description,
        image_url: imageUrl
      }
    }
    try {
      await http.post('instructor/request_courses', requestData)
      dispatch(successPopUp(t('update_success')))
    } catch {
      dispatch(failPopUp(t('update_failed')))
    } finally {
      setIsOpen(false)
      resetForm()
    }
  }

  return (
    <div className='h-full'>
      <div className='flex items-center justify-between mb-4 ml-5'>
        <div className='flex'>
          <Input
            type='text'
            placeholder={t('searchCourse')}
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
            className='mr-2 w-2/6 p-[19px]'
          />
          <Select
            onValueChange={(e: string) => {
              setFilterCategory(e)
            }}
          >
            <SelectTrigger className='w-1/6 mr-2'>
              <SelectValue placeholder={t('filterCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('categories')}</SelectLabel>
                {category?.map((category, index) => (
                  <SelectItem key={index} value={category?.name as string}>
                    {category?.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(e: string) => {
              setFilterLevel(e)
            }}
          >
            <SelectTrigger className='w-36 mr-2'>
              <SelectValue placeholder={t('filterLevel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('status')}</SelectLabel>
                <SelectItem value='N1'>{t('N1')}</SelectItem>
                <SelectItem value='N2'>{t('N2')}</SelectItem>
                <SelectItem value='N3'>{t('N3')}</SelectItem>
                <SelectItem value='N4'>{t('N4')}</SelectItem>
                <SelectItem value='N5'>{t('N5')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} className='border p-[19px] text-white'>
            {t('search')}
          </Button>
        </div>
        <div>
          <Button onClick={() => setIsOpen(true)} className='mr-24'>
            {t('add_course')}
          </Button>
          {isOpen && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30'>
              <div className='bg-white p-6 rounded-md shadow-lg w-[500px] dark:bg-black'>
                <h2 className='text-xl font-bold mb-4'>{t('create_request_title')}</h2>
                <div className='grid w-full items-center gap-4 px-4'>
                  <div className='flex flex-col space-y-1.5'>
                    <Label className='font-bold'>{t('course_title')}</Label>
                    <Input
                      type='text'
                      placeholder={t('course_title')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label className='font-bold'>{t('status')}</Label>
                    <Select onValueChange={(value: string) => setLevel(value)} defaultValue={level}>
                      <SelectTrigger className='w-full' id='select-level'>
                        <SelectValue placeholder={t('status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t('status')}</SelectLabel>
                          {['N1', 'N2', 'N3', 'N4', 'N5'].map((levelOption, index) => (
                            <SelectItem key={index} value={levelOption}>
                              {levelOption}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label className='font-bold'>{t('select_category')}</Label>
                    <Select onValueChange={(value: string) => setCategoryId(parseInt(value))}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t('categories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t('categories')}</SelectLabel>
                          {category?.map((category, index) => (
                            <SelectItem key={index} value={category?.id?.toString() ?? '1'}>
                              {category?.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label className='font-bold'>{t('course_description')}</Label>
                    <Textarea
                      placeholder={t('course_description')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className='flex flex-col space-y-1.5 w-full z-auto justify-start'>
                    <Label className='font-bold'>{t('cover_img')}</Label>
                    <CldUploadButton
                      options={{ maxFiles: 1 }}
                      onSuccess={(result: any) => {
                        setImageUrl(result?.info?.secure_url)
                      }}
                      onError={(error: any) => {
                        dispatch(failPopUp('Upload failed, please try again'))
                      }}
                      uploadPreset='s2lo0hgq'
                    >
                      <label className='flex bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-3 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='w-6 mr-2 fill-white inline'
                          viewBox='0 0 32 32'
                        >
                          <path
                            d='M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z'
                            data-original='#000000'
                          />
                          <path
                            d='M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z'
                            data-original='#000000'
                          />
                        </svg>
                        {t('upload')}
                      </label>
                    </CldUploadButton>

                    {imageUrl && <p className='text-green-500 font-medium mt-2'>{t('upload_success')}</p>}
                  </div>
                </div>
                <div className='flex justify-end mt-4'>
                  <Button onClick={() => setIsOpen(false)} variant='outline' className='mr-3'>
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleSubmit}>{t('submit')}</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CoursesTable courses={courses} dataLoaded={dataLoaded} setCourses={setCourses} role='instructor' />
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious className='cursor-pointer' onClick={() => handlePageChange('prev')}>
                {t('previous')}
              </PaginationPrevious>
            </PaginationItem>
          )}

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink className='cursor-pointer' onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext className='cursor-pointer' onClick={() => handlePageChange('next')}>
                {t('next')}
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
