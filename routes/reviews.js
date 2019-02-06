const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const passport = require('passport');
const validateReviewInput = require('../validation/review');
const googleGeoAPI = require('../util/google-maps-geo');
const upload = require('../util/s3-file-upload');

// @route   GET /reviews
// @desc    Get all reviews
// @access  Public
router.get('/', (req, res) => {
  Review.find()
    .sort({ dateAdded: -1 })
    .populate('user', 'name')
    .then(reviews => res.json(reviews));
});

// @route   GET /reviews/:longitude/:latitude/:dist
// @desc    Find all reviews from the location specified within the dist specified
// @access  Public
router.get('/:longitude/:latitude/:dist', (req, res) => {
  Review.aggregate([{
     $geoNear: {
       near: {
         type: "Point",
         coordinates: [
           parseFloat(req.params.longitude),
           parseFloat(req.params.latitude)
         ]
       },
       spherical: true,
       maxDistance: req.params.dist * 1609,
       distanceMultiplier: 1 / 1609,
       distanceField: 'distanceFromiCars'
     }
   },
   {
     $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
   },
   {
     $unwind: "$user"
   },
   {
     $project: {
       _id: 1,
       location: 1,
       dateAdded: 1,
       lastEdited: 1,
       "user._id": 1,
       "user.name": 1
     }
   }])
   .then(reviews => res.json(reviews))
   .catch(err => console.log(err));
});

// @route   POST /reviews/:longitude/:latitude/:dist
// @desc    Find all reviews from the location specified within the dist specified
// @access  Private
router.post('/', upload.single('imgFile'), passport.authenticate('jwt', { session: false }), async (req, res) => {

  const { errors, isValid } = validateReviewInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // return lng lat coordinates from address provided
  const coordinates = await googleGeoAPI(req.body.address, errors, res);

  // use image url if photo uploaded otherwise empty string
  req.file = req.file ? req.file.location : '';

  const newReview = new Review({
    user: req.user.id,
    text: req.body.text,
    location: {
      type: 'Point',
      coordinates: coordinates
    },
    image: req.file
  });

  newReview.save().then(review => res.json(review));
});

// @route   PUT /reviews/:reviewId
// @desc    Edit a review
// @access  Private
router.put('/:reviewId', upload.single('imgFile'), passport.authenticate('jwt', { session: false }), (req, res) => {
  Review.findById(req.params.reviewId).then(async review => {
    let errors = {};

    // validate that current user is author of requested review
    if (review.user.toString() !== req.user.id) {
      errors.unauthorized = 'You can only edit your own reviews';
      return res.status(400).json(errors);
    }

    // use new text if provided, otherwise use previous text
    req.body.text = req.body.text || review.text;
    if (req.body.text.length < 25) {
      errors.text = 'Review must be at least 25 characters';
      return res.status(400).json(errors);
    }

    // calculate new coordinates only if new address is provided
    if (req.body.address) {
      const coordinates = await googleGeoAPI(req.body.address, errors, res);
      req.body.location = {
        type: "Point",
        coordinates: coordinates
      };
    } else {
      req.body.location = review.location;
    }

    // use image url if photo uploaded otherwise empty string
    req.file = req.file ? req.file.location : '';

    // update the review and save
    review.set({
      text: req.body.text,
      location: req.body.location,
      image: req.file,
      lastEdited: Date.now()
    });
    
    review.save().then(review => res.send(review));
  })
})

// @route   DELETE /reviews/:reviewId
// @desc    Delete a review
// @access  Private
router.delete('/:reviewId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Review.findById(req.params.reviewId).then(review => {

    // validate that current user is author of requested review
    if (review.user.toString() !== req.user.id) {
      errors.unauthorized = 'You can only delete your own reviews';
      return res.status(400).json(errors);
    }

    review.remove(() => res.json(review));
  })
})

module.exports = router;
