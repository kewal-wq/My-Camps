const express = require('express');
const router = express.Router();
const campGround = require('../models/campGround');
const AppError = require('../AppError');
const Review = require('../models/review');
const mongoose = require('mongoose');
// const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('../joiSchema');
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campground');
// const flash = require('connect-flash');
const { application } = require('express');
const passport = require('passport');
const {isLoggedIn, isAuthor, validateCampground} = require('../middlewares');
const {storage} = require('../cloudinary');
const multer = require('multer');
const upload = multer({storage});



const validateReview = (req, res, next) => {
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


router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn, upload.array('image'),validateCampground, catchAsync( campgrounds.createNew));



router.get('/new',isLoggedIn, campgrounds.newForm);

router.route('/:id')
.get( catchAsync(campgrounds.renderShow))
.put(isAuthor, isLoggedIn,upload.array('image'), validateCampground, catchAsync( campgrounds.updateCamp))
.delete(isAuthor, isLoggedIn, catchAsync( campgrounds.destroy))



router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.edit));
// router.post('/:id',isLoggedIn, catchAsync( async (req, res) => {
//     const campground = await campGround.findById(req.params.id);
  
  
// }))





module.exports = router;

