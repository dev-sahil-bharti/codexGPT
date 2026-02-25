const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URL_LOCAL;
// const mongoURI = process.env.MONGODB_URL;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to Mongo Successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectToMongo;
