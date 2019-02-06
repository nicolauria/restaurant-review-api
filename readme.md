# Restaurant Review API
An application that mimics the api calls a restaurant review service would use<br>
The app is hosted on Heroku and can be tested with Postman<br>
[https://restaurant-review-api.herokuapp.com/](https://restaurant-review-api.herokuapp.com/)
***
## Dependencies
The following is an exhaustive list of dependencies

### Server/Database
**express** - web server<br>
**mongoose** - database/orm

### Authentication
**bcryptjs** - used to hash new passwords<br>
**jsonwebtoken** - used to store session information<br>
**passport** & **passport-jwt** - used to privatize certain routes

### Validation
**validator** - parse all post/put request data

### Middleware
**body-parser** - parse urlencoded data and make it available on req.body<br>
**multer** & **multer-s3** - parse form data and make it available on req.file & req.body

### APIS
**@google/maps** - convert physical address to lng/lat coordinates<br>
**aws-sdk** - used to store media files a Amazon S3 Bucket
***
## Routes
The api supports the routes listed below. I recommend using Postman to test the routes. Please use 'form-data' body type when creating a new review or editing an existing review. Otherwise use 'x-www-form-urlencoded'.<br><br>All received data is validated before any database submission.<br>
Below is one example of an invalid attempt to register a new user. Errors are returned as a JSON object.<br><br>
<img src="./images/invalid-register.png" width="900" style="display: block">
<br>The remaining routes below do not show examples of invalid requests but feel free to test the routes yourself.

### Users
`POST '/users/register'` - register a new user<br><br>
<img src="./images/register.png" width="900">
***
`POST '/users/login'` - login a user<br>
NOTE: you will need the token returned to access private routes<br><br>
<img src="./images/login.png" width="900">
***
### Reviews
`GET '/reviews'` - get all reviews<br><br>
<img src="./images/reviews.png" width="900">
***
`GET '/reviews/:longitude/:latitude/:dist` - get reviews within the dist of the location specified by the coordinates<br>
NOTE: the database is seeded with 100 reviews all within a 100 mile radius of the
San Francisco Ferry Building (longitude: -122.39606, latitude: 37.796156). The example
below uses these coordinates and finds all reviews within 10 miles. Feel free to change the distance to get more reviews.<br><br>
<img src="./images/distance-reviews.png" width="900">
***
`POST '/reviews'` - create a new review<br>
you must first log in so that you can copy and paste the token returned<br>
you can either create a new user or use these credentials to log in:<br>
email: nicolauria@outlook.com<br>
password: secret<br>

add the authorization token as a header:
<img src="./images/authorization-token.png" width="900" style="display: block;"><br>
then you can add the new review information and submit<br>
NOTE: you must use form-data if you want to add an image (field name should be 'imgFile')<br><br>
<img src="./images/new-review.png" width="900">
***
`PUT '/reviews/:reviewId'` - update a review<br><br>
<img src="./images/edit-review.png" width="900">
***
`DELETE '/reviews/:reviewId'` - delete a review<br>
NOTE: the deleted review is returned as JSON and could be used to update the state of our frontend<br><br>
<img src="./images/delete-review.png" width="900"><br><br>

That's it! I hope you enjoyed using the api.
