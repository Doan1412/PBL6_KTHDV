'use client'
import React, { useRef } from 'react'
import { FaCameraRetro } from 'react-icons/fa'

export default function UploadButton() {
  const fileInputRef = useRef(null)

  return (
    <div>
      <label
        htmlFor='avatarInput'
        className='flex items-center justify-start w-8 h-8 bg-gray-400 rounded-full cursor-pointer relative overflow-hidden shadow-lg'
      >
        <div className='flex items-center justify-center w-full text-white'>
          <FaCameraRetro />
        </div>
      </label>
      <input id='avatarInput' ref={fileInputRef} style={{ display: 'none' }} />
    </div>
  )
}
