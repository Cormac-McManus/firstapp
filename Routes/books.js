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

    let bookSaved = await book.save();

    res.location(`/${book._id}`)
    .status(201)
    .json(book);


    // Request Validation
    if (result.error)
    {
        res.status(400).json(result.error);
        return;
    }

    console.log(bookSaved);
  
});
  

router.get('/', async (req, res) => {
    const { title, year_written, limit, pagenumber, pagesize } = req.query;

    let filter = {};

    // Title filter
    if (title) {
        filter.title = { $regex: `${title}`, $options: 'i' }
    }

    //Year Filter
    const yearNumber = parseInt(year_written)

  
  if (!isNaN(yearNumber)) {
    Number.isInteger(year_written)
    filter.year_written = yearNumber
  }

  //Limit results
  let limitNumber = parseInt(limit)
  if (isNaN(limitNumber)) {
    limitNumber = 0
  }
  filter.limit = limitNumber;

  //Page size 
  let pageSizeNumber = parseInt(pagesize);

  if (isNaN(pageSizeNumber)) {
    pageSizeNumber = 0
  }
  let pageNumberNumber = parseInt(pagenumber);

  if (isNaN(pageNumberNumber)) {
    pageNumberNumber = 1
  }

  console.table(filter);


    //Filter, sorting, select methods.
    const books = await Book.find(filter)
    .limit(limitNumber)
    .sort({ year_written: "ascending", price: 1})
    .skip((pageNumberNumber -1)*pageSizeNumber)
    .select("author.name");
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

    const _title = req.body.title;
    const _yearWritten = req.body.year_written
    const _authorname = req.body.author.name;
    const _authornationality = req.body.author.nationality;
    const _edition = req.body.edition;
    const _price = req.body.price;
    const _tags = req.body.tags;

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
  
    if (!book) {
      res.status(404).json(`book with that ID {req.params.id} was not found`);
      return;
    }
    res.send(book);
})

module.exports = router