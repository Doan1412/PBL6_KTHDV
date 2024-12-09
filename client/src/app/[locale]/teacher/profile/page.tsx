'use client'
import Sidebar from '@/src/components/Sidebar'
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
import type { Profile } from '@/src/app/types/profile.type'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import { Button } from '@/src/components/ui/button'
import { CldUploadButton } from 'next-cloudinary'
import UploadButton from '@/src/components/ui/uploadButton'
import { hasCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { Teacher } from '@/src/app/types/teacher.type'
import { ProgressBar } from '@/src/components/ProgressBar/ProgressBar'
import findImg from '@/src/app/assets/rikimo_note.png'

type ProfileResponse = {
  data: {
    message: {
      profile: Teacher
    }
  }
}

export default function TeacherProfile() {
  const t = useTranslations('teacher_profile')
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [jobTitle, setJobTitle] = useState<string>('')
  const [created, setCreated] = useState<string>('')
  const [updated, setUpdated] = useState<string>('')
  const [profile, setProfile] = useState<Teacher>()
  const [bio, setBio] = useState<string>('')
  const [experience, setExperience] = useState<string>('')
  const [imageAvatar, setImageAvatar] = useState<string>('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

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
    if (hasCookie('authToken')) {
      const fetchProfile = async () => {
        try {
          const res: ProfileResponse = await http.get(`instructor/teachers/profile`)
          setProfile(res.data.message.profile)
        } catch (error: any) {
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        } finally {
          setDataLoaded(true)
        }
      }
      fetchProfile()
    }
    return
  }, [dispatch, t])

  useEffect(() => {
    setEmail(profile?.account?.email || '')
    setName(profile?.name || '')
    setUpdated(profile?.updated_at || '')
    setCreated(profile?.created_at || '')
    setBio(profile?.bio || '')
    setExperience(profile?.experience || '')
    setImageAvatar(profile?.image_url || '')
    setJobTitle(profile?.job_title || '')
  }, [
    profile?.account?.email,
    profile?.name,
    profile?.updated_at,
    profile?.created_at,
    profile?.bio,
    profile?.experience,
    profile?.image_url,
    profile?.job_title
  ])

  const changeProfile = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await http.patch('instructor/teachers/update_profile', {
        teacher: { name, job_title: jobTitle, bio, experience, image_url: imageAvatar }
      })
      dispatch(successPopUp(t('update_success')))
    } catch {
      dispatch(failPopUp(t('update_failed')))
    }
  }

  if (!profile) {
    return (
      <div className='flex h-full justify-center items-center'>
        <ProgressBar
          onComplete={() => {
            if (dataLoaded) {
              setDataLoaded(true)
            }
          }}
          isComplete={!profile}
          NoDataComponent={() => (
            <div className='flex flex-row'>
              <div className='container mx-auto my-8'>
                <h1 className='text-3xl font-bold mb-6 uppercase'>{t('title')}</h1>
                <div className='bg-primary text-white rounded-lg p-6 flex items-center justify-between space-x-8 w-full shadow-lg'>
                  <div>
                    <h1 className='text-2xl font-bold mb-2'>{t('no_profile.title')}</h1>
                    <p className='mb-4'>{t('no_profile.description')}</p>
                  </div>
                  <div>
                    <Image src={findImg.src} height={findImg.height} width={findImg.width} alt='rikimo' />
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    )
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
          <div className='absolute left-10 -bottom-14 rounded-full bg-primary border-white border-4 z-10'>
            <div className='relative'>
              <Avatar className='h-36 w-36'>
                <AvatarImage src={imageAvatar ? imageAvatar : avtDefault.src} />
              </Avatar>
              <div className='absolute bottom-2 right-2 z-10'>
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onSuccess={(result: any) => {
                    setImageAvatar(result?.info?.secure_url)
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
                  <Label htmlFor='name' className='text-lg font-bold'>
                    {t('name')}
                  </Label>
                  <Input
                    id='name'
                    className='border-gray-200 h-10'
                    placeholder={t('name')}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                  />
                </div>
                <div className='flex flex-col space-y-1.5 w-full mt-4'>
                  <Label htmlFor='job_title' className='text-lg font-bold'>
                    {t('job_title')}
                  </Label>
                  <Input
                    id='job_title'
                    className='border-gray-200 h-10'
                    placeholder={t('job_title')}
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value)
                    }}
                  />
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
                    value={
                      created && profile && profile.created_at
                        ? new Date(profile.created_at).toISOString().split('T')[0]
                        : ''
                    }
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
                    value={
                      updated && profile && profile.updated_at
                        ? new Date(profile?.updated_at).toISOString().split('T')[0]
                        : ''
                    }
                  />
                </div>
              </div>
              <div className='flex flex-col space-y-1.5 mt-4'>
                <Label htmlFor='email' className='text-lg font-bold'>
                  {t('email')}
                </Label>
                <Input
                  id='email'
                  readOnly={true}
                  className='border-gray-200 cursor-not-allowed bg-gray-200'
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                />
              </div>

              <div className='flex flex-col space-y-1.5 mt-4'>
                <Label htmlFor='bio' className='text-lg font-bold'>
                  {t('bio')}
                </Label>
                <Input
                  id='bio'
                  className='border-gray-200'
                  placeholder={t('bio')}
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value)
                  }}
                />
              </div>
              <div className='flex flex-col space-y-1.5 mt-4'>
                <Label htmlFor='experience' className='text-lg font-bold'>
                  {t('experience')}
                </Label>
                <Textarea
                  className='border-gray-200'
                  id='experience'
                  placeholder={t('experience')}
                  value={experience}
                  onChange={(e) => {
                    setExperience(e.target.value)
                  }}
                />
              </div>
              <Button className='mt-4' onClick={changeProfile}>
                {t('update')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
