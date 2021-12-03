const campGround = require('../models/campGround');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const campground = await campGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();

    await review.save();
    console.log(review);
    req.flash('success', 'Successfully added your review!');
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send('Hi');
    }

    module.exports.destroyReview = async(req, res) => {
        const {id, reviewId} = req.params;
        const dave = await campGround.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        console.log(dave);
         await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted the review!');
        res.redirect(`/campgrounds/${id}`);
        
        }