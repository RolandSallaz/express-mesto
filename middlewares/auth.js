const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    const error = new AuthError('Необходимо авторизоваться');
    next(error);
  }

  let payload;
  try {
    payload = jwt.verify(authorization, process.env.JWT_SECRET);
  } catch (e) {
    const error = new AuthError('Токен не действителен');
    next(error);
  }
  req.user = payload;
  next();
};
