'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    originalFileName: {
      type: DataTypes.STRING
    },
    uploadedFileName: {
      type: DataTypes.STRING
    },
    filePath: {
      type: DataTypes.STRING
    },
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
    },
    projectGuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    collabCode: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'projects'
  });

  // Define all related models and how that model is related (type), and optional opts
  Project.relations = [
    {model: 'Slide', type: 'hasMany', opts: {foreignKey: 'projectId'}}
  ];

  return Project;
};