// models/user.js

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const candidates = db.define('candidates', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  current_salary: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expected_salary: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  current_position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  current_company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: false
  }

});

module.exports = candidates;
