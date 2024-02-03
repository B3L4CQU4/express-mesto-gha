const jwt = require('jsonwebtoken');
const handleErrors = require('./handleErrors');

const { SECRET_KEY } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    const error = { message: 'Unauthorized: Token missing', statusCode: 401 };
    handleErrors(error, req, res);
  } else {
    try {
      const payload = jwt.verify(token, SECRET_KEY);
      // Добавить пейлоуд токена в объект запроса
      req.user = payload;
      // Вызвать следующий обработчик
      next();
    } catch (error) {
      handleErrors(error, req, res);
    }
  }
};

module.exports = authMiddleware;
