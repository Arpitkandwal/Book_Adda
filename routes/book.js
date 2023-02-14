const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Book=require('../models/books');
const {isLoggedIn} = require('../middleware');

router.get('/',async(req,res)=>{
    const books=await Book.find({});
    res.render('books/index',{ books });
});

router.get('/new', isLoggedIn, async(req,res)=>{
    res.render('books/new');
 });
 
router.get('/:id',catchAsync( async(req,res)=>{
     const Id=req.params.id;
     const book= await Book.findById(Id).populate('user').populate({
        path:'reviews',
         populate:{
            path:'author'
        }});
     console.log(book);
     res.render('books/show',{book});
 }));

router.post('/',isLoggedIn, catchAsync(async(req,res, next)=>{
        const book = new Book(req.body.book);
        book.user = req.user._id;
        await book.save();
        req.flash('success', 'Successfully added a book');
        res.redirect(`/books/${book._id}`);
 }));

router.get('/:id/buy',isLoggedIn, catchAsync(async(req,res,next)=>{
       res.render('books/buy');
}));

router.get('/:id/cart',isLoggedIn, catchAsync(async(req,res,next)=>{
    const Id=req.params.id;
     const book= await Book.findById(Id);
     await book.save();
       res.render('books/cart',{book});
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req,res)=>{
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect('/books');

}));

module.exports=router;
