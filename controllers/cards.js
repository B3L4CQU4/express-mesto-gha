// controllers/cards.js
const Card = require('../models/cards');
const handleErrors = require('../middlewares/handleErrors');

const OK_CODE = 200;
const CREATED_CODE = 201;

// GET /cards
const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(OK_CODE).json(cards);
  } catch (error) {
    handleErrors('На сервере произошла ошибка')(req, res);
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
    handleErrors('Invalid input')(req, res);
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
      handleErrors('Card not found')(req, res);
    } else if (card.owner.toString() !== userId) {
      handleErrors('Permission denied: You cannot delete this card')(req, res);
    } else {
      res.status(OK_CODE).json(deletedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      handleErrors('Invalid input')(req, res);
    } else {
      handleErrors('На сервере произошла ошибка')(req, res);
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
      handleErrors('Card not found')(req, res);
    } else {
      res.status(OK_CODE).json(updatedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      handleErrors('Invalid input')(req, res);
    } else {
      handleErrors('На сервере произошла ошибка')(req, res);
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
      handleErrors('Card not found')(req, res);
    } else {
      res.status(OK_CODE).json(updatedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      handleErrors('Invalid input')(req, res);
    } else {
      handleErrors('На сервере произошла ошибка')(req, res);
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
