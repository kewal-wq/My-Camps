if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


// require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const campGround = require('./models/campGround');
const AppError = require('./AppError');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./joiSchema');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const campgroundsR = require('./routes/campground');
const reviewR = require('./routes/review');
const userR= require('./routes/users');
const User = require('./models/user');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
// const { init } = require('./models/review');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// process.env.DB_URL
// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open" ,() => {
    console.log("Database connected");
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://code.jquery.com/jquery-3.3.1.slim.min.js"

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://code.jquery.com/jquery-3.3.1.slim.min.js"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dizq80bmt/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const secret = process.env.SECRET || 'Itsabettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24*60*60
})
store.on("error", function(e){
    console.log("Session Store Error", e);
})

const sessionConfig = {
          
          store,

    name:'session',
    secret,
    resave: false,
    saveUninitiallized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now() * 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.engine('ejs', ejsMate);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userR);
app.use('/campgrounds', campgroundsR);
app.use('/campgrounds/:id/reviews', reviewR);



const verifyPassword = (req, res, next) => {
const {password} = req.query;
if(password === 'chickennugget')
{
    next();
}
// res.send("Please enter a correct password");
// throw new Error("Oh no enter a valid password!");
throw new AppError('Password required', 401);
}




app.get('/', (req, res) => {
    res.render('campground/home');
})



// app.use((req, res) => {
//     res.status(404).send("NOT FOUND");
// })
app.get('/secret', verifyPassword, (req, res) => {
    res.send("My secret password is : SHILVI");
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})
app.use((err, req, res, next) => {
const{status = 500} = err;
if(!err.message) err.message = 'OH NO Something went wrong!';
res.status(status).render('error', {err});
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Listning to port ${port}`);
})