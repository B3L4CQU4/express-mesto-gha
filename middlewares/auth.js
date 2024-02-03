const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const { SECRET_KEY } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthError('Unauthorized: Token missing');
  } else {
    try {
      const payload = jwt.verify(token, SECRET_KEY);
      // Добавить пейлоуд токена в объект запроса
      req.user = payload;
      // Вызвать следующий обработчик
      next();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authMiddleware;
