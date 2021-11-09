const express = require('express');
const router  = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campgrounds');
const { campgroundSchema } = require('../schemas');

const validateCampground = (req,res,next) =>{
    const { error } = campgroundSchema.validate(req.body);
    // console.log(error);
    if(error){
        const msg = error.details.map( el => el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}


router.get('/',catchAsync(async(req,res)=>{
    const campgrounds = await campground.find({});
    res.render('campgrounds/index',{ campgrounds })
}))

router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
})

router.post('/',validateCampground,catchAsync(async(req,res,next)=>{  // Basic Custom erroe
        // console.log(req.body.campground);
        // if(!req.body.campground) throw new ExpressError('Invalid Campground',404); // throw to CatchAsync 
        const camp = new campground(req.body.campground);
        await camp.save();
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${camp._id}`);
}))


router.get('/:id', catchAsync(async(req,res)=>{
    const camp = await campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{camp});
}))

router.get('/:id/edit', catchAsync(async (req,res)=>{
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/edit',{ camp });
}))

router.put('/:id', validateCampground, catchAsync(async(req,res)=>{
    const { id } = req.params;
    // console.log(req.body.campground);
    const camp = await campground.findByIdAndUpdate(id , req.body.campground);
    req.flash('success', 'Successfully Updated');
//here ... just open the outer bracket and ramaining inside is take and updated in.
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete('/:id',  catchAsync(async(req,res)=>{
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))


module.exports = router;