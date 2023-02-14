const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const user = require('../controller/user');

router.get('/register', user.registerform);

router.post('/register', catchAsync(user.postform));

router.get('/login', user.loginform);

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', keepSessionInfo:true}), user.submitlogin);

router.get('/logout', user.logout);
 
module.exports = router;