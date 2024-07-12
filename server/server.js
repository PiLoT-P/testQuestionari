const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '../client/dist')));
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
let leaderboard = [];

function saveUsers() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
}

function endQuizForUser(userId) {
  const user = users.find(user => user.id === userId);
  if (user) {
    user.finished = true;
    io.to(userId).emit('endQuiz', user);
  }
  io.emit('userList', users.sort((a, b) => b.score - a.score));
}

function sendNextQuestion(userId) {
  console.log('next Question', userId, users)
  const user = users.find(user => user.id === userId);

  if (user) {
    user.currentQuestionIndex++;
    console.log('знайшов')
    if (user.currentQuestionIndex < questions.length) {
      const question = questions[user.currentQuestionIndex];
      io.to(userId).emit('newQuestion', question);
    } else {
      endQuizForUser(userId);
    }
  }
}

function checkAnswer(userId, answer) {
  const user = users.find(user => user.id === userId);
  if (user) {
    const question = questions[user.currentQuestionIndex];
    if (answer === question.correctAnswer) {
      user.score++;
    } else if (answer.length < 1) {
      user.notCorrect++;
      answer = 'wrong';
    } else {
      user.notCorrect++;
    }

    user.answer = answer;
    io.emit('userList', users);
    user.answer = undefined;
    sendNextQuestion(userId);
  }
}

function resetQuiz() {
  users = [];
  leaderboard = [];
  io.emit('resetQuiz');
}

io.on('connection', (socket) => {

  socket.on('join', (name) => {
    const existingUser = users.find(user => user.name === name);
    if (!existingUser) {
      users.push({ 
        id: socket.id, 
        name, 
        score: 0, 
        notCorrect: 0, 
        answer: undefined,
        currentQuestionIndex: -1,
        finished: false
      });
      io.emit('userList', users);
      saveUsers();
    }
  });

  socket.on('requestUserList', () => {
    console.log('Request user list from', socket.id);
    socket.emit('userList', users);
  });

  socket.on('startQuiz', () => {
    console.log('start', users.length)
    users.forEach(user => {
      user.currentQuestionIndex = -1;
      user.score = 0;
      user.notCorrect = 0;
      console.log('user', user.name)
      sendNextQuestion(user.id);
    });
  });

  socket.on('answer', (data) => {
    const { answer, userId } = data;

    console.log('Answer received from user:', userId, 'Answer:', answer);

    checkAnswer(userId, answer);
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
