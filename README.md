# BlogFlow
BlogFlow is a blog application that needs to be optimized. It is a starting point for a optimization study project i'm doing.

## Features

- **User Management**: Create and manage user accounts with profiles and credentials stored in PostgreSQL.
- **Article Management**: Write, publish, and edit articles with rich content, tags, and comments.
- **Real-Time Analytics**: Track user interactions like views, likes, and shares in real-time using MongoDB.
- **Version Control**: Keep track of multiple versions of articles and revert to previous versions as needed.
- **Performance Monitoring**: Identify and optimize performance bottlenecks using OpenTelemetry and Jaeger.

## Technologies

- **Backend**: Node.js with Express
- **Databases**: PostgreSQL and MongoDB
- **Monitoring**: OpenTelemetry and Jaeger
- **Containerization**: Docker and Docker Compose

## Project Structure

```plaintext
blogging-platform/
│
├── src/
│   ├── config/          # Database configuration files
│   ├── controllers/     # Business logic and controllers
│   ├── models/          # Database models for PostgreSQL and MongoDB
│   ├── routes/          # API routes
│   └── app.js           # Main application file
│
├── .env                 # Environment variables (not committed to Git)
├── .gitignore           # Files and directories to ignore in Git
├── Dockerfile           # Dockerfile for containerizing the application
├── docker-compose.yml   # Docker Compose file to manage multi-container deployment
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
