import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import popupReducer from './features/popup.slice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { teacherInfoApi } from './service/teacher_infor.service'

export const store = configureStore({
  reducer: {
    popup: popupReducer,
    [teacherInfoApi.reducerPath]: teacherInfoApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(teacherInfoApi.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
