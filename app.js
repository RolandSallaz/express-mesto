const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '61559e3776a605b98d7bdcc1',
  };

  next();
});
app.use(express.json());
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: '404 Страница не найдена' });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening ons port ${PORT}`);
});
