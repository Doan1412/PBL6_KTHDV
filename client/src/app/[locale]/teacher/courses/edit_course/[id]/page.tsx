'use client'
import { useTranslations } from 'next-intl'
import React, { FormEvent, useEffect, useState } from 'react'
import updateProfile from '@/src/app/assets/updateProfile.png'
import avtDefault from '@/src/app/assets/avtDefault.png'
import Image from 'next/image'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import { Textarea } from '@/src/components/ui/textarea'
import http from '@/src/app/utils/http'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import { Button } from '@/src/components/ui/button'
import { CldUploadButton } from 'next-cloudinary'
import UploadButton from '@/src/components/ui/uploadButton'
import { hasCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { Course } from '@/src/app/types/course.type'
import { useCategories } from '@/src/app/context/CategoriesContext'

type resCourse = {
  data: {
    message: {
      course: Course
    }
  }
}

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const t = useTranslations('edit_course')
  const [level, setLevel] = useState<string>('')
  const [category, setCategory] = useState<string>()
  const [course, setCourse] = useState<Course>()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const router = useRouter()
  const dispatch = useAppDispatch()

  const listCategories = useCategories()

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    if (!hasCookie('authToken')) {
      router.push('/login')
      dispatch(failPopUp(t('login_first')))
      return
    }
  }, [router, dispatch, t])

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const res: resCourse = await http.get(`instructor/courses/${params.id}`)
        setCourse(res.data.message.course)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
      }
    }
    fetchCourseDetail()
  }, [dispatch, t, params.id])

  useEffect(() => {
    setTitle(course?.title as string)
    setDescription(course?.description as string)
    setLevel(course?.level as string)
    setCategory(course?.category?.name as string)
    setImageUrl(course?.image_url as string)
  }, [course?.category?.name, course?.description, course?.image_url, course?.level, course?.title])

  const changeCourse = async (event: FormEvent) => {
    event.preventDefault()

    const categoryId = findCategoryIdByName(category ? category : (course?.category?.name as string))

    if (!categoryId) {
      dispatch(failPopUp(t('category_not_found')))
      return
    }

    try {
      const res: resCourse = await http.patch(`instructor/courses/${params.id}`, {
        title,
        description,
        level,
        category_id: categoryId,
        image_url: imageUrl
      })
      setCourse(res.data.message.course)
      router.push(`/teacher/courses`)
      dispatch(successPopUp(t('update_success')))
    } catch (e: any) {
      const message = e?.response?.data?.error || e.message || t('error')
      dispatch(failPopUp(message))
    }
  }

  const findCategoryIdByName = (name: string) => {
    const category = listCategories?.find((cat) => cat.name === name)
    return category ? category.id : undefined
  }

  return (
    <div className='flex flex-row'>
      <div className='container mx-auto my-8'>
        <div className='relative'>
          <div className='bg-primary text-white rounded-lg p-6 flex items-center justify-between space-x-8 w-full shadow-lg'>
            <div className='mb-16'>
              <h1 className='text-2xl font-bold mb-2'>{t('title')}</h1>
              <p className='mb-4'>{t('description')}</p>
            </div>
            <div>
              <Image src={updateProfile.src} height={updateProfile.height} width={updateProfile.width} alt='rikimo' />
            </div>
          </div>
          <div className='absolute left-10 -bottom-14 rounded-xl bg-primary border-white border-4 z-10'>
            <div className='relative'>
              <Avatar className='h-36 w-44 rounded-lg'>
                <AvatarImage src={imageUrl ? imageUrl : avtDefault.src} />
              </Avatar>
              <div className='absolute bottom-2 right-2 z-10'>
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onSuccess={(result: any) => {
                    setImageUrl(result?.info?.secure_url)
                  }}
                  uploadPreset='s2lo0hgq'
                >
                  <UploadButton />
                </CldUploadButton>
              </div>
            </div>
          </div>
        </div>
        <div className='flex mt-24 justify-center'>
          <div className='flex-col w-full'>
            <form>
              <div className='grid grid-cols-1 md:grid-cols-2 items-center grid-flow-row gap-4'>
                <div className='flex flex-col space-y-1.5 mt-4'>
                  <Label htmlFor='title' className='text-lg font-bold'>
                    {t('title')}
                  </Label>
                  <Input
                    id='text'
                    className='border-gray-200 h-10'
                    placeholder={t('title')}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                  />
                </div>
                <div className='flex flex-col space-y-1.5 w-full mt-4'>
                  <Label htmlFor='level' className='text-lg font-bold'>
                    {t('level')}
                  </Label>
                  <Select
                    value={level}
                    onValueChange={(e) => {
                      setLevel(e)
                    }}
                  >
                    <SelectTrigger className='w-full border-gray-200'>
                      <SelectValue placeholder={t('choose_level')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t('level')}</SelectLabel>
                        <SelectItem value='N1'>{t('N1')}</SelectItem>
                        <SelectItem value='N2'>{t('N2')}</SelectItem>
                        <SelectItem value='N3'>{t('N3')}</SelectItem>
                        <SelectItem value='N4'>{t('N4')}</SelectItem>
                        <SelectItem value='N5'>{t('N5')}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='created_at' className='text-lg font-bold'>
                    {t('created_at')}
                  </Label>
                  <Input
                    id='created_at'
                    className='border-gray-200 cursor-not-allowed bg-gray-200'
                    readOnly={true}
                    type='date'
                    placeholder={t('created_at')}
                    value={course && course?.created_at ? new Date(course?.created_at).toISOString().split('T')[0] : ''}
                  />
                </div>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='updated_at' className='text-lg font-bold'>
                    {t('updated_at')}
                  </Label>
                  <Input
                    id='updated_at'
                    type='date'
                    readOnly={true}
                    className='border-gray-200 cursor-not-allowed bg-gray-200'
                    placeholder={t('updated_at')}
                    value={course && course?.updated_at ? new Date(course?.updated_at).toISOString().split('T')[0] : ''}
                  />
                </div>
              </div>
              <div className='flex flex-col space-y-1.5 w-full mt-4'>
                <Label htmlFor='category' className='text-lg font-bold'>
                  {t('category')}
                </Label>
                <Select
                  value={category === '' ? course?.category?.name : category}
                  onValueChange={(e) => {
                    setCategory(e)
                  }}
                >
                  <SelectTrigger className='w-full border-gray-200'>
                    <SelectValue placeholder={t('choose_level')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('level')}</SelectLabel>
                      {listCategories?.map((category) => (
                        <SelectItem key={category.id} value={category?.name as string}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col space-y-1.5 mt-4'>
                <Label htmlFor='goals' className='text-lg font-bold'>
                  {t('goals')}
                </Label>
                <Textarea
                  className='border-gray-200'
                  id='input'
                  rows={5}
                  placeholder={t('goals')}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                />
              </div>
            </form>
            <div className='mt-8'>
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  changeCourse(e)
                }}
              >
                {t('changeProfile')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
