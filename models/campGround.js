const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const campGroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);


campGroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});



campGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('campGround', campGroundSchema);
















































































// const mongoose = require('mongoose');
// const review = require('./review');
// const Schema = mongoose.Schema;

// const imageSchema = new Schema({
//     url: String,
//     filename: String
// })

// imageSchema.virtual('thumbnail').get(function()  {
// return this.url.replace('/upload', '/upload/w_200');
// })
// const campGroundSchema = new Schema ({
//     title : String,
//     images: [imageSchema],
//     price : Number,
//     image: String,
//     geometry: {
//         type: {
//             type:String,
//             enum: ['Point'],
//             required: true
//         },
//         coordinates: {
//             type: [Number],
//             required: true
//         }
//     },
//     description :String,
//     location : String,
//     author: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     reviews: [
//         {
//             type: Schema.Types.ObjectId,
//             ref: 'Review',
//         }
//     ]
   
// });


// campGroundSchema.virtual('properties.popUpMarkup').get(function()  {
//     return `<strong><a href = "/campgrounds/${this._id}">${this.title}</a><strong>
//     <p>${campground.description}</p>`;
//     });
// const opts = { toJSON: {virtuals: true}};


// campGroundSchema.post('findOneAndDelete', async function(doc) {
//     if(doc)
//     {
//         await review.deleteMany({
//             _id: {
//                 $in: doc.reviews
//             }
//         })
//     }
// }, opts);
// module.exports = mongoose.model('campGround', campGroundSchema);