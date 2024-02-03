// controllers/cards.js
const Card = require('../models/cards');
const handleErrors = require('../middlewares/handleErrors');
const validationSchemas = require('../validation/validationSchemas');

const OK_CODE = 200;
const CREATED_CODE = 201;

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
  const userId = req.user._id;

  try {
    const deletedCard = await Card.findByIdAndDelete({ _id: cardId });
    const card = await Card.findById(cardId);

    if (!deletedCard) {
      const error = { message: 'Card not found', statusCode: 404 };
      handleErrors(error, req, res);
    } else if (card.owner.toString() !== userId) {
      const error = { message: 'Permission denied: You cannot delete this card', statusCode: 403 };
      handleErrors(error, req, res);
    } else {
      res.status(OK_CODE).json(deletedCard);
    }
  } catch (error) {
    handleErrors(error, req, res);
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
