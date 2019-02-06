const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true })
const User = require('../models/User');
const bcrypt = require('bcryptjs');

User.deleteMany();

const csvtojson = require('csvtojson');

csvtojson().fromFile('./users.csv').then(users => {
  users.forEach(user => {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash('secret', salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        User.create(user);
      })
    })
  })
});
