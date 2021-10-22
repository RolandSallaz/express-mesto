const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;
  try {
    payload = jwt.verify(authorization, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(403)
      .send({ message: 'Необходима авторизация 2' });
  }
  req.user = payload;
  next();
};
