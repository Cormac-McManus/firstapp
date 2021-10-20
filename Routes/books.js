const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Book, validate } = require('../models/books');
// Notethe above line is shorthand for 
/*
const bookImports = require('../models/books');
const Book = bookImports.Book;
const validate = bookImports.validate;
*/



router.post('/', async (req, res) => {

    let book = new Book(req.body);

    //const newBookID = books.length;
  
    //const book = { bookId: newBookId, ...req.body };

    const result = validate(req.body);

    book = await book.save();

    res.location(`/${book._id}`)
    .status(201)
    .json(book);


    // Request Validation
    if (result.error)
    {
        res.status(400).json(result.error);
        return;
    }
  
    /*books.push(book);
  
    console.log(`book name is ${book.name} number of book(s) is ${books.length}`);*/
  
});
  

router.get('/', async (req, res) => {
    const books = await Book.find();
    res.json(books);
  })
  

router.get('/:id',(req,res) => {
    const id = req.params.id;

    const book = books.find(b => b.bookId === parseInt(req.params.id))

    if (!book) {
        res.status(404);
        res.json({ error: 'not found'});
        return
    }

    res.json(book);
})

router.delete('/:id', (req, res) => {

    const id = req.params.id;
  
    const book = books.find(b => b.bookId === parseInt(req.params.id))
  
    if (!book) {
      res.status(404).json(`book with that ID {id} was not found`);
      return;
    }
  
    const index = books.indexOf(book);
  
    books.splice(index, 1);
    res.send(book);
  
})

router.put('/:id', (req, res) => {

    const id = req.params.id;

    const result = validate(req.body)

    // Request Validation
    if (result.error)
    {
        res.status(400).json(result.error);
        return;
    }
  
    const book = books.find(b => b.bookId === parseInt(req.params.id))
  
    if (!book) {
      res.status(404).json(`book with that ID {req.params.id} was not found`);
      return;
    }
  
    console.log(`changing book ${book.name}`);
    book.name = req.body.name;
    book.quantity = req.body.quantity;
    res.send(book);
})

module.exports = router