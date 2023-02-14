const User = require('../models/user');

module.exports.registerform = (req,res)=>{
    res.render('users/register');
}

module.exports.postform = async(req,res)=>{
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
}

module.exports.loginform = (req,res)=>{
    res.render('users/login');
   }

module.exports.submitlogin =(req,res)=>{
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req,res,next)=>{
    req.logout(function(err){
  if(err){
    return next(err);
  }
  req.flash('success','GoodBye!');
  res.redirect('/');
    });
    
}