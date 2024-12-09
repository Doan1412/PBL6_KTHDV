'use client'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../app/hooks/store'
import { resetPopUp } from '../../app/hooks/features/popup.slice'
import { useToast } from '../ui/use-toast'

export default function Popup() {
  const t = useTranslations('noti')
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { type, text } = useSelector((state: RootState) => state.popup)

  useEffect(() => {
    if (type) {
      if (type === 'fail') {
        toast({
          variant: 'destructive',
          title: t('error_message'),
          description: text
        })
      } else if (type === 'success') {
        toast({
          variant: 'success',
          title: t('success_message'),
          description: text
        })
      }
      dispatch(resetPopUp())
    }
  }, [type, text, toast, dispatch, t])

  return null
}
