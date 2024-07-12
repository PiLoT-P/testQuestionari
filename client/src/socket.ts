import { io } from 'socket.io-client'

const socket =  io('https://quiz.berta.ua');
// const socket =  io('http://localhost:4000');

export default socket;