const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/Users');

router.get('/register',users.renderRegister);

router.get('/login',users.renderLogin);

router.post('/register' ,catchAsync(users.register));

router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login);

router.get('/logout',users.logout);


module.exports = router;