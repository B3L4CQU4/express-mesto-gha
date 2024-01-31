// controllers/cards.js
const Card = require('../models/cards');

// GET /cards
const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST /cards
const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });
    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ message: 'Invalid input' });
  }
};

// DELETE /cards/:cardId
const deleteCardById = async (req, res) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete({ _id: cardId });

    if (!deletedCard) {
      res.status(404).json({ message: 'Card not found' });
    } else {
      res.status(200).json(deletedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid input' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
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
      res.status(404).json({ message: 'Card not found' });
    } else {
      res.status(200).json(updatedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid input' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
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
      res.status(404).json({ message: 'Card not found' });
    } else {
      res.status(200).json(updatedCard);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid input' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
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
