const express = require('express');

const router = express.Router();
const userController = require('../controllers/users');

// Роут для получения всех пользователей
router.get('/users', userController.getUsers);

router.get('/users/me', userController.getUserInfo);

// Роут для получения пользователя по _id
router.get('/users/:userId', userController.getUserById);

// Роут для создания нового пользователя
router.post('/users', userController.createUser);

// Роут для обновления профиля пользователя
router.patch('/users/me', userController.updateProfile);

// Роут для обновления аватара пользователя
router.patch('/users/me/avatar', userController.updateAvatar);

module.exports = router;
