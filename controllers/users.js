const User = require('../models/users');

// GET /users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /users/:userId
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById({ _id: userId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid user ID format' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// POST /users
const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const newUser = await User.create({ name, about, avatar });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Invalid input' });
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
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Если валидация не прошла, возвращаем ошибку с сообщением о неверных данных
      res.status(400).json({ massage: 'Invalid data' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
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
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Если валидация не прошла, возвращаем ошибку с сообщением о неверных данных
      res.status(400).json({ massage: 'Invalid data' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
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
