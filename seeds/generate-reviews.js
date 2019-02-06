const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true })
const Review = require('../models/Review');
const User = require('../models/User');

const csvtojson = require('csvtojson');
const randomLocation = require('random-location');

const ferryBuilding = {
  latitude: 37.796156,
  longitude: -122.39606
}

Review.deleteMany();

User.find().then(users => {
  csvtojson().fromFile('./reviews.csv').then(reviews => {
    reviews.forEach(review => {
      // generate random location within 100 mile radius of SF Ferry Building
      const randomPoint = randomLocation.randomCirclePoint(ferryBuilding, 160934);
      const coordinates = [randomPoint.longitude, randomPoint.latitude];

      review.location = {
        type: "Point",
        coordinates: coordinates
      }

      const user = users[Math.floor(Math.random() * users.length)];
      review.user = user._id;

      Review.create(review);
    });
  });
});
