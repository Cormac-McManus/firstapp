const express = require('express')
const Joi = require('joi');
const app = express()
const port = 3000
const books = require('./routes/books');
const home = require('./Routes/home');
app.use('/books', books)


app.use(express.json());
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies

app.get('/routes/3', (req, res) =>
  res.send('hello world, this is route 3'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))