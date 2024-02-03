const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/users');
const handleErrors = require('../middlewares/handleErrors');

const OK_CODE = 200;
const CREATED_CODE = 201;

const { SECRET_KEY } = process.env;

// GET /users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(OK_CODE).json(users);
  } catch (error) {
    handleErrors('На сервере произошла ошибка')(req, res);
  }
};

// GET /users/:userId
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById({ _id: userId });

    if (!user) {
      handleErrors('User not found')(req, res);
    } else {
      res.status(OK_CODE).json(user);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      handleErrors('Invalid user ID format')(req, res);
    } else {
      handleErrors('На сервере произошла ошибка')(req, res);
    }
  }
};

const getUserInfo = (req, res) => {
  // Получите информацию о текущем пользователе из объекта запроса
  const userInfo = req.user;

  // Отправьте информацию о пользователе в ответе
  res.status(OK_CODE).json(userInfo);
};

// POST /users
const createUser = async (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password,
    });
    res.status(CREATED_CODE).json(newUser);
  } catch (error) {
    // Проверяем, является ли ошибка связанной с уникальностью поля email
    if (error.code === 11000) {
      handleErrors('User with this email already exists')(req, res);
    } else {
      handleErrors('Invalid data')(req, res);
    }
  }
};

// PATCH /users/me
const updateProfile = async (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      handleErrors('User not found')(req, res);
    } else {
      res.status(OK_CODE).json(updatedUser);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Если валидация не прошла, возвращаем ошибку с сообщением о неверных данных
      handleErrors('Invalid data')(req, res);
    } else {
      handleErrors('На сервере произошла ошибка')(req, res);
    }
  }
};

// PATCH /users/me/avatar
const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      handleErrors('User not found')(req, res);
    } else {
      res.status(OK_CODE).json(updatedUser);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Если валидация не прошла, возвращаем ошибку с сообщением о неверных данных
      handleErrors('Invalid data')(req, res);
    } else {
      handleErrors('На сервере произошла ошибка')(req, res);
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    // Проверить наличие пользователя и сравнить пароль
    if (user && await bcrypt.compare(password, user.password)) {
      // Создать JWT токен с идентификатором пользователя в пейлоуде
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1w' });
      // Отправить токен клиенту
      res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(OK_CODE).json({ message: 'Login successful' });
    } else {
      handleErrors('Invalid email or password')(req, res);
    }
  } catch (error) {
    handleErrors('На сервере произошла ошибка')(req, res);
  }
};

module.exports = {
  login,
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateProfile,
  updateAvatar,
};
