const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoClient = new MongoClient(
  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
);
let db;

const connectToMongo = async () => {
  try {
    await mongoClient.connect();
    db = mongoClient.db("blogging_platform");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

const getDb = () => db;

module.exports = { connectToMongo, getDb };
