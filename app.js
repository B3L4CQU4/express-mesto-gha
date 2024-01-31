const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const NOT_FOUND_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65b9a60ace175e365ced390e', // test _id
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.all('*', (req, res) => {
  res.status(NOT_FOUND_CODE).json({ message: 'Not found' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
