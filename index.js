const express = require('express');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('./configure/conn');
var adminRouter = require('./routes/admin');

const app = express();

app.use(express.static('public/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileupload());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use('/', adminRouter);

app.listen(1000, () => {
  console.log(`Server is running on http://localhost:1000`);
});