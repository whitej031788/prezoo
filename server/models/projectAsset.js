'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ProjectAsset = sequelize.define('ProjectAsset', {
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'projects',
        // This is the column name of the referenced model
        key: 'id'
      }
    },
    originalFileName: {
      type: DataTypes.STRING
    },
    uploadedFileName: {
      type: DataTypes.STRING
    },
    filePath: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'projectAssets'
  });

  // Define all related models and how that model is related (type), and optional opts
  ProjectAsset.relations = [
    {model: 'Project', type: 'belongsTo', opts: {foreignKey: 'projectId'}},
    {model: 'Slide', type: 'hasMany', opts: {foreignKey: 'projectAssetId'}},
  ];

  return ProjectAsset;
};