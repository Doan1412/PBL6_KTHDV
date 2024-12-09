'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import http from '../../utils/http'
import { useTranslations } from 'next-intl'
import { getCookie, setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '../../hooks/store'
import { failPopUp, successPopUp } from '../../hooks/features/popup.slice'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google'
import RImage from '@/src/app/assets/RImage.png'
import LoginImage from '@/src/app/assets/login_img.png'
import BGImage from '@/src/app/assets/login_bg.svg'
import Link from 'next/link'
import Flag_EN from '@/src/app/assets/england.png'
import Flag_VI from '@/src/app/assets/vietnam.png'
import { AuthenticationType } from '../../types/authentication.type'

export default function LoginPage() {
  const t = useTranslations('login')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    document.title = t('title')
  }, [t])

  useEffect(() => {
    const token = getCookie('authToken')
    if (token) {
      const role = getCookie('role')
      if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      return
    }
  }, [router])

  const handleLoginSuccess = (response: { message: AuthenticationType }) => {
    const token = response.message.jwt
    const role: string = response.message.roles
    setCookie('authToken', token)
    setCookie('role', role)
    dispatch(successPopUp(t('login_successful')))
    if (role === 'admin') {
      router.push('/admin')
    } else if (role === 'teacher') {
      router.push('/teacher')
    } else {
      router.push('/')
    }
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const response = await http.post('auth/login', { auth: { email: email, password: password } })
      handleLoginSuccess(response.data)
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || t('error')
      dispatch(failPopUp(message))
    }
  }

  const responseGoogle = async (response: CredentialResponse) => {
    try {
      const res = await http.post(`auth/google_oauth2`, { auth: { id_token: response.credential } })
      handleLoginSuccess(res.data)
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || t('error')
      dispatch(failPopUp(message))
    }
  }

  return (
    <div className='relative min-h-screen'>
      <Image
        className='absolute top-0 left-0 w-full h-full object-cover -z-50'
        src={BGImage.src}
        layout='fill'
        objectFit='cover'
        alt='Background'
      />
      <div className='flex flex-col lg:flex-row min-h-screen z-0'>
        <div className='hidden lg:flex flex-col basis-1/2 justify-end ml-36'>
          <Link href='/'>
            <Image className='max-w-md mb-5' src={RImage.src} alt='img' width={200} height={200} />
          </Link>
          <p className='text-3xl font-bold w-[500px] mb-10'>{t('welcome_message')}</p>
          <Image className='max-w-md' src={LoginImage.src} alt='img' width={500} height={200} />
        </div>

        <div className='flex basis-full lg:basis-1/2 items-center justify-center'>
          <Card className='w-[90%] max-w-[500px] p-6'>
            <CardHeader>
              <CardTitle className='text-3xl'>{t('sign_in')}</CardTitle>
              <CardDescription>{t('sign_in_prompt')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className='grid w-full items-center gap-4'>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='email' className='text-lg font-bold'>
                      {t('email')}
                    </Label>
                    <Input
                      id='email'
                      placeholder={t('email')}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                    />
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='password' className='text-lg font-bold'>
                      {t('password')}
                    </Label>
                    <Input
                      id='password'
                      type='password'
                      placeholder={t('password')}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className='flex-col justify-center w-full'>
              <div className='flex flex-col items-center w-full'>
                <div className='mb-8'>
                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                      handleLogin(e)
                    }}
                  >
                    {t('sign_in')}
                  </Button>
                </div>
                <div className='flex items-center justify-center mb-8 relative w-full'>
                  <div className='flex-grow border-t border-gray-500'></div>
                  <span className='mx-4 text-sm text-gray-500 whitespace-nowrap'>{t('or_continue_with')}</span>
                  <div className='flex-grow border-t border-gray-500'></div>
                </div>
                <div>
                  <GoogleOAuthProvider clientId={process.env.clientId as string}>
                    <GoogleLogin onSuccess={responseGoogle} onError={() => {}} />
                  </GoogleOAuthProvider>
                </div>
              </div>
              <div className='flex gap-3 mt-4'>
                <p>{t('forget_password')}</p>
                <Link href='/forget_password'>
                  <p className='font-bold text-primary'>{t('page_forget_password')}</p>
                </Link>
              </div>
              <div className='flex gap-3 mt-4'>
                <p>{t('sign_up_account')}</p>
                <Link href='/signup'>
                  <p className='font-bold text-primary'>{t('page_sign_up')}</p>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className='hidden lg:grid grid-cols-2 content-end h-full gap-4 mr-5 pb-2 text-xl font-bold'>
          <Link href='/en/login'>
            <Image src={Flag_EN} alt='Flag EN' className='w-9 h-7' />
          </Link>
          <Link href='/vi/login'>
            <Image src={Flag_VI} alt='Flag VI' className='w-9 h-7' />
          </Link>
        </div>
      </div>
    </div>
  )
}
