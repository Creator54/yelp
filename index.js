const express =  require('express');
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campgrounds');

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


app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/makecampgrounds', async (req,res)=>{
    const newcampground = new campground({tittle : 'FirstCampground',description:'This is the First One.'});
    await newcampground.save();
    res.send(newcampground);
})

app.listen(3000,()=>{
    console.log('App Started');
})