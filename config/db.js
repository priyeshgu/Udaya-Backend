const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Udaya', 'postgres', 'abc', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;