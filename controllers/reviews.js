const campground = require('../models/campgrounds');
const Review = require('../models/review');


module.exports.createReview = async(req,res)=>{
    const camp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Successfully,Added your Review!');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // This is for pulling/deleting the review inside campground schema.
    await Review.findByIdAndDelete(reviewId); // this is complete removal from reviews schema as one to many realtion is here and one campground has many reviews possible.
    req.flash('success', 'Successfully Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}