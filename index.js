const express =  require('express');
const path = require('path');
const mongoose = require('mongoose');
const Joi = require('joi');
const campground = require('./models/campgrounds');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema , reviewSchema } = require('./schemas');
const Review = require('./models/review');

const campgrounds = require('./routes/campground');



mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser : true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection Error"))
db.once('open',()=>{
    console.log("Database connceted");
})

const app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

app.use('/campgrounds',campgrounds);

app.get('/',(req,res)=>{
    res.render('home');
})

const varifypassword = (req,res,next) =>{
    const { password } = req.query;
    if (password === 'pass') {
        next();
    }
    res.send("YOU NEED A PASSWORD!")
}

// const validateCampground = (req,res,next) =>{
//     const { error } = campgroundSchema.validate(req.body);
//     // console.log(error);
//     if(error){
//         const msg = error.details.map( el => el.message).join(',');
//         throw new ExpressError(msg,400);
//     }else{
//         next();
//     }
// }

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map( el => el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

app.get('/makecampgrounds', catchAsync(async (req,res)=>{
    const newcampground = new campground({tittle : 'FirstCampground',description:'This is the First One.'});
    await newcampground.save();
    res.send(newcampground);
}))

app.get('/secret',varifypassword,(req,res)=>{
    res.send("You Have been Pranked , Smile at the Camera.")
})

app.post('campgrounds/:id/reviews', validateReview , catchAsync(async(req,res)=>{
    const camp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // This is for pulling/deleting the review inside campground schema.
    await Review.findByIdAndDelete(reviewId); // this is complete removal from reviews schema as one to many realtion is here and one campground has many reviews possible.
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

//Basic custom Error Handler Added.
app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', { err } );
    // res.send('Basic Error Handler Working');
})

app.listen(3000,()=>{
    console.log('App Started');
})