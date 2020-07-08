const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');

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

const server = app.listen(PORT, () => {
  // Uncomment the below to drop / add all tables ORM models to your local DB
  //model.sequelize.drop();
  model.sequelize.sync();
});

const io = socketIo(server);

var usersList = [];

function updateUserlist(action, sender) {
  // add user to userlist
  if (action === 'join') {
    usersList.push({
      userName: sender
    });
  }

  // remove user from userlist
  else if (action === 'leave') {
    usersList.map((user, index) => {
      if (user.userName === sender) {
        usersList.splice(index, 1);
      }
    });
  }
}

io.on("connection", (socket) => {
  // join
  socket.on('chatJoin', function (msg) {
    // add user to userlist
    updateUserlist('join', msg.sender);

    // send userlist
    io.emit('chatUsers', usersList);

    // send join message
    io.emit('chatJoin', msg);
  });

  // leave
  socket.on('chatLeave', function (msg) {
    // remove user from userlist
    updateUserlist('leave', msg.sender);

    // send userlist
    io.emit('chatUsers', usersList);

    // send leave message
    io.emit('chatLeave', msg);
  });

  // message
  socket.on('chatMessage', function (msg) {
    // send message
    io.emit('chatMessage', msg);
  });

  // slide change
  socket.on('changeSlide', function (msg) {
    io.emit('changeSlide', msg);
  });
});

module.exports = app;