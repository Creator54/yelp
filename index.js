const express =  require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');

const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');



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
app.use(express.static(path.join(__dirname,'public')));


const sessionConfig = {
    secret : "This is the False Secret",
    resave : false,
    saveUninitialized : true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews)



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


app.get('/secret',varifypassword,(req,res)=>{
    res.send("You Have been Pranked , Smile at the Camera.")
})



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