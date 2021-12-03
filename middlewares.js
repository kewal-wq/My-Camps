const {campgroundSchema, reviewSchema} = require('./joiSchema');
const Review = require('./models/review');
const campGround = require('./models/campGround');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res,next) => {
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to view that page');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campground = await campGround.findById(id);
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
  
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    
    }
    else{
        next();
    }
}