'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Slide = sequelize.define('Slide', {
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'projects',
        // This is the column name of the referenced model
        key: 'id'
      }
    }, 
    order: {
      type: DataTypes.INTEGER
    },
    file_path: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'slides'
  });

  // Define all related models and how that model is related (type)
  Slide.relations = [
    {model: 'Project', type: 'belongsTo'}
  ];

  return Slide;
};