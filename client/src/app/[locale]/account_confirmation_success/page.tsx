'use client'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BGImage from '@/src/app/assets/login_bg.svg'
import Image from 'next/image'
import http from '../../utils/http'
import { failPopUp, successPopUp } from '../../hooks/features/popup.slice'
import { useAppDispatch } from '../../hooks/store'

export default function Activate() {
  const params = useSearchParams()
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const token = params.get('token')

  const dispatch = useAppDispatch()

  const controller = useMemo(() => new AbortController(), [])

  useEffect(() => {
    if (token) {
      const getConfirmation = async () => {
        try {
          const response = await http.get(`accounts/activate/${token}`)
          controller.abort()
          const messenger = response.data.message
          setMessage(messenger)
          dispatch(successPopUp(messenger))
        } catch (error: any) {
          setError(error.response.data.error)
          dispatch(failPopUp(error.response.data.error))
        }
      }
      getConfirmation()
    }
  }, [token, dispatch, controller])

  return (
    <div>
      <Image className='-z-50' src={BGImage.src} layout='fill' objectFit='cover' alt='Background' />
      <div className='flex flex-col items-center justify-center min-h-screen p-6'>
        <div className='max-w-md w-full bg-white shadow-md rounded-lg p-8'>
          {message && <p className='text-green-600 font-semibold'>{message}</p>}
          {error && <p className='text-red-600 font-semibold'>{error}</p>}
          {!message && !error && (
            <div className='flex items-center justify-center'>
              <svg
                className='animate-spin h-8 w-8 text-[#aae4e8]'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8H4z'></path>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
