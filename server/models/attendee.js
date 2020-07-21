'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Attendee = sequelize.define('Attendee', {
    presentationId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'presentations',
        // This is the column name of the referenced model
        key: 'id'
      }
    },
    userIdentifier: {
      type: DataTypes.STRING
    },
    userName: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'attendees'
  });

  // Define all related models and how that model is related (type)
  Attendee.relations = [
    {model: 'Presentation', type: 'belongsTo', opts: {foreignKey: 'presentationId'}}
  ];

  return Attendee;
};