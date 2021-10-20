const { json } = require('express');
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
  

router.get('/:id', async (req,res) => {
    const id = req.params.id;

    const book = await Book.findById(id)

    if (!book) {
    res.status(404);
    res.json({ error: 'not found'});
    return
    }
    
    res.json(book);
    
})

router.delete('/:id', async (req, res) => {
    
    const id = req.params.id;
    const book = await Book.findByIdAndDelete(id)
    const books = await Book.find();
  
    if (!book) {
      res.status(404).json(`book with that ID {id} was not found`);
      return;
    }

    res.json(books)
  
})

router.put('/:id', async (req, res) => {

    const id = req.params.id;
    const result = validate(req.body);
    const _quantity = (req.body.quantity);
    const _name = req.body.name;

    // Request Validation
    if (result.error)
    {
        res.status(400).json(result.error);
        return;
    }
  
    Book.findByIdAndUpdate({_id: id}, {...req.body}).
    then((result) => {
        if (result) {
            res.status(200).send({ message: 'updated' })
        }
        else {
            res.status(404).send({ message: 'not found' })
        }
    })
    .catch((error) =>
        res.status(404).send({ message: 'not found' + error }));
  
    /*if (!book) {
      res.status(404).json(`book with that ID {req.params.id} was not found`);
      return;
    }
  
    console.log(`changing book ${book.name}`);
    book.name = req.body.name;
    book.quantity = req.body.quantity;
    res.send(book);*/
})

module.exports = router