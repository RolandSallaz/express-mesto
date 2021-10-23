const NoPermissionError = require('../errors/NoPermissionError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res
        .status(200)
        .send({ card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки по заданному id');
      }

      if (card.owner.toString() !== userId) {
        throw new NoPermissionError('Вы можете удалять только собственные карточки');
      }
      return Card.findByIdAndDelete(cardId)
        .then(() => {
          res
            .send({ message: 'Карточка успешно удалена' });
        })
        .catch(next);
    })
    .catch(next);
};
const likeCard = (req, res, next) => Card.findByIdAndUpdate(req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true })
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки по заданному id');
    }
    res
      .status(200)
      .send({ message: 'Лайк успешно поставлен' });
  })
  .catch(next);

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true })
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки по заданному id');
    }
    res
      .status(200)
      .send({ message: 'Лайк успешно удален' });
  })
  .catch(next);

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
