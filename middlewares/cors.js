const allowedCors = [
  'https://rolandsallaz.mesto.nomore.nomoredomains.work',
  'http://rolandsallaz.mesto.nomore.nomoredomains.work',
  'localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  const { method } = req;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Origin', '*');
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', requestHeaders);
  }
  next();
};
