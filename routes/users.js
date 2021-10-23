const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

router.get(
  '/', getUsers,
);

router.patch(
  '/me', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }), updateUser,
);
router.get(
  '/me', getCurrentUser,
);

router.patch(
  '/me/avatar', updateUserAvatar,
);
router.get(
  '/:id', getUser,
);
module.exports = router;
