const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const book = require('../controller/book');

router.get('/',catchAsync(book.index));

router.get('/new', isLoggedIn, book.addbook);

router.post('/',isLoggedIn, catchAsync(book.postbook));
 
router.get('/:id',catchAsync(book.showbook));

router.get('/:id/buy',isLoggedIn, catchAsync(book.buybook));

router.get('/:id/cart',isLoggedIn, catchAsync(book.cart));

router.delete('/:id', isLoggedIn, catchAsync(book.deletebook));

module.exports=router;
