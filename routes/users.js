const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUsers, getUser, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');
const ValidationError = require('../errors/ValidationError');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new ValidationError('Неправильный формат ссылки');
  }
  return value;
};

router.get(
  '/', getUsers,
);

router.patch(
  '/me', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30)
        .required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }), updateUser,
);
router.get(
  '/me', getCurrentUser,
);

router.patch(
  '/me/avatar', celebrate({
    body: Joi.object().keys({
      link: Joi.string().custom(validateURL).required(),
    }),
  }), updateUserAvatar,
);
router.get(
  '/:id', celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }), getUser,
);
module.exports = router;
