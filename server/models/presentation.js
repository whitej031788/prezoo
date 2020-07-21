'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Presentation = sequelize.define('Presentation', {
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'projects',
        // This is the column name of the referenced model
        key: 'id'
      }
    }, 
    // 0 = not started, 1 = in progress, 2 = wrap-up, 3 = ended
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    presentationGuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    collabCode: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'presentations'
  });

  // Define all related models and how that model is related (type), and optional opts
  Presentation.relations = [
    {model: 'Project', type: 'belongsTo', opts: {foreignKey: 'projectId'}},
    {model: 'Attendee', type: 'hasMany', opts: {foreignKey: 'presentationId'}}
  ];

  return Presentation;
};