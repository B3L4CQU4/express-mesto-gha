const { celebrate, Joi } = require('celebrate');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ allowRelative: false }).pattern(/^[a-zA-Z0-9-_:/?#&=.,;+]*$/),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({ allowRelative: false }).pattern(/^[a-zA-Z0-9-_:/?#&=.,;+]*$/),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri({ allowRelative: false }).pattern(/^[a-zA-Z0-9-_:/?#&=.,;+]*$/).required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateUpdateAvatar,
  validateUpdateProfile,
  validateLogin,
  validateUserId,
  validateCardId,
  validateCreateCard,
};
