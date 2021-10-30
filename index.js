const express =  require('express');
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campgrounds');
const methodOverride = require('method-override');
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

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/makecampgrounds', async (req,res)=>{
    const newcampground = new campground({tittle : 'FirstCampground',description:'This is the First One.'});
    await newcampground.save();
    res.send(newcampground);
})

app.get('/campgrounds',async(req,res)=>{
    const campgrounds = await campground.find({});
    res.render('campgrounds/index',{ campgrounds })
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds', async(req,res)=>{
   const camp = new campground(req.body.campground);
   await camp.save();
   res.redirect(`/campgrounds/${camp._id}`);
})


app.get('/campgrounds/:id',async(req,res)=>{
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/show',{camp});
})

app.get('/campgrounds/:id/edit',async (req,res)=>{
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/edit',{ camp });
})

app.put('/campgrounds/:id', async(req,res)=>{
    const { id } = req.params;
    console.log(req.body.campground);
    const camp = await campground.findByIdAndUpdate(id , req.body.campground);
//here ... just open the outer bracket and ramaining inside is take and updated in.
    res.redirect(`/campgrounds/${camp._id}`);
})

app.delete('/campgrounds/:id', async(req,res)=>{
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


app.listen(3000,()=>{
    console.log('App Started');
})