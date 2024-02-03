const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const handleErrors = require('./middlewares/handleErrors');
const handleJsonParseError = require('./middlewares/handleJsonParseError');
const NotFound = require('./errors/notFound');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  'mongodb://localhost:27017/mestodb',
  {
    autoIndex: true,
  },
);

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

app.use(errors());

app.all('*', (req, res, next) => {
  next(new NotFound('Not Found'));
});

app.use((error, req, res, next) => {
  handleErrors(error, req, res, next);
  next();
});

app.use(handleJsonParseError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
