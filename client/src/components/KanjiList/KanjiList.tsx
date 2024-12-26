import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '../ui/card'
import { Kanji } from '@/src/app/types/kanji.type'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import Image from 'next/image'
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas'
import { IoArrowUndo } from 'react-icons/io5'
import { IoArrowRedo } from 'react-icons/io5'
import { AiOutlineClear } from 'react-icons/ai'
import { FaPenFancy } from 'react-icons/fa6'
import { BsEraserFill } from 'react-icons/bs'
import { Button } from '../ui/button'
import { BsFillVolumeUpFill } from 'react-icons/bs'
import { KanjiDetails } from '@/src/app/types/kanjidetails.type'
import http from '@/src/app/utils/http'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp } from '@/src/app/hooks/features/popup.slice'

type KanjiListProps = {
  kanjis: Kanji[]
}

export default function KanjiList({ kanjis = [] }: KanjiListProps) {
  const t = useTranslations('write_kanji')
  const [currentKanji, setCurrentKanji] = useState<Kanji | null>(null)
  const [kanjiDetails, setKanjiDetails] = useState<KanjiDetails | null>(null)
  const canvasRef = useRef<ReactSketchCanvasRef>(null)
  const [eraseMode, setEraseMode] = useState(false)
  const dispatch = useAppDispatch()

  const playAudio = (audioSrc?: string) => {
    if (!audioSrc) {
      return
    }
    const audio = new Audio(audioSrc)
    audio.play()
  }

  const handleEraserClick = () => {
    setEraseMode(true)
    canvasRef.current?.eraseMode(true)
  }

  const handlePenClick = () => {
    setEraseMode(false)
    canvasRef.current?.eraseMode(false)
  }

  const handleUndoClick = () => {
    canvasRef.current?.undo()
  }

  const handleRedoClick = () => {
    canvasRef.current?.redo()
  }

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas()
  }

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas()
  }

  useEffect(() => {
    const fetchKanjiDetails = async () => {
      try {
        const response = await http.get(
          `https://kanjialive-api.p.rapidapi.com/api/public/kanji/${currentKanji?.character}`,
          {
            headers: {
              'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
              'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPID_API_HOST
            }
          }
        )
        setKanjiDetails(response.data)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
      }
    }

    if (currentKanji) {
      fetchKanjiDetails()
    }
  }, [currentKanji, dispatch, t])

  if (!kanjis || kanjis.length === 0) {
    return (
      <div className='flex flex-col items-center gap-4 w-full h-44 justify-center'>
        <p className='font-semibold text-2xl'>{t('noKanji')}</p>
      </div>
    )
  }

  return (
    <div>
      <Carousel>
        <CarouselContent className='cursor-pointer'>
          {kanjis.map((kanji, index) => (
            <CarouselItem key={kanji.id} className='md:basis-1/2 lg:basis-1/6'>
              <div className='p-1'>
                <Card onClick={() => setCurrentKanji(kanjis[index])}>
                  <CardContent className='flex p-2 justify-center'>
                    <span className='text-4xl font-semibold'>{kanji.character}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {kanjiDetails && currentKanji && (
        <div className='mt-8'>
          <div className='flex justify-between'>
            <h2 className='text-2xl font-bold'>
              {kanjiDetails?.kanji?.character} ({kanjiDetails?.kanji?.meaning?.english})
            </h2>
            <h1 className='relative right-[21%] text-2xl font-bold'>{t('practice')}</h1>
          </div>
          <div className='flex justify-between'>
            <div className='mt-8'>
              <h3 className='text-xl font-semibold'>{t('kanji')}</h3>
              <div className='video'>
                <video
                  poster={kanjiDetails?.kanji?.video?.mp4}
                  playsInline
                  preload='metadata'
                  src={kanjiDetails?.kanji?.video?.mp4}
                  autoPlay
                  loop
                />
              </div>
            </div>
            <div className='grid'>
              <p>
                <strong>{t('kunyomi')}:</strong>
                <br />
                {kanjiDetails?.kanji?.kunyomi?.hiragana} ({kanjiDetails?.kanji?.kunyomi?.romaji})
              </p>
              <p>
                <strong>{t('onyomi')}:</strong>
                <br />
                {kanjiDetails?.kanji?.onyomi?.katakana} ({kanjiDetails?.kanji?.onyomi?.romaji})
              </p>
              <div className='flex-col'>
                <div className='border-b h-1'></div>
                <div>
                  <h3 className='mt-4 text-xl font-semibold'>
                    {t('radical')}: {kanjiDetails?.radical?.character} ({kanjiDetails?.radical?.meaning?.english})
                  </h3>
                  <div className='flex'>
                    <div className='flex gap-3 mt-2'>
                      {kanjiDetails?.radical?.animation?.map((frame, index) => (
                        <Image
                          key={index}
                          src={frame}
                          alt={`Radical animation frame ${index + 1}`}
                          className='w-16'
                          width={200}
                          height={200}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex-col gap-2 p-2'>
              <div className='flex gap-2 align-items-center mb-3'>
                <Button className='btn btn-sm btn-outline-primary' disabled={!eraseMode} onClick={handlePenClick}>
                  <FaPenFancy />
                </Button>
                <Button className='btn btn-sm btn-outline-primary' disabled={eraseMode} onClick={handleEraserClick}>
                  <BsEraserFill />
                </Button>
                <div className='vr' />
                <Button className='btn btn-sm btn-outline-primary' onClick={handleUndoClick}>
                  <IoArrowUndo />
                </Button>
                <Button className='btn btn-sm btn-outline-primary' onClick={handleRedoClick}>
                  <IoArrowRedo />
                </Button>
                <Button className='btn btn-sm btn-outline-primary' onClick={handleClearClick}>
                  <AiOutlineClear />
                </Button>
              </div>
              <ReactSketchCanvas className='w-full' ref={canvasRef} />
            </div>
          </div>
          <div className='mt-[10%]'>
            <h3 className='text-xl font-semibold mb-3'>{t('examples')}</h3>
            <div className='grid grid-cols-3 gap-2'>
              {kanjiDetails?.examples?.map((example, index) => (
                <div key={index} className='mb-4 flex items-center'>
                  <p>{example.japanese}</p>
                  <p
                    className='text-blue-500 hover:text-blue-700 ml-2 cursor-pointer'
                    onClick={() => playAudio(example.audio?.mp3)}
                    aria-label={t('playAudio')}
                  >
                    <BsFillVolumeUpFill size={24} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
