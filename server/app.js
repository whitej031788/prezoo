const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Read in information from your .env file
const dotenv = require('dotenv');
dotenv.config();

let env = process.env.NODE_ENV;

if (env === undefined) {
  console.log(`NODE_ENV is ${env}`);
  console.log('NODE_ENV not set, exiting');
  process.exit(1);
}

const model = require('./models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

// CORS ALL ACCESS
app.use(cors());

require('./routes')(app);

const PORT = 3001;

app.listen(PORT, () => {
  model.sequelize.drop();
  model.sequelize.sync();
});

module.exports = app;