const mongoose = require('mongoose');
const cities = require('./data');
const {places, descriptors} = require('./places');
const campGround = require('../models/campGround');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open" ,() => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random()*array.length)];
const price = Math.floor(Math.random() * 100) + 10;

const seedDB = async () => {
    await campGround.deleteMany({});
    for(let i = 0; i < 300; i++)    {
        const randN = Math.floor(Math.random()*10);
        const c = new campGround({
            author: '616ef813cd1acac0a5b3ea93',
            location : `${cities[randN].city}, ${cities[randN].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randN].longitude,
                    cities[randN].latitude
                  ]
            },
           images : [
               {
            url: 'https://res.cloudinary.com/dizq80bmt/image/upload/v1634288541/YelpCamp/mtgdmjbitfw7egzvurwf.jpg',
            filename: 'YelpCamp/mtgdmjbitfw7egzvurwf',
            
          },
          {
            url: 'https://res.cloudinary.com/dizq80bmt/image/upload/v1634288540/YelpCamp/jpfghhpkt5kt6yd9drbt.jpg',
            filename: 'YelpCamp/jpfghhpkt5kt6yd9drbt',
        
          }
      
           ],
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
            price
        })
        await c.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})