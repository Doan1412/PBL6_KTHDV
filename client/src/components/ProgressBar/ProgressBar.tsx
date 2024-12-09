'use client'
import { Progress } from '../ui/progress'
import Image from 'next/image'
import imageUrl from '../../app/assets/loadpage.png'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface ProgressBarProps {
  onComplete: () => void
  isComplete: boolean
  NoDataComponent?: React.ComponentType
}

export function ProgressBar({ onComplete, isComplete, NoDataComponent }: ProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showNoData, setShowNoData] = useState(false)
  const t = useTranslations('nodata')

  useEffect(() => {
    let loadingProgress = 0
    let increment = 10
    const initialSpeed = 100
    const decreaseSpeedAfter = 5000

    const interval = setInterval(() => {
      loadingProgress += increment
      setProgress(Math.min(loadingProgress, 100))

      if (loadingProgress >= 100 || Date.now() - startTime > 12000) {
        clearInterval(interval)
        setIsVisible(false)
        setShowNoData(true)
        onComplete()
      }
      if (isComplete) {
        loadingProgress = 80
      }

      if (Date.now() - startTime > decreaseSpeedAfter) {
        increment = Math.max(0.5, increment * 0.9)
      }

      if (isComplete) {
        loadingProgress = 80
      }
    }, initialSpeed)

    const startTime = Date.now()
    return () => clearInterval(interval)
  }, [onComplete, isComplete])

  return (
    <>
      {showNoData ? (
        NoDataComponent ? (
          <NoDataComponent />
        ) : (
          <p>{t('no_data_description')}</p>
        )
      ) : (
        isVisible && (
          <div className='flex flex-col items-center justify-center w-full'>
            <Image src={imageUrl.src} alt='Loading Image' height={250} width={250} className='mb-4 object-cover' />
            <Progress value={progress} className='w-96' />
          </div>
        )
      )}
    </>
  )
}
