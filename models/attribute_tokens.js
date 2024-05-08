const { DataTypes } = require('sequelize');
const db = require('../config/db');

const attribute_tokens = db.define('attribute_tokens', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    unique_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING, // Name of the attribute (e.g., "skills", "keywords")
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('skills', 'keywords'), // Type of attribute (enum)
      allowNull: false
    },
    tokens: {
      type: DataTypes.ARRAY(DataTypes.STRING), // List of tokens associated with the attribute
      allowNull: false,
      defaultValue: [] // Default value as an empty array
    }
  });
  
  module.exports = attribute_tokens;