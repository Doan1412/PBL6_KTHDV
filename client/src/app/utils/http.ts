import axios, { AxiosInstance } from 'axios'
import { getCookie } from 'cookies-next'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.BACKEND_URL,
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        const authToken = getCookie('authToken')
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`
        } else {
          console.log('No authToken found in cookies')
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
