'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    projectGuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    collaboratorCode: {
      type: DataTypes.STRING
    }
  });

  return Project;
};