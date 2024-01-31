// controllers/cards.js
const Card = require('../models/cards');

const OK_CODE = 200;
const CREATED_CODE = 201;
const INVALID_DATA_CODE = 400;
const NOT_FOUND_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

// GET /cards
const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(OK_CODE).json(cards);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: 'На сервере произошла ошибка' });
  }
};

// POST /cards
const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });
    res.status(CREATED_CODE).json(newCard);
  } catch (error) {
    res.status(INVALID_DATA_CODE).json({ message: 'Invalid input' });
  }
};

// DELETE /cards/:cardId
const deleteCardById = async (req, res) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete({ _id: cardId });

    if (!deletedCard) {
      res.status(NOT_FOUND_CODE).json({ message: 'Card not found' });
    } else {
      res.status(OK_CODE).json(deletedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(INVALID_DATA_CODE).json({ message: 'Invalid input' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'На сервере произошла ошибка' });
    }
  }
};

// PUT /cards/:cardId/likes
const likeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      { _id: cardId },
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      res.status(NOT_FOUND_CODE).json({ message: 'Card not found' });
    } else {
      res.status(OK_CODE).json(updatedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(INVALID_DATA_CODE).json({ message: 'Invalid input' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'На сервере произошла ошибка' });
    }
  }
};

// DELETE /cards/:cardId/likes
const dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      { _id: cardId },
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      res.status(NOT_FOUND_CODE).json({ message: 'Card not found' });
    } else {
      res.status(OK_CODE).json(updatedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(INVALID_DATA_CODE).json({ message: 'Invalid input' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
