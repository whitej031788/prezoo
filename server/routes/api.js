'use strict';

const projectCtrl = require('../controllers/ProjectCtrl');

module.exports = (router) => {

  router.route('/project/upload')
    .post(projectCtrl().projectUpload);

  router.route('/project/slides/:projectGuid')
    .get(projectCtrl().getProjectAndSlides);

  return router;
};