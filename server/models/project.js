'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    original_file_name: {
      type: DataTypes.STRING
    },
    uploaded_file_name: {
      type: DataTypes.STRING
    },
    file_path: {
      type: DataTypes.STRING
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    owner_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_guid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    collab_code: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'projects'
  });

  // Define all related models and how that model is related (type), and optional opts
  Project.relations = [
    {model: 'Slide', type: 'hasMany', opts: {foreignKey: 'project_id'}}
  ];

  return Project;
};