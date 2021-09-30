const user = require('../models/user');

const getUsers = (req, res) => {
  return user.find({})
    .then(data => { res.status(200).send({ users: data }) })
    .catch(() => { res.status(500).send({ message: "Произошла ошибка" }) });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return user.create({ name, about, avatar })
    .then(data => { res.status(200).send({ user: data }) })
    .catch(() => { res.status(500).send({ message: "Произошла ошибка" }) })
};

module.exports = {
  getUsers,
  createUser
}