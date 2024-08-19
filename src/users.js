const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const router = express.Router();
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

// Create a new user
router.post("/", async (req, res) => {
  const { username, email, password, profile } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password, profile) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, profile]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
});

// Helper function to get articles for a specific user
const getArticlesForUser = async (userId) => {
  const result = await pool.query(
    "SELECT id, title, content, tags, published_at FROM articles WHERE author_id = $1",
    [userId]
  );
  return result.rows;
};

// Get all users
router.get("/", async (req, res) => {
  try {
    const usersResult = await pool.query("SELECT * FROM users");
    const users = usersResult.rows;

    // For each user, fetch their articles in a separate query
    for (let user of users) {
      user.articles = await getArticlesForUser(user.id);
    }

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Error fetching user");
  }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password, profile } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, password = $3, profile = $4 WHERE id = $5 RETURNING *",
      [username, email, password, profile, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Error updating user");
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Error deleting user");
  }
});

module.exports = router;
