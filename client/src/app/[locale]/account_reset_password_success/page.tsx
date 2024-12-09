'use client'
import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BGImage from '@/src/app/assets/login_bg.svg'
import Image from 'next/image'
import http from '../../utils/http'
import { failPopUp, successPopUp } from '../../hooks/features/popup.slice'
import { useAppDispatch } from '../../hooks/store'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { useTranslations } from 'next-intl'

export default function ResetPassword() {
  const params = useSearchParams()
  const [password, setPassword] = useState<string>('')
  const t = useTranslations('account_password_new')
  const token = params.get('token')
  const router = useRouter()

  const dispatch = useAppDispatch()

  const handleReset = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await http.put(`accounts/reset_password/${token}`, {
        password
      })
      dispatch(successPopUp(t('password_reset_success')))
      router.push('/login')
    } catch {
      dispatch(failPopUp(t('password_reset_failed')))
    }
  }

  return (
    <div>
      <Image className='-z-50' src={BGImage.src} layout='fill' objectFit='cover' alt='Background' />
      <div className='flex flex-col items-center justify-center min-h-screen p-6'>
        <div className='max-w-md w-full bg-white shadow-md rounded-lg p-8'>
          <div className='flex flex-col space-y-1.5'>
            <Label htmlFor='email' className='text-lg font-bold'>
              {t('password_new')}
            </Label>
            <Input
              id='password_new'
              type='password'
              placeholder={t('password_new')}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>
        </div>
        <div className='mt-2'>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              handleReset(e)
            }}
          >
            {t('reset_password')}
          </Button>
        </div>
      </div>
    </div>
  )
}
