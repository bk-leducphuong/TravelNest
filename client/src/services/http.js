// src/services/http.js
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
  timeout: 10000,
  withCredentials: true
})

http.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
)

export default http
