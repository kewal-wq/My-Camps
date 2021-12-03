const express = require('express');
const router = express.Router({mergeParams:true});
const campGround = require('../models/campGround');
const AppError = require('../AppError');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middlewares')
const Review = require('../models/review');
const mongoose = require('mongoose');
// const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('../joiSchema');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const reviews = require('../controllers/reviews');





router.post('/',validateReview, catchAsync(reviews.createReview));

    router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(reviews.destroyReview));

        module.exports = router;