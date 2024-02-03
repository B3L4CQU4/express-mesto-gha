const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  about: Joi.string().min(2).max(30).required(),
  avatar: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateAvatarSchema = Joi.object({
  avatar: Joi.string().uri().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  about: Joi.string().min(2).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createCardSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().uri().required(),
});

module.exports = {
  createUserSchema,
  updateAvatarSchema,
  updateProfileSchema,
  loginSchema,
  createCardSchema,
};
