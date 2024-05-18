const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('udaya', 'postgres', 'abc', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;