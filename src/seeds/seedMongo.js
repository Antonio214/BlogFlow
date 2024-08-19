const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoClient = new MongoClient(
  `mongodb://${process.env.MONGO_HOST_SEED}:${process.env.MONGO_PORT}`
);

const generateRandomString = (length) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

const seedInteractions = async (db, count, userCount, articleCount) => {
  const interactions = [];
  const types = ["view", "like", "share"];

  for (let i = 0; i < count; i++) {
    const interaction = {
      user_id: Math.floor(Math.random() * userCount) + 1,
      article_id: Math.floor(Math.random() * articleCount) + 1,
      interaction_type: types[Math.floor(Math.random() * types.length)],
      timestamp: new Date(),
    };

    interactions.push(interaction);
  }

  await db.collection("user_interactions").insertMany(interactions);
  console.log(`Inserted ${count} user interactions into MongoDB.`);
};

const seedMongo = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("blogging_platform");

    const interactionCount = 50000; // Number of interactions to seed
    const userCount = 1000; // Number of users (same as in PostgreSQL)
    const articleCount = 10000; // Number of articles (same as in PostgreSQL)

    await seedInteractions(db, interactionCount, userCount, articleCount);
  } catch (err) {
    console.error("Error seeding MongoDB:", err);
  } finally {
    await mongoClient.close();
  }
};

seedMongo();
