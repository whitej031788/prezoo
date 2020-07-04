'use strict';

const fs = require('fs');
const list = fs.readdirSync(__dirname).filter(dir => !dir.match(/(^\.)|index/i));
const router = require('express').Router();

module.exports = (app) => {
  for (let ctrl of list) {
    // Web.js are primary routes for full Doc requests; not so many of these, maybe none
    if (ctrl === "web.js") {
      app.use('/', require(`./${ctrl}`)(router));
    } else {
      // Everything else is an API route (IE an XHR request or external request) 
      app.use('/api', require(`./${ctrl}`)(router));
    }
  }
};