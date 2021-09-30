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
    .catch(() => {
      res.status(404).send({ message: "Пользователь не найден" });
      return;
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
      res
        .status(500)
        .send({
          message: "Произошла ошибка"
        })
    })
};

module.exports = {
  getUsers,
  getUser,
  createUser
}