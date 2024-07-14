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
    question: 'Якби логотип БЕРТА груп був не червоний, а жовтий, який би тоді був рік заснування компанії?',
    options: ['1991', '1992', '1993'],
    correctAnswer: '1992',
  },
  {
    question: 'В якому році BERTA group святкуватиме своє 50ти річчя?',
    options: ['2042', '2052', '2032'],
    correctAnswer: '2042',
  },
  {
    question: 'Яка була перша назва компанії BERTA group',
    options: ['Група БЕРТА', 'ЖУБЕРТА', 'БЕРТА'],
    correctAnswer: 'БЕРТА',
  },
  {
    question: 'Як розшифровується слово БЕРТА',
    options: ['БЕРи ТАта на роботу', 'БЕРежанський, Тетяна і Андрій', 'БЕРежанський ТА партнери'],
    correctAnswer: 'БЕРежанський, Тетяна і Андрій',
  },
  {
    question: 'Гімн Берти груп. Як звучить перший рядок у приспіві? Берта - це',
    options: ['надійна команда успішних людей', 'успішна команда надійних людей', 'надійна команда успішних дітей'],
    correctAnswer: 'надійна команда успішних людей',
  },
  {
    question: 'До речі, хто виконує гімн БЕРТИ груп',
    options: ['Юрій Соневицький і хор "ЮБІВАН"', 'Павло Табаков', 'Михайло Поплавський'],
    correctAnswer: 'Павло Табаков',
  },
  {
    question: 'Повернімось до історії. Згідно з легендою, першим офісом БЕРТИ був дім тещі. А що слугувало другим офісом?',
    options: ['Готель Львів', 'Дача Юрія Орестовича', 'Білі жигулі'],
    correctAnswer: 'Білі жигулі',
  },
  {
    question: 'Яку першу жуйку почала продавати БЕРТА?',
    options: ['Hubba Bubba', 'Wrigley', 'LOVE is'],
    correctAnswer: 'Wrigley',
  },
  {
    question: 'На яку суму за перший місяць продали жуйки?',
    options: ['3000 доларів', '3000 грн', '3000 карбованців'],
    correctAnswer: '3000 доларів',
  },
  {
    question: 'В якому році компанію "БЕРТА" вперше визнали найкращим дистрибутором Chupa-Chups в Україні?',
    options: ['1991', '1997', 'Обіцяли у 2025'],
    correctAnswer: '1997',
  },
  {
    question: 'Коли компанія БЕРТА переїхала у власний офіс на вул. Б.Хмельницького 212?',
    options: ['За Кравчука', 'За Кучми', 'За Ющенка'],
    correctAnswer: 'За Ющенка',
  },
  {
    question: 'Які цінності компаніїї BERTA group?',
    options: ['Люди, інновації, професійність, довіра', 'Технологічність, логістика, футбол', 'Люди, успішність, діджиталізація, PR'],
    correctAnswer: 'Люди, інновації, професійність, довіра',
  },
  {
    question: 'Скільки магазинів Близенько було відкрито у 2012 році, на честь 20ти річчя BERTA group?',
    options: ['3', '12', '0'],
    correctAnswer: '0',
  },
  {
    question: 'Якби зараз десь близенько був офіс БЕРТИ, який би тоді був імідж в компанії UB1?',
    options: ['Частенький', 'Рясненький', 'Чистенький'],
    correctAnswer: 'Чистенький',
  },
  {
    question: 'Якого кольору логотип UB1, якщо пригадати кольори BERTA group',
    options: ['оливково-багряний', 'оранжево-зелений', 'блакитно-оранжевий'],
    correctAnswer: 'блакитно-оранжевий',
  },
  {
    question: 'Який принцип роботи сповідує Олександр Михайлович',
    options: ['Вдосконаленню є межа', 'Вдосконаленню немає меж', 'Свій, до свого, по своє'],
    correctAnswer: 'Вдосконаленню немає меж',
  },
  {
    question: 'Якби ви були Олександром Бережанським, як би Ви сказали: в житті потрібно правильно',
    options: ['робити презентації', 'розставляти пріорітети', 'розставляти стілці в переговорній'],
    correctAnswer: 'розставляти пріорітети',
  },
  {
    question: 'Де в офісі БЕРТА груп найчастіше грає музика?',
    options: ['У кабінеті Володимира Козія', 'На паркінгу з авто Івана Даниленка', 'Жодна з відповідей не є на 100% вірна'],
    correctAnswer: 'Жодна з відповідей не є на 100% вірна',
  },
  {
    question: 'Передостаннє. Як називалось святкування Нового року і Різдва BERTA group у 2023 році?',
    options: ['Берта Вандерленд', 'Берта Вінтерленд', 'Берта Діснейленд'],
    correctAnswer: 'Берта Вінтерленд',
  },
  {
    question: 'Останнє. Найпростіше. Рівняння. А все ж таки, скільки років святкує BERTA group?',
    options: ['17 + 19 - 2', '51-18', '192:6'],
    correctAnswer: '192:6',
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
  io.emit('endQuizTop', users.sort((a, b) => b.score - a.score).slice(0, 5))
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
  saveUsers();
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
    // users = users.filter(user => user.id !== socket.id);
    // io.emit('userList', users);
    // saveUsers();
  });

  socket.on('requestTop5', () => {
    const newLeaderboard = [...users];

    io.emit('top5', newLeaderboard.sort((a, b) => b.score - a.score).slice(0, 5));
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
