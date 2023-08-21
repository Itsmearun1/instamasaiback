const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
const app = express();
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = 3000;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
  const userRoutes = require("./routes/userRoutes");
  const postsRoutes = require("./routes/postRoutes");
  app.use(express.json());
  app.use(cors());
  app.use("/users", userRoutes);
  app.use("/posts", postsRoutes);
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });