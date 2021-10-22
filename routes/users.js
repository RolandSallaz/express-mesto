const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

router.get(
  '/', getUsers,
);

router.patch(
  '/me', updateUser,
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
