import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import http from '../../utils/http'
import { getCookie } from 'cookies-next'
import { resProfileTeacher } from '../../types/teacher.type'

const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string } = {
    baseUrl: http.defaults.baseURL as string
  }
): BaseQueryFn<
  {
    url: string
    method?: AxiosRequestConfig['method']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['params']
    headers?: AxiosRequestConfig['headers']
  },
  unknown,
  unknown
> => {
  return async ({ url, method, data, params, headers }) => {
    try {
      const result = await http({
        url: baseUrl + url,
        method,
        data,
        params,
        headers
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message
        }
      }
    }
  }
}

export const teacherInfoApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: http.defaults.baseURL as string
  }),
  endpoints(build) {
    return {
      getTeacherInfo: build.query<resProfileTeacher, string>({
        query: (teacherId) => ({ url: `teachers/${teacherId}`, method: 'get' })
      })
    }
  }
})

export const { useGetTeacherInfoQuery } = teacherInfoApi
