const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST_SEED,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const generateRandomString = (length) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

const seedUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const username = `user_${generateRandomString(100)}`;
    const email = `${username}@example.com`;
    const password = generateRandomString(10);
    const profile = `This is the profile of ${username}.`;

    users.push(
      pool.query(
        "INSERT INTO users (username, email, password, profile) VALUES ($1, $2, $3, $4)",
        [username, email, password, profile]
      )
    );
  }
  await Promise.all(users);
  console.log(`Inserted ${count} users into PostgreSQL.`);
};

const seedArticles = async (count, userCount) => {
  const articles = [];
  for (let i = 0; i < count; i++) {
    const title = `Article ${generateRandomString(10)}`;
    const content = `This is the content of article ${i}. ${generateRandomString(
      50
    )}`;
    const author_id = Math.floor(Math.random() * userCount) + 1;
    const tags = `tag${Math.floor(Math.random() * 10)},tag${Math.floor(
      Math.random() * 10
    )}`;

    articles.push(
      pool.query(
        "INSERT INTO articles (title, content, author_id, tags) VALUES ($1, $2, $3, $4)",
        [title, content, author_id, tags]
      )
    );
  }
  await Promise.all(articles);
  console.log(`Inserted ${count} articles into PostgreSQL.`);
};

const seedPostgres = async () => {
  try {
    const userCount = 1000; // Number of users to seed
    const articleCount = 10000; // Number of articles to seed

    await seedUsers(userCount);
    await seedArticles(articleCount, userCount);
  } catch (err) {
    console.error("Error seeding PostgreSQL:", err);
  } finally {
    pool.end();
  }
};

seedPostgres();
