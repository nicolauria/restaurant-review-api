const key = require('../config/keys').googleMapsApiKey

function getGeoCode(address, errors, res) {
  const googleMapsClient = require('@google/maps').createClient({
    key: key,
    Promise: Promise
  });

  return googleMapsClient.geocode({ address: address })
    .asPromise().then(response => {
      if (response.json.status === 'ZERO_RESULTS') {
        errors.address = 'Invalid address. Use this format: 2829 S St Sacramento, CA 95816';
        return res.status(400).json(errors);
      } else {
        coordinates = [
          response.json.results[0].geometry.location.lng,
          response.json.results[0].geometry.location.lat
        ]
        return coordinates;
      }
    })
}

module.exports = getGeoCode;
