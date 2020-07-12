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
    },
    // 0 = not started, 1 = in progress, 2 = wrap-up, 3 = ended
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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