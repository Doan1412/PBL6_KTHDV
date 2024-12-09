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

export default function Profile() {
  const t = useTranslations('profile')
  const [email, setEmail] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [sex, setSex] = useState<string>('')
  const [created, setCreated] = useState<string>('')
  const [update, setUpdate] = useState<string>('')
  const [profile, setProfile] = useState<Profile>()
  const [bio, setBio] = useState<string>('')
  const [goals, setGoals] = useState<string>('')
  const [imageAvatar, setImageAvatar] = useState<string>('')
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
          const res: { data: { message: Profile } } = await http.get(`users/profile`)
          setProfile(res.data.message)
        } catch (error: any) {
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        }
      }
      fetchProfile()
    }
    return
  }, [dispatch, t])

  useEffect(() => {
    setEmail(profile?.profile?.account?.email || '')
    setFullName(profile?.profile?.full_name || '')
    setUpdate(profile?.profile?.updated_at || '')
    setCreated(profile?.profile?.created_at || '')
    setSex(profile?.profile?.sex || '')
    setBio(profile?.profile?.bio || '')
    setGoals(profile?.profile?.goals || '')
    setImageAvatar(profile?.profile?.image_url || '')
  }, [
    profile?.profile?.account?.email,
    profile?.profile?.full_name,
    profile?.profile?.updated_at,
    profile?.profile?.created_at,
    profile?.profile?.sex,
    profile?.profile?.goals,
    profile?.profile?.bio,
    profile?.profile?.image_url
  ])

  const changeProfile = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await http.patch('users/update_profile', {
        user: { full_name: fullName, sex, bio, goals, image_url: imageAvatar }
      })
      dispatch(successPopUp(t('update_success')))
    } catch {
      dispatch(failPopUp(t('update_failed')))
    }
  }

  return (
    <div className='flex flex-row'>
      <Sidebar activeItem={'profile'} />
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
                  <Label htmlFor='full_name' className='text-lg font-bold'>
                    {t('full_name')}
                  </Label>
                  <Input
                    id='text'
                    className='border-gray-200 h-10'
                    placeholder={t('full_name')}
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                    }}
                  />
                </div>
                <div className='flex flex-col space-y-1.5 w-full mt-4'>
                  <Label htmlFor='sex' className='text-lg font-bold'>
                    {t('sex')}
                  </Label>
                  <Select
                    value={sex}
                    onValueChange={(e) => {
                      setSex(e)
                    }}
                  >
                    <SelectTrigger className='w-full border-gray-200'>
                      <SelectValue placeholder={t('choose_sex')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t('sex')}</SelectLabel>
                        <SelectItem value='male'>{t('male')}</SelectItem>
                        <SelectItem value='female'>{t('female')}</SelectItem>
                        <SelectItem value='other'>{t('other')}</SelectItem>
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
                    value={
                      created && profile && profile.profile?.created_at
                        ? new Date(profile.profile.created_at).toISOString().split('T')[0]
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
                      update && profile && profile.profile?.updated_at
                        ? new Date(profile?.profile?.updated_at).toISOString().split('T')[0]
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
                <Label htmlFor='goals' className='text-lg font-bold'>
                  {t('goals')}
                </Label>
                <Textarea
                  className='border-gray-200'
                  id='input'
                  rows={5}
                  placeholder={t('goals')}
                  value={goals}
                  onChange={(e) => {
                    setGoals(e.target.value)
                  }}
                />
              </div>
            </form>
            <div className='mt-8'>
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  changeProfile(e)
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
