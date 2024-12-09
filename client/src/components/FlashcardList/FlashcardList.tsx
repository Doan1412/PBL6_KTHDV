import { Flashcard } from '@/src/app/types/flashcard.type'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { FaArrowLeft, FaArrowRight, FaRedo } from 'react-icons/fa'

type FlashcardListProps = {
  flashcards: Flashcard[]
}

const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [direction, setDirection] = useState<'next' | 'previous' | null>(null)

  const handleNext = useCallback(() => {
    setDirection('next')
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
  }, [flashcards.length])

  const handlePrevious = useCallback(() => {
    setDirection('previous')
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1))
  }, [flashcards.length])

  const handleRestart = () => {
    setCurrentIndex(0)
  }

  const handleFlip = () => {
    setFlipped((prev) => !prev)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
        case ' ':
          event.preventDefault()
          handleFlip()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [flashcards.length, handleNext, handlePrevious])

  useEffect(() => {
    if (direction) {
      const timeoutId = setTimeout(() => {
        setDirection(null)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [direction])

  return (
    <div className='flex flex-col items-center gap-4 w-full'>
      <FlashcardItem flashcard={flashcards[currentIndex]} flipped={flipped} onFlip={handleFlip} direction={direction} />
      <div className='flex items-center justify-between mt-4 w-[80%]'>
        <div className='flex items-center justify-center gap-4 flex-grow ml-10'>
          <Button onClick={handlePrevious} variant='outline'>
            <FaArrowLeft className='w-5 h-5' />
          </Button>
          <span className='text-gray-600'>
            {currentIndex + 1}/{flashcards.length}
          </span>
          <Button onClick={handleNext} variant='outline'>
            <FaArrowRight className='w-5 h-5' />
          </Button>
        </div>
        <Button onClick={handleRestart} variant='outline'>
          <FaRedo className='w-5 h-5' />
        </Button>
      </div>
    </div>
  )
}

const FlashcardItem: React.FC<{
  flashcard: Flashcard
  flipped: boolean
  onFlip: () => void
  direction: 'next' | 'previous' | null
}> = ({ flashcard, flipped, onFlip, direction }) => {
  return (
    <div className='relative w-[80%] h-[450px] perspective-1000 overflow-hidden' onClick={onFlip}>
      <div
        className={`w-full h-full absolute transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? 'rotate-x-180' : ''
        } ${direction === 'next' ? 'slide-next' : direction === 'previous' ? 'slide-previous' : ''}`}
      >
        <div className='absolute w-full h-full backface-hidden flex items-center justify-center border rounded-lg shadow-lg'>
          <span className='text-center font-semibold text-2xl'>{flashcard?.front_text}</span>
        </div>
        <div className='absolute w-full h-full backface-hidden flex items-center justify-center border rounded-lg shadow-lg rotate-x-180'>
          <span className='text-center font-semibold text-2xl'>{flashcard?.back_text}</span>
        </div>
      </div>
    </div>
  )
}

export default FlashcardList
