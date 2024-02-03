const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().uri(),
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

const userIdSchema = Joi.string().length(24).hex();

const cardIdSchema = Joi.string().length(24).hex();

const createCardSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().uri({ allowRelative: false }).pattern(/^[a-zA-Z0-9-_:/?#&=.,;+]*$/).required(),
});

module.exports = {
  createUserSchema,
  updateAvatarSchema,
  updateProfileSchema,
  loginSchema,
  createCardSchema,
  userIdSchema,
  cardIdSchema,
};
