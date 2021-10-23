const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const ValidationError = require('../errors/ValidationError');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new ValidationError('Неправильный формат ссылки');
  }
  return value;
};

router.get(
  '/', getCards,
);
router.post(
  '/', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30)
        .required(),
      link: Joi.string().custom(validateURL).required(),
    }),
  }), createCard,
);
router.delete(
  '/:cardId', celebrate({
    params: Joi.string().length(24).hex().required(),
  }), deleteCard,
);
router.put(
  '/:cardId/likes', celebrate({
    params: Joi.string().length(24).hex().required(),
  }), likeCard,
);
router.delete(
  '/:cardId/likes', celebrate({
    params: Joi.string().length(24).hex().required(),
  }), dislikeCard,
);
module.exports = router;
