const campground = require('../models/campgrounds');

module.exports.index = async(req,res)=>{
    const campgrounds = await campground.find({});
    res.render('campgrounds/index',{ campgrounds })
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res,next)=>{  // Basic Custom erroe
    // console.log(req.body.campground);
    // if(!req.body.campground) throw new ExpressError('Invalid Campground',404); // throw to CatchAsync 
    const camp = new campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async(req,res)=>{
    const camp = await campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    console.log(camp);
    if(!camp){
        req.flash('error','Cannot Find That Campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{camp});
    
}

module.exports.renderEditForm = async (req,res)=>{
    const camp = await campground.findById(req.params.id);
    if(!camp){
        req.flash('error','Cannot Find That Campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{ camp });
}

module.exports.updateCampgrounds = async(req,res)=>{
    const camp = await campground.findByIdAndUpdate(id , req.body.campground);
    req.flash('success', 'Successfully Updated');
    //here ... just open the outer bracket and ramaining inside is take and updated in.
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async(req,res)=>{
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}