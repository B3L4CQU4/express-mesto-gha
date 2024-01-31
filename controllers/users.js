const User = require('../models/users');

const OK_CODE = 200;
const CREATED_CODE = 201;
const INVALID_DATA_CODE = 400;
const NOT_FOUND_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

// GET /users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(OK_CODE).json(users);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: 'Internal Server Error' });
  }
};

// GET /users/:userId
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById({ _id: userId });

    if (!user) {
      res.status(NOT_FOUND_CODE).json({ message: 'User not found' });
    } else {
      res.status(OK_CODE).json(user);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(INVALID_DATA_CODE).json({ message: 'Invalid user ID format' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'На сервере произошла ошибка' });
    }
  }
};

// POST /users
const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const newUser = await User.create({ name, about, avatar });
    res.status(CREATED_CODE).json(newUser);
  } catch (error) {
    res.status(INVALID_DATA_CODE).json({ message: 'Invalid input' });
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
      res.status(NOT_FOUND_CODE).json({ error: 'User not found' });
    } else {
      res.status(OK_CODE).json(updatedUser);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Если валидация не прошла, возвращаем ошибку с сообщением о неверных данных
      res.status(INVALID_DATA_CODE).json({ message: 'Invalid data' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'На сервере произошла ошибка' });
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
      res.status(NOT_FOUND_CODE).json({ message: 'User not found' });
    } else {
      res.status(OK_CODE).json(updatedUser);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Если валидация не прошла, возвращаем ошибку с сообщением о неверных данных
      res.status(INVALID_DATA_CODE).json({ message: 'Invalid data' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
