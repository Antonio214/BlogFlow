const express = require("express");
const { getDb } = require("./mongo");

const router = express.Router();

// Log a new interaction
router.post("/", async (req, res) => {
  const { user_id, article_id, interaction_type } = req.body;
  try {
    const db = getDb();

    const payload = {
      user_id: parseInt(user_id, 10), // Convert user_id to integer
      article_id: parseInt(article_id, 10), // Convert article_id to integer
      interaction_type,
      timestamp: new Date(),
    };

    // random chance of introducing an very_large_unecessary_field (10%)
    if (Math.random() < 0.1) {
      payload.very_large_unecessary_field = "x".repeat(1000000);
    }

    const result = await db.collection("user_interactions").insertOne(payload);

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

// Inefficient query to get all interactions by type (full collection scan)
router.get("/type/:interaction_type", async (req, res) => {
  const { interaction_type } = req.params;
  try {
    const db = getDb();
    const interactions = await db
      .collection("user_interactions")
      .find({ interaction_type })
      .toArray();
    res.json(interactions);
  } catch (err) {
    console.error("Error fetching interactions by type:", err);
    res.status(500).send("Error fetching interactions");
  }
});

module.exports = router;
