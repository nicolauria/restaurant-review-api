const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server running on port ${port}`));

const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('mongoDB connected'))
  .catch(err => console.log(err));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// disabled CORS for testing the API
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const path = require('path');
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')));

const users = require('./routes/users');
app.use('/users', users);

const reviews = require('./routes/reviews');
app.use('/reviews', reviews);

const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());
