'use strict';

module.exports = (router) => {

  // This is just to test if the server is running
  router.route('/').get((req, res) => {
    res.send('Server is up and running for Prezoo API requests')
  });

  return router;
};