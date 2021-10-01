const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({})
    .then(data => {
      res
        .status(200)
        .send({
          users: data
        })
    })
    .catch(() => {
      res
        .status(500)
        .send({
          message: "Произошла ошибка"
        })
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then(data => {
      res
        .status(200)
        .send({
          user: data
        })
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Пользователь не найден" })
        return;
      }
      res.status(500)
        .send({ message: "Произошла ошибка" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then(data => {
      res
        .status(200)
        .send({
          user: data
        })
    })
    .catch(() => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при создании пользователя" })
        return;
      }
      res
        .status(500)
        .send({
          message: "Произошла ошибка"
        })
    })
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user, { name, about })
    .then(() => {
      res
        .status(200)
        .send({ message: "Информация о пользователе обновлена" })
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при обновлении профиля" })
        return;
      }
      if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Пользователь не найден" })
        return;
      }
      res
        .status(500)
        .send({ message: "Произошла ошибка" })
    })
}

const updateUserAvatar = (req, res) => {
  return User.findByIdAndUpdate(req.user, { avatar: req.body.avatar })
    .then(() => {
      res
        .status(200)
        .send({ message: "Аватар пользователя обновлен" })
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при обновлении профиля" })
        return;
      }
      if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Пользователь не найден" })
        return;
      }
      res
        .status(500)
        .send({ message: "Произошла ошибка" })
    })
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar
}