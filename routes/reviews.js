const express = require('express');
const router = express.Router({mergeParams:true}); // for using same params has in params of index page.
const catchAsync = require('../utils/catchAsync');
// const Review = require('../models/review');
// const campground = require('../models/campgrounds');
const {validateReview , isLoggedIn ,isReviewAuthor} = require('../middleware');
const Reviews = require('../controllers/reviews');


router.post('/',isLoggedIn, validateReview , catchAsync(Reviews.createReview))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(Reviews.deleteReview))

module.exports = router;