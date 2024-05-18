const express = require("express");
const sequelize = require("./config/db");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
const app = express();

// Sync the models with the database
(async () => {
  try {
    await sequelize.sync(); // Set force: true to drop and recreate the tables on each run
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
const corsOptions = {
  origin: ["http://localhost:3000","https://udayasoln.netlify.app"]
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
// app.use(cors());
app.use("/applications", applicationRoutes);
app.use("/admin", adminRoutes);

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
