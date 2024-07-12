import { io } from 'socket.io-client'

const socket =  io('https://quiz.berta.ua');

export default socket;