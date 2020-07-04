'use strict';

const projectCtrl = require('../controllers/ProjectCtrl');

module.exports = (router) => {

  router.route('/project/upload')
    .post(projectCtrl().projectUpload);

  return router;
};