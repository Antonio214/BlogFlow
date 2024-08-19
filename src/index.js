const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const interactionsRouter = require("./interactions");
const { connectToMongo } = require("./mongo");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
app.use("/interactions", interactionsRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Blogging Platform API!");
});

connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
