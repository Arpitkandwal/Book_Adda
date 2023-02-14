const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const review = require('../controller/review');

router.post('/books/:id/reviews', isLoggedIn, catchAsync(review.postreview));

router.delete('/books/:id/reviews/:reviewId', catchAsync(review.deletereview));


module.exports = router;