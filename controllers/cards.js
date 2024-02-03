// controllers/cards.js
const jwt = require('jsonwebtoken');
const Card = require('../models/cards');
const handleErrors = require('../middlewares/handleErrors');
const validationSchemas = require('../validation/validationSchemas');

const OK_CODE = 200;
const CREATED_CODE = 201;

const { SECRET_KEY } = process.env;

// GET /cards
const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(OK_CODE).json(cards);
  } catch (error) {
    handleErrors(error, req, res);
  }
};

// POST /cards
const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    // Валидация данных запроса
    const validatedData = await validationSchemas.createCardSchema.validateAsync({
      name,
      link,
    });

    // Создание карточки, только если данные прошли валидацию
    const owner = req.user._id;
    const newCard = await Card.create({ ...validatedData, owner });
    res.status(CREATED_CODE).json(newCard);
  } catch (error) {
    // Обработка ошибок валидации
    handleErrors(error, req, res);
  }
};

// DELETE /cards/:cardId
const deleteCardById = async (req, res) => {
  const { cardId } = req.params;

  try {
    // Валидация ID карточки
    await validationSchemas.cardIdSchema.validateAsync(cardId);

    // Поиск и удаление карточки по ID
    const deletedCard = await Card.findByIdAndDelete(cardId);

    // Извлекаем токен из куки
    const token = req.cookies.jwt;

    // Декодируем токен, чтобы получить информацию, включенную при подписи
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // Извлекаем _id из декодированного токена
    const userId = decodedToken._id;

    // Проверка, существует ли карта
    if (!deletedCard) {
      const error = { message: 'Card not found', statusCode: 404 };
      handleErrors(error, req, res);
    } else if (deletedCard.owner.toString() !== userId) {
      // Проверка прав доступа
      const error = { message: 'Permission denied: You cannot delete this card', statusCode: 403 };
      handleErrors(error, req, res);
    } else {
      res.status(OK_CODE).json(deletedCard);
    }
  } catch (error) {
    // Обработка ошибок валидации и других ошибок
    handleErrors(error, req, res);
  }
};

// PUT /cards/:cardId/likes
const likeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    await validationSchemas.cardIdSchema.validateAsync(cardId);

    const updatedCard = await Card.findByIdAndUpdate(
      { _id: cardId },
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      const error = { message: 'Card not found', statusCode: 404 };
      handleErrors(error, req, res);
    } else {
      res.status(OK_CODE).json(updatedCard);
    }
  } catch (error) {
    handleErrors(error, req, res);
  }
};

// DELETE /cards/:cardId/likes
const dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    await validationSchemas.cardIdSchema.validateAsync(cardId);

    const updatedCard = await Card.findByIdAndUpdate(
      { _id: cardId },
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      const error = { message: 'Card not found', statusCode: 404 };
      handleErrors(error, req, res);
    } else {
      res.status(OK_CODE).json(updatedCard);
    }
  } catch (error) {
    handleErrors(error, req, res);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
