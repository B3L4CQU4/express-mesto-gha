const handleErrors = (error, req, res, next) => {
  if (error.isJoi) {
    // Ошибка валидации Joi
    const statusCode = 400;
    const message = error.details.map((detail) => detail.message).join('; ');
    res.status(statusCode).send({ message });
  } else if (error.code === 11000) {
    const statusCode = 409;// Обработка ошибки бд
    const { message } = error;
    res.status(statusCode).send({ message });
  } else {
    // Другие ошибки
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'На сервере произошла ошибка' : error.message;
    res.status(statusCode).send({ message });
  }
};

module.exports = handleErrors;
