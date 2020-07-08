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

const storageConfig = require(__dirname + '/config/storage.json')[env];

const model = require('./models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(storageConfig.publicStoragePath));

// CORS ALL ACCESS
app.use(cors());

require('./routes')(app);

const PORT = 3001;

// Socket IO testing
const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

app.listen(PORT, () => {
  // Uncomment the below to drop / add all tables ORM models to your local DB
  //model.sequelize.drop();
  model.sequelize.sync();
});

module.exports = app;