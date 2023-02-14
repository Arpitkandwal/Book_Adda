const mongoose = require('mongoose');
const Book=require('../models/books');
const booksData = require('./books-data');

mongoose.set('strictQuery','false');
mongoose.connect( 'mongodb://127.0.0.1/book-chor');

const  db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// we wait till mongo is ready before letting the http handler query users:
db.once('open', function () {
    console.log('Running');
});

const seedDB = async()=>{
    await Book.deleteMany({});
    for(let i=0; i<50; i++)
    {
        const random50=Math.floor(Math.random()*50);
        // const price = Math.floor(Math.random()*15)+3;
       const book= new Book({
            user:'63e8e3f20c41fc187a1a8f49',
            title:`${booksData[random50].title}`,
            author:`${booksData[random50].author}`,
            image:`${booksData[random50].image}`,
            description: `${booksData[random50].description}`,
            price: `${booksData[random50].price}`
           
        })
        await book.save();
}
}

seedDB().then(()=>{
    mongoose.connection.close();
});