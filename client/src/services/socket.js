// src/services/socket.js
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SERVER_HOST) // Update with your server URL
export default socket

socket.on('connect', () => {
  console.log('connected')
})

socket.on('disconnect', () => {
  console.log('disconnected')
})
