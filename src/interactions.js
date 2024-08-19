const express = require("express");
const { getDb } = require("./mongo");

const router = express.Router();

// Log a new interaction
router.post("/", async (req, res) => {
  const { user_id, article_id, interaction_type } = req.body;
  try {
    const db = getDb();
    const result = await db.collection("user_interactions").insertOne({
      user_id: parseInt(user_id, 10), // Convert user_id to integer
      article_id: parseInt(article_id, 10), // Convert article_id to integer
      interaction_type,
      timestamp: new Date(),
    });

    if (result.insertedId) {
      res.status(201).json({
        _id: result.insertedId,
        user_id: parseInt(user_id, 10),
        article_id: parseInt(article_id, 10),
        interaction_type,
        timestamp: new Date(),
      });
    } else {
      res.status(500).send("Error logging interaction");
    }
  } catch (err) {
    console.error("Error logging interaction:", err);
    res.status(500).send("Error logging interaction");
  }
});

// Get all interactions for a specific article
router.get("/article/:article_id", async (req, res) => {
  const { article_id } = req.params;
  try {
    const db = getDb();
    const interactions = await db
      .collection("user_interactions")
      .find({ article_id: parseInt(article_id, 10) })
      .toArray(); // Convert article_id to integer
    res.json(interactions);
  } catch (err) {
    console.error("Error fetching interactions:", err);
    res.status(500).send("Error fetching interactions");
  }
});

module.exports = router;
