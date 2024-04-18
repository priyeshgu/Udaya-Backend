// models/userJobMapping.js

const { DataTypes } = require('sequelize');
const db = require('../config/db');
const candidates = require('./candidates');
const jobs = require('./jobs');

const candidates_jobs_mapping = db.define('candidates_jobs_mapping', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('applied', 'shortlisted', 'rejected', 'hired'),
    allowNull: false
  },
  appliedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

candidates_jobs_mapping.belongsTo(candidates, { foreignKey: 'user_id',targetKey: 'user_id' });
candidates_jobs_mapping.belongsTo(jobs, { foreignKey: 'job_id', targetKey: 'job_id' });

module.exports = candidates_jobs_mapping;
