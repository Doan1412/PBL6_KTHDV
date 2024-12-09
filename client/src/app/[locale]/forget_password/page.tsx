'use client'
import { FormEvent, useState } from 'react'
import BGImage from '@/src/app/assets/login_bg.svg'
import Image from 'next/image'
import http from '../../utils/http'
import { failPopUp, successPopUp } from '../../hooks/features/popup.slice'
import { useAppDispatch } from '../../hooks/store'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { useTranslations } from 'next-intl'
import { Button } from '@/src/components/ui/button'
import { toast } from 'sonner'

export default function ForgetPassword() {
  const t = useTranslations('account_reset_password')
  const [email, setEmail] = useState<string>('')

  const dispatch = useAppDispatch()

  const handleReset = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await http.post('accounts/forgot_password', {
        email
      })
      dispatch(successPopUp(t('check_mail')))
    } catch {
      dispatch(failPopUp(t('register_failed')))
    }
  }

  return (
    <div>
      <Image className='-z-50' src={BGImage.src} layout='fill' objectFit='cover' alt='Background' />
      <div className='flex flex-col items-center justify-center min-h-screen p-6'>
        <div className='max-w-md w-full bg-white shadow-md rounded-lg p-8'>
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
        </div>
        <div className='mt-2'>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              handleReset(e)
              toast(t('processing'), {
                description: t('processing_check'),
                action: {
                  label: t('close'),
                  onClick: () => {}
                }
              })
            }}
          >
            {t('reset_password')}
          </Button>
        </div>
      </div>
    </div>
  )
}
