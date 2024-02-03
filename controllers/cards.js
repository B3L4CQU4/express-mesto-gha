// controllers/cards.js
const jwt = require('jsonwebtoken');
const Card = require('../models/cards');
const NotFound = require('../errors/notFound');
const NotOwner = require('../errors/notOwner');

const OK_CODE = 200;
const CREATED_CODE = 201;

const { SECRET_KEY } = process.env;

// GET /cards
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.status(OK_CODE).json(cards);
  } catch (error) {
    next(error);
  }
};

// POST /cards
const createCard = async (req, res, next) => {
  const { name, link } = req.body;

  try {
    // Создание карточки без валидации данных
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });
    res.status(CREATED_CODE).json(newCard);
  } catch (error) {
    // Обработка ошибок при создании карточки
    next(error);
  }
};

// DELETE /cards/:cardId
const deleteCardById = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    // Поиск и удаление карточки по ID
    const card = await Card.findById(cardId);

    // Извлекаем токен из куки
    const token = req.cookies.jwt;

    // Декодируем токен, чтобы получить информацию, включенную при подписи
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // Извлекаем _id из декодированного токена
    const userId = decodedToken._id;

    // Проверка, существует ли карта
    if (!card) {
      throw new NotFound('Card not found');
    } else if (card.owner.toString() !== userId) {
      // Проверка прав доступа
      throw new NotOwner('Permission denied: You cannot delete this card');
    } else {
      const deletedCard = Card.findByIdAndDelete(cardId);
      res.status(OK_CODE).json(deletedCard);
    }
  } catch (error) {
    next(error);
  }
};

// PUT /cards/:cardId/likes
const likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      { _id: cardId },
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFound('Card not found');
    } else {
      res.status(OK_CODE).json(updatedCard);
    }
  } catch (error) {
    next(error);
  }
};

// DELETE /cards/:cardId/likes
const dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      { _id: cardId },
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFound('Card not found');
    } else {
      res.status(OK_CODE).json(updatedCard);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
