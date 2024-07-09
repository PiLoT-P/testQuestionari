const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const usersFilePath = path.join(__dirname, 'users.json');
const questions = [
  {
    question: 'Яка столиця України?',
    options: ['Львів', 'Одеса', 'Київ', 'Харків'],
    correctAnswer: 'Київ',
  },
  {
    question: 'Яка найбільша планета в Сонячній системі?',
    options: ['Марс', 'Юпітер', 'Земля', 'Венера'],
    correctAnswer: 'Юпітер',
  },
];

let users = [];
let currentQuestionIndex = -1;
let leaderboard = [];

function saveUsers() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
}

function endQuiz() {
  leaderboard = [...users];
  leaderboard.sort((a, b) => b.score - a.score);
  io.emit('endQuiz', leaderboard);
  currentQuestionIndex = -1;
  users.forEach(user => user.answer = undefined);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    io.emit('newQuestion', question);
  } else {
    endQuiz();
  }
}

function checkAnswers() {
  const question = questions[currentQuestionIndex];
  const correctAnswer = question.correctAnswer;

  users.forEach(user => {
    if (user.answer === correctAnswer) {
      user.score++;
    }
  });

  io.emit('userList', users);

  users.forEach(user => user.answer === undefined);
  nextQuestion();
}

io.on('connection', (socket) => {

  socket.on('join', (name) => {
    const existingUser = users.find(user => user.name === name);
    if (!existingUser) {
      users.push({ id: socket.id, name, score: 0, answer: undefined});
      io.emit('userList', users);
      saveUsers();
    }
  });

  socket.on('startQuiz', () => {
    currentQuestionIndex = -1;
    users.forEach(user => user.score = 0);

    if(currentQuestionIndex > questions.length){
      endQuiz()
    }else{
      setTimeout(() => {
        newQuestion()
      }, 5000)
    }
  });

  socket.on('answer', (answer, userId) => {
    const findUser = users.find(user => user.id === userId);
    if(findUser){
      findUser.answer = answer;
    }

    const allAnswered = users.every(user => user.answer !== undefined);
    if(allAnswered){
      checkAnswers()
    }
  })

  socket.on('disconnect', () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit('userList', users);
    saveUsers();
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});
