const campground = require('../models/campgrounds');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async(req,res)=>{
    const campgrounds = await campground.find({});
    res.render('campgrounds/index',{ campgrounds })
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res,next)=>{  // Basic Custom erroe
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const camp = new campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    // console.log(camp);
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
    // console.log(camp);
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

module.exports.updateCampground = async(req,res)=>{
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    console.log(req.body.deleteImages);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}