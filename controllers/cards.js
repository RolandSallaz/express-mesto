const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })
    .catch(() => {
      res
        .status(500)
        .send({
          message: 'Произошла ошибка',
        });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res
        .status(200)
        .send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res
        .status(500)
        .send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findOneAndDelete({ _id: cardId, owner: req.user })
    .orFail(() => {
      const error = new Error('Нет карточки по заданному id');
      error.statusCode = 404;
      throw error;
    })
    .then(() => {
      res
        .status(200)
        .send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Карточка не найдена' });
        return;
      }
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
        return;
      }
      res
        .status(500)
        .send({ message: 'Произошла ошибка' });
    });
};
const likeCard = (req, res) => Card.findByIdAndUpdate(req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true })
  .orFail(() => {
    const error = new Error('Нет карточки по заданному id');
    error.statusCode = 404;
    throw error;
  })
  .then(res
    .status(200)
    .send({ message: 'Лайк успешно поставлен' }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res
        .status(400)
        .send({ message: 'Переданы некорректные данные для постановки лайка' });
      return;
    }
    if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
      return;
    }
    if (err.name === 'CastError') {
      res
        .status(400)
        .send({ message: 'Карточка не найдена' });
      return;
    }
    res
      .status(500)
      .send({ message: 'Произошла ошибка' });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true })
  .orFail(() => {
    const error = new Error('Нет карточки по заданному id');
    error.statusCode = 404;
    throw error;
  })
  .then(res
    .status(200)
    .send({ message: 'Лайк успешно удален' }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res
        .status(400)
        .send({ message: 'Переданы некорректные данные для снятия лайка' });
      return;
    }
    if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
      return;
    }
    if (err.name === 'CastError') {
      res
        .status(400)
        .send({ message: 'Карточка не найдена' });
      return;
    }
    res
      .status(500)
      .send({ err });
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
