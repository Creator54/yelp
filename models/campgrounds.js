const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundsSchema = new Schema({
    tittle : String,
    image:String,
    price : Number,
    description : String,
    location :String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})


module.exports = mongoose.model('Campground',CampgroundsSchema);