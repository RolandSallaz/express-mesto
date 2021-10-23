const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

const getUsers = (req, res) => User.find({})
  .then((data) => {
    res
      .status(200)
      .send({
        users: data,
      });
  })
  .catch();

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
        .send({
          data: {
            name: user.name, about: user.about, avatar: user.avatar, email,
          },
        });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        const error = new Error('Данный email уже используется');
        error.statusCode = 409;
        next(error);
        return;
      }
      next(err);
    });
}

function updateUser(req, res, next) {
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
}
const updateUserAvatar = (req, res, next) => User.findByIdAndUpdate(req.user._id,
  { avatar: req.body.link },
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
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { JWT_SECRET = 'dd4363ae6ef2daa8a66e2ab5e432ac9c7aea658a6c9da53e7e9d1001531adc71' } = process.env;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
        })
        .end();
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
