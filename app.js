const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT = 3000 } = process.env;
const app = express();


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});
app.use((req, res, next) => {
  req.user = {
    _id: '61559e3776a605b98d7bdcc1' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(express.json());
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening ons port ${PORT}`)
})