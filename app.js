require('dotenv').config();

const express = require('express');
const sequelize = require('./db');
const bodyParser = require('body-parser')
const app = express();

sequelize.sync();
app.use(require('./middleware/headers'));
app.use(bodyParser.json());
app.use('/users', require('./controllers/userController'))
app.use('/images', require('./controllers/imageController'));

app.listen(process.env.PORT, () => console.log("Running"));