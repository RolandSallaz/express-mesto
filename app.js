const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const ValidationError = require('./errors/ValidationError');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();
const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new ValidationError('Неправильный формат ссылки');
  }
  return value;
};
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2),
    about: Joi.string().min(2),
    avatar: Joi.string().custom(validateURL),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(() => {
  throw new NotFoundError('404 Страница не найдена');
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening ons port ${PORT}`);
});
