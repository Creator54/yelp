const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body:string,
    rating:number
})


module.exports = mongoose.model('review',reviewSchema); 