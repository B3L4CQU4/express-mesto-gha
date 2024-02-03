// routes/cards.js
const express = require('express');

const {
  validateCardId,
  validateCreateCard,
} = require('../validation/validation');

const router = express.Router();
const cardController = require('../controllers/cards');

// Роут для получения всех карточек
router.get('/cards', cardController.getCards);

// Роут для создания новой карточки
router.post('/cards', validateCreateCard, cardController.createCard);

// Роут для удаления карточки по идентификатору
router.delete('/cards/:cardId', validateCardId, cardController.deleteCardById);

// Роут для постановки лайка карточке
router.put('/cards/:cardId/likes', validateCardId, cardController.likeCard);

// Роут для удаления лайка с карточки
router.delete('/cards/:cardId/likes', validateCardId, cardController.dislikeCard);

module.exports = router;
