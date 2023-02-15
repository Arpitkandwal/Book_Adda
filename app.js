if(process.env.NODE_EMV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/book');
const reviewRoutes = require('./routes/review');
const MongoDBStore = require("connect-mongo")(session);
// const dbUrl = process.env.DB_URL;

const dbUrl = 'mongodb://127.0.0.1/book-chor';
mongoose.set('strictQuery','false');
mongoose.connect(dbUrl);

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

const store = new  MongoDBStore({
    url: dbUrl,
    secret:'thisshouldbeabettersecret',
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("session store error", e)
})

const sessionConfig = {
    store,
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet({contentSecurityPolicy: false}));

// app.use(
//     helmet.contentSecurityPolicy({
//         directives:{
//             defaultSrc: [],
//             connectSrc:["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcurls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc:[],
//             imgSrc: [
//                 "'self'",
//                 "blob",
//                 "data:",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}); 

app.use('/', userRoutes);
app.use('/books',bookRoutes);
app.use('/',reviewRoutes);

app.get('/',(req,res)=>{
    res.render('home');
});

app.use((err, req, res, next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message = 'Oh NO, Something Went Wrong!'
    res.status(statusCode).render('error',{err});
    
})


app.listen(3000,()=>{
    console.log("Listening on Port 3000!");
})