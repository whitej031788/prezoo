const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();

let env = process.env.NODE_ENV;

if (!env || env !== 'production') {
  // Read in information from your .env file for local
  // for production, env variables are set in the Elastic Beanstalk config
  const dotenv = require('dotenv');
  dotenv.config();

  env = process.env.NODE_ENV;

  if (env === undefined) {
    console.log(`NODE_ENV is ${env}`);
    console.log('NODE_ENV not set, exiting');
    process.exit(1);
  }
}

const storageConfig = require(__dirname + '/config/storage.json')[env];

const model = require('./models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(storageConfig.publicStoragePath));

// CORS ALL ACCESS
app.use(cors());

require('./routes')(app);

const PORT = process.env.PORT ? process.env.PORT : 3001;

const server = app.listen(PORT, () => {
  // Uncomment the below to drop / add all tables ORM models to your local DB
  // model.sequelize.drop();
  model.sequelize.sync();
});

const io = socketIo(server);

let usersList = {};

// Need a better way to do this than just in the JS memory
// We are keeping a running tally by room of attendants; maybe firebase? Mongo? Redis?
function updateUserlist(action, sender, room) {
  if (!(room in usersList)) {
    usersList[room] = [];
  }

  // add user to userlist
  if (action === 'join') {
    usersList[room].push({
      userName: sender
    });
  }

  // remove user from userlist
  else if (action === 'leave') {
    usersList[room].map((user, index) => {
      if (user.userName === sender) {
        usersList[room].splice(index, 1);
      }
    });
  }
}

io.on("connection", (socket) => {
  // Only join the socket to the GUID room for the presentation, so they don't get all emits
  socket.join("room-" + socket.handshake.query.projectGuid);
  // join
  socket.on('chatJoin', function (msg) {
    // add user to userlist
    updateUserlist('join', msg.sender, socket.handshake.query.projectGuid);

    // send userlist
    io.sockets.in("room-" + socket.handshake.query.projectGuid).emit('chatUsers', usersList[socket.handshake.query.projectGuid]);

    // send join message
    io.sockets.in("room-" + socket.handshake.query.projectGuid).emit('chatJoin', msg);
  });

  // leave
  socket.on('chatLeave', function (msg) {
    // remove user from userlist
    updateUserlist('leave', msg.sender, socket.handshake.query.projectGuid);

    // send userlist
    io.sockets.in("room-" + socket.handshake.query.projectGuid).emit('chatUsers', usersList[socket.handshake.query.projectGuid]);

    // send leave message
    io.sockets.in("room-" + socket.handshake.query.projectGuid).emit('chatLeave', msg);
  });

  // message
  socket.on('chatMessage', function (msg) {
    // send message
    io.sockets.in("room-" + socket.handshake.query.projectGuid).emit('chatMessage', msg);
  });

  // slide change
  socket.on('changeSlide', function (msg) {
    io.sockets.in("room-" + socket.handshake.query.projectGuid).emit('changeSlide', msg);
  });
});

module.exports = app;