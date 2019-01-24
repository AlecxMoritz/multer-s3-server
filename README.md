
# Image Upload Server

Small set up for a database and server to allow users to upload images, edit their uploads, delete uploads, and view all images posted by all users as well as their own.

## To Run
1. Clone
2. Set up own database in pgAdmin and change connection in ```db.js``` to match database and postgres password
3. ```npm install``` dependencies
4. Set up ```uploads/``` folder.
5. Use ```nodemon``` to run server.


## Main Dependencies
* Express
* Sequelize
* Multer

### Other Dependencies
* bcryptjs
* jsonwebtoken
* body-parser
* dotenv