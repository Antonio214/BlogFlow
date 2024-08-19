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

// Create a new article
router.post("/", async (req, res) => {
  const { title, content, author_id, tags } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO articles (title, content, author_id, tags) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, author_id, tags]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).send("Error creating article");
  }
});

// Get all articles
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT a.*, u.*
    FROM articles a
    LEFT JOIN users u ON a.author_id = u.id
  `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).send("Error fetching articles");
  }
});

// Get a single article by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT a.*, u.*
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = $1
    `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Article not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).send("Error fetching article");
  }
});

// Update an article by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  try {
    const result = await pool.query(
      "UPDATE articles SET title = $1, content = $2, tags = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [title, content, tags, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Article not found");
    }
    const db = getDb();
    await db.collection("articles_updated").insertOne(result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating article:", err);
    res.status(500).send("Error updating article");
  }
});

// Delete an article by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Article not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).send("Error deleting article");
  }
});

module.exports = router;
