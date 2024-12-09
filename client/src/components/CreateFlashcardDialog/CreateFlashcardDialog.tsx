import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import { useAppDispatch } from '@/src/app/hooks/store'
import http from '@/src/app/utils/http'
import { useTranslations } from 'next-intl'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/components/ui/tooltip'

type CreateFlashcardDialogProps = {
  lessonId: number
}

const CreateFlashcardDialog: React.FC<CreateFlashcardDialogProps> = ({ lessonId }) => {
  const t = useTranslations('add_flashcard')
  const [frontText, setFrontText] = useState('')
  const [backText, setBackText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await http.post(`/flashcards`, {
        lesson_id: lessonId,
        front_text: frontText,
        back_text: backText
      })
      setFrontText('')
      setBackText('')
      dispatch(successPopUp(t('success_message')))
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || t('error_message')
      dispatch(failPopUp(message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AlertDialogTrigger asChild>
              <PlusIcon className='w-6 h-6 text-primary' />
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className='ml-[50%] w-full'>{t('view_lessons_tooltip')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('create_flashcard_title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('create_flashcard_description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className='flex flex-col space-y-2'>
          <Input
            placeholder={t('front_text_placeholder')}
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
          />
          <Input
            placeholder={t('back_text_placeholder')}
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? t('submitting') : t('submit')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateFlashcardDialog
