'use client'
import { createContext, useContext, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '../hooks/store'
import { failPopUp } from '../hooks/features/popup.slice'
import http from '../utils/http'
import { Category } from '../types/category.type'

const CategoriesContext = createContext<Category[] | undefined>(undefined)

export const useCategories = () => {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider')
  }
  return context
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const dispatch = useAppDispatch()
  const t = useTranslations('navbar')
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res: { data: { message: Category[] } } = await http.get(`categories`)
        setCategories(res.data.message)
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || t('error')
        dispatch(failPopUp(message))
      }
    }
    fetchProfile()
  }, [dispatch, t])
  return <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>
}
