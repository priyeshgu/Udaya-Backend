// models/job.js

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const jobs = db.define('jobs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  job_description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  openings: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salary_offered: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  post: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  remote: {
    type: DataTypes.ENUM('remote', 'hybrid', 'onsite'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'draft'),
    allowNull: false,
    defaultValue: 'draft'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  keywords: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  }
});

module.exports = jobs;

