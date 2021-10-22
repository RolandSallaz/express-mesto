const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

const getUsers = (req, res, next) => User.find({})
  .then((data) => {
    res
      .status(200)
      .send({
        users: data,
      });
  })
  .catch(next);

const getUser = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res
        .status(200)
        .send(user);
    })
    .catch(next);
};

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res
        .send(user);
    })
    .catch(next);
}

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res
        .send({ message: 'Информация о пользователе обновлена' });
    })
    .catch(next);
};
const updateUserAvatar = (req, res, next) => User.findByIdAndUpdate(req.user,
  { avatar: req.body.avatar },
  { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res
      .send({ message: 'Аватар пользователя обновлен' });
  })
  .catch(next);
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new AuthError('Необходима авторизация');
      }
      res.send({ user });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
};
