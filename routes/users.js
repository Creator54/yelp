const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');


router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/register' ,catchAsync(async(req,res)=>{
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        // console.log(registeredUser);
        req.flash('success','You are Registered as a Member');
        res.redirect('/campgrounds');
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}));

router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Bcak');
    res.redirect('/campgrounds'); // Demmo account {username : abc , password : password }
})

 a



module.exports = router;