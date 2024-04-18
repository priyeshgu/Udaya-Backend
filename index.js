const express = require('express');
const sequelize = require('./config/db');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Sync the models with the database
(async () => {
  try {
    await sequelize.sync({alter: true}); // Set force: true to drop and recreate the tables on each run
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();
app.use(express.json());
app.use('/applications', applicationRoutes);
app.use('/admin', adminRoutes);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
