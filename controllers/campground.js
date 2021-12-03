const campGround = require('../models/campGround');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');



module.exports.index = async (req, res) => {
    const campgrounds = await campGround.find({});

    res.render('campground/index', { campgrounds });
}

module.exports.newForm = (req, res, next) => {

    res.render('campground/new');
}

module.exports.renderShow = async (req, res, next) => {

    const campground = await campGround.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }

    }).populate('author');

    if (!campground) {

        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');

    }
    // console.log(campground);
    res.render('campground/show', { campground });

}

module.exports.createNew = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new campGround(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    // console.log(campground);
    // console.log(c)
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    // console.log(campground);
    req.flash('success', 'Yay created a new Campground!!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const campground = await campGround.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect(`/campgrounds/${id}`);
    }
    res.render('campground/edit', { campground });
}

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;

    // console.log(req.body.deleteImages);

    const campground = await campGround.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        
        console.log(req.body.deleteImages);
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        // console.log(campground);
    }
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground!');
    res.redirect('/campgrounds');
}