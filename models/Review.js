const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
  },
  image: {
    type: String,
    default: ''
  },
  dateAdded: {
    type: Date,
    default: Date.now()
  },
  lastEdited: {
    type: Date,
    default: Date.now()
  }
});

ReviewSchema.index({ location: '2dsphere' });

module.exports = Review = mongoose.model('reviews', ReviewSchema);
