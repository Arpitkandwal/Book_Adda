const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
router.get('/register', (req,res)=>{
    res.render('users/register');
});

router.post('/register', catchAsync(async(req,res)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash('success','Welcome to Book_Chor');
        res.redirect('/books');
    })
    } 
    catch(e){
        req.flash('error','A user with this username or password already registered');
        res.redirect('/register');
    }
}));

router.get('/login', (req,res)=>{
 res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', keepSessionInfo:true}),(req,res)=>{
  req.flash('success', 'Welcome Back');
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});

router.get('/logout',(req,res,next)=>{
    req.logout(function(err){
  if(err){
    return next(err);
  }
  req.flash('success','GoodBye!');
  res.redirect('/');
    });
    
});
 
module.exports = router;