'use client'
import React, { ReactNode } from 'react'

interface CardDataStatsProps {
  title: string
  total: string
}

const CardDataStats: React.FC<CardDataStatsProps> = ({ title, total }) => {
  return (
    <div className='rounded-sm border border-stroke px-8 py-6 shadow-default dark:border-strokedark dark:bg-boxdark text-center'>
      <h2 className='text-4xl font-bold'>{total}</h2>
      <span className='text-sm font-medium'>{title}</span>
    </div>
  )
}

export default CardDataStats
