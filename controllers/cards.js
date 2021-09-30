const Card = require('../models/card');

const getCards = (req, res) => {
  return Card.find({})
    .then(cards => {
      res
        .status(200)
        .send({ cards })
    })
    .catch(() => {
      res
        .status(500)
        .send({
          message: "Произошла ошибка"
        })
    })

};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then(card => {
      res
        .status(200)
        .send({ card })
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при создании карточки" })
        return;
      }
      res
        .status(500)
        .send({ message: "Произошла ошибка" })
    })
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then(() => {
      res
        .status(200)
        .send({ message: "Карточка успешно удалена" });
    })
    .catch(err => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Карточка не найдена" })
        return;
      }
      res
        .status(500)
        .send({ message: "Произошла ошибка" })
    });
};

module.exports = {
  getCards, createCard, deleteCard
};