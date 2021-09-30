const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT = 3000 } = process.env;
const app = express();


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});
app.use(express.json());
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`App listening ons port ${PORT}`)
})