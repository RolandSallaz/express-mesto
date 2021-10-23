const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  const { JWT_SECRET = 'dd4363ae6ef2daa8a66e2ab5e432ac9c7aea658a6c9da53e7e9d1001531adc71' } = process.env;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    const error = new AuthError('Токен не действителен');
    next(error);
  }
  req.user = payload;
  next();
};
