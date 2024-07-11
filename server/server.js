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
  {
    question: 'Хто є автором роману "Війна і мир"?',
    options: ['Лев Толстой', 'Федір Достоєвський', 'Олександр Пушкін', 'Михайло Булгаков'],
    correctAnswer: 'Лев Толстой',
  },
  {
    question: 'Яке море найбільше за площею?',
    options: ['Чорне море', 'Середземне море', 'Карибське море', 'Каспійське море'],
    correctAnswer: 'Каспійське море',
  },
  {
    question: 'Яка країна першою здійснила посадку людини на Місяць?',
    options: ['США', 'Росія', 'Китай', 'Індія'],
    correctAnswer: 'США',
  },
  {
    question: 'Який хімічний елемент має символ "O"?',
    options: ['Кисень', 'Водень', 'Азот', 'Вуглець'],
    correctAnswer: 'Кисень',
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
  if(currentQuestionIndex === -1){
    return;
  }
  const question = questions[currentQuestionIndex];
  const correctAnswer = question.correctAnswer;

  users.forEach(user => {
    if (user.answer === correctAnswer) {
      user.score++;
    } else if (user.answer.length < 1) {
      user.answer = 'wrong';
    }
  });

  io.emit('userList', users);

  users.forEach(user => user.answer = undefined);
  nextQuestion();
}

function resetQuiz() {
  users = [];
  currentQuestionIndex = -1;
  leaderboard = [];
  io.emit('resetQuiz');
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

  socket.on('requestUserList', () => {
    console.log('Request user list from', socket.id);
    socket.emit('userList', users);
  });

  socket.on('startQuiz', () => {
    currentQuestionIndex = -1;
    users.forEach(user => user.score = 0);
    nextQuestion();
  });

  socket.on('answer', (data) => {
    const {answer, userId} = data;

    console.log('Answer received from user:', userId, 'Answer:', answer);

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].answer = answer;
    } else {
      console.log('User not found:', userId);
    }

    const allAnswered = users.every(user => user.answer !== undefined);
    if (allAnswered) {
      checkAnswers();
    }
  });

  socket.on('resetQuiz', () => {
    resetQuiz();
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit('userList', users);
    saveUsers();
  });

  socket.on('requestTop5', () => {
    leaderboard = [...users];
    leaderboard.sort((a, b) => b.score - a.score).slice(0, 5);

    io.emit('top5', leaderboard);
  })

  socket.on('requestUserStats', (userId) => {
    const user = users.find(user => user.id === userId);
    if (user) {
      socket.emit('userStats', user);
    } else {
      socket.emit('userStats', { error: 'User not found' });
    }
  });

});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});
