// routes/cards.js
const express = require('express');

const router = express.Router();
const cardController = require('../controllers/cards');

// Роут для получения всех карточек
router.get('/cards', cardController.getCards);

// Роут для создания новой карточки
router.post('/cards', cardController.createCard);

// Роут для удаления карточки по идентификатору
router.delete('/cards/:cardId', cardController.deleteCardById);

// Роут для постановки лайка карточке
router.put('/cards/:cardId/likes', cardController.likeCard);

// Роут для удаления лайка с карточки
router.delete('/cards/:cardId/likes', cardController.dislikeCard);

module.exports = router;
