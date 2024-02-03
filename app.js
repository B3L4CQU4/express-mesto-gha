const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const handleErrors = require('./middlewares/handleErrors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res, next) => {
  if (req.url === '/signin' || req.url === '/signup') {
    next(); // Пропустить authMiddleware для /signin и /signup
  } else {
    authMiddleware(req, res, next);
  }
});

app.use(userRouter);
app.use(cardRouter);

app.all('*', handleErrors('Not found'));

mongoose.connect('mongodb://localhost:27017/mestodb');

mongoose.connect(
  'mongodb://localhost:27017/mestodb',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
  },
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
