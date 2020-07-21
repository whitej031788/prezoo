'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Slide = sequelize.define('Slide', {
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'projects',
        // This is the column name of the referenced model
        key: 'id'
      }
    },
    projectAssetId: {
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
    filePath: {
      type: DataTypes.STRING
    },
    fileName: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'slides'
  });

  // Define all related models and how that model is related (type)
  Slide.relations = [
    {model: 'Project', type: 'belongsTo', opts: {foreignKey: 'projectId'}},
    {model: 'ProjectAsset', type: 'belongsTo', opts: {foreignKey: 'projectAssetId'}}
  ];

  return Slide;
};