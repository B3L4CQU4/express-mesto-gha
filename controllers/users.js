const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/users');
const handleErrors = require('../middlewares/handleErrors');
const validationSchemas = require('../validation/validationSchemas');

const OK_CODE = 200;
const CREATED_CODE = 201;

const { SECRET_KEY } = process.env;

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(OK_CODE).json(users);
  } catch (error) {
    handleErrors(error, req, res);
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    await validationSchemas.userIdSchema.validateAsync(userId);

    const user = await User.findById(userId);

    if (!user) {
      const error = { message: 'User not found', statusCode: 404 };
      handleErrors(error, req, res);
    } else {
      res.status(OK_CODE).json(user);
    }
  } catch (error) {
    handleErrors(error, req, res);
  }
};

const getUserInfo = async (req, res) => {
  try {
    // Извлекаем токен из куки
    const token = req.cookies.jwt;

    // Декодируем токен, чтобы получить информацию, включенную при подписи
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // Извлекаем _id из декодированного токена
    const userId = decodedToken._id;

    const user = await User.findById(userId);

    res.status(OK_CODE).json(user.toObject());
  } catch (error) {
    handleErrors(error, req, res);
  }
};

const createUser = async (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const validatedData = await validationSchemas.createUserSchema.validateAsync({
      name,
      about,
      avatar,
      email,
      password,
    });

    const newUser = await User.create(validatedData);
    newUser.password = undefined;
    res.status(CREATED_CODE).json(newUser);
  } catch (error) {
    handleErrors(error, req, res);
  }
};

const updateProfile = async (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    // Валидация данных запроса
    const validatedData = await validationSchemas.updateProfileSchema.validateAsync({
      name,
      about,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      validatedData,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      const error = { message: 'User not found', statusCode: 404 };
      handleErrors(error, req, res);
    } else {
      res.status(OK_CODE).json(updatedUser);
    }
  } catch (error) {
    handleErrors(error, req, res);
  }
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    // Валидация данных запроса
    const validatedData = await validationSchemas.updateAvatarSchema.validateAsync({ avatar });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: validatedData.avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      const error = { message: 'User not found', statusCode: 404 };
      handleErrors(error, req, res);
    } else {
      res.status(OK_CODE).json(updatedUser);
    }
  } catch (error) {
    handleErrors(error, req, res);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Валидация данных логина
    await validationSchemas.loginSchema.validateAsync({ email, password });

    const user = await User.findOne({ email }).select('+password');

    if (user && await bcrypt.compare(password, user.password)) {
      // Включаем _id в токен
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1w' });
      res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(OK_CODE).json({ message: 'Login successful', _id: user._id });
    } else {
      const error = { message: 'Invalid email or password', statusCode: 401 };
      handleErrors(error, req, res);
    }
  } catch (error) {
    handleErrors(error, req, res);
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
