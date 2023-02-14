const Review = require('../models/review');
const Book = require('../models/books');

module.exports.postreview = async(req,res,next)=>{
    const book = await Book.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    book.reviews.push(review);
    await review.save();
    await book.save();
    req.flash('success', 'Successfully added a review');
    res.redirect(`/books/${book._id}`);
}

module.exports.deletereview = async(req,res,next)=>{
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/books/${id}`);
}