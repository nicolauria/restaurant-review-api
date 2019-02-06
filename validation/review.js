const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateReviewInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';
  data.address = !isEmpty(data.address) ? data.address : '';

  if (!Validator.isLength(data.text, { min: 25, max: 1000 })) {
    errors.email = 'Review must be at least 25 characters';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Address field required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
