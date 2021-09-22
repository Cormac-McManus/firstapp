const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies


app.get('/', (req, res) => res.send('Hello World from Una!'))

app.get('/bananas', (req, res) => 
  res.send('hello world, this is bananas'));

app.get('/routes/3', (req, res) =>
  res.send('hello world, this is route 3'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let books = [];

app.post('/books', (req, res) => {
    const book = req.body;
    books.push(book);

    res.send ('book has been added to the database');
    console.log(`book name is ${book.name} number of book is ${books.length}`);

});

app.get 
('/books', (req, res) => {
    res.send(books);
})

app.get('/books/:id',(req,res) => {
    let id = req.params.id;
    res.json(books[id]);
})

app.delete('/books/:id',(req,res) => {
    let id = req.params.id;
    console.log(`removing book ${books[id].name}`)
    books.splice(req.params.id, 1);
    res.send(books);
    console.log('Current book list: ');
    books.forEach(book => {
        console.log(book.name);
    });
})