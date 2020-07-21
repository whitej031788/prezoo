'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    projectName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ownerEmail: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'projects'
  });

  // Define all related models and how that model is related (type), and optional opts
  Project.relations = [
    {model: 'Slide', type: 'hasMany', opts: {foreignKey: 'projectId'}},
    {model: 'ProjectAsset', type: 'hasMany', opts: {foreignKey: 'projectId'}},
    {model: 'Presentation', type: 'hasMany', opts: {foreignKey: 'projectId'}}
  ];

  return Project;
};