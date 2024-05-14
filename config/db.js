const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('udayadbinstance', 'root', 'dVatPQfgh4yT4o6NksvoXq1Ek2fHyW3w', {
  host: 'dpg-cp1rkjnsc6pc738uknk0-a.singapore-postgres.render.com',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;