const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Review = require('./models/review');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Book = require('./models/books')

const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/book');
const { isLoggedIn } = require('./middleware');


mongoose.set('strictQuery','false');
mongoose.connect( 'mongodb://127.0.0.1/book-chor');

const  db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// we will wait till mongo is ready before letting the http handler query users:
db.once('open', function () {
    console.log('Running');
});

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}); 

app.use('/', userRoutes);
app.use('/books',bookRoutes);

app.get('/',(req,res)=>{
    res.render('home');
});

app.post('/books/:id/reviews', isLoggedIn, catchAsync(async(req,res,next)=>{
      const book = await Book.findById(req.params.id);
      const review = new Review(req.body.review);
      review.author = req.user._id;
      book.reviews.push(review);
      await review.save();
      await book.save();
      req.flash('success', 'Successfully added a review');
      res.redirect(`/books/${book._id}`);
}));

app.delete('/books/:id/reviews/:reviewId', catchAsync(async(req,res,next)=>{
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/books/${id}`);
}));

// app.all('*', async(req,res,next)=>{
//     next(new ExpressError('Page Not Found', 404))
// })

app.use((err, req, res, next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message = 'Oh NO, Something Went Wrong!'
    res.status(statusCode).render('error',{err});
    
})


app.listen(3000,()=>{
    console.log("Listening on Port 3000!");
})