const jwt = require('jsonwebtoken');
const handleErrors = require('./handleErrors');

const { SECRET_KEY } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    handleErrors('Unauthorized: Token missing')(req, res);
  } else {
    try {
      const payload = jwt.verify(token, SECRET_KEY);
      // Добавить пейлоуд токена в объект запроса
      req.user = payload;
      // Вызвать следующий обработчик
      next();
    } catch (error) {
      // Вернуть ошибку 401 в случае неверного токена
      handleErrors('Unauthorized: Wrong token')(req, res);
    }
  }
};

module.exports = authMiddleware;
