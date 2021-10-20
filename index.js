const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/bookDB', {
  "useNewUrlParser": true,
  "useUnifiedTopology": true
});

const books = require('./Routes/books');
const home = require('./Routes/home');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DB connected')
});


app.use(express.json());
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies

app.use('/books', books)

app.get('/routes/3', (req, res) =>
  res.send('hello world, this is route 3'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))