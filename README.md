# TechKart Full-Stack E-commerce Platform

TechKart is a full-stack e-commerce platform built with the MERN stack. It includes both backend APIs and a modern React frontend to provide a complete shopping experience.

## 📂 Project Structure

- [Backend (API)](./backend)  
  Node.js + Express backend with RESTful APIs, authentication, product & order management, payment integration, and more.

- [Frontend (Client)](./frontend)  
  React-based frontend with Redux Toolkit, infinite scrolling, optimistic UI updates, QR code scanning, and responsive design.

## 🚀 Getting Started

Please refer to the respective README files inside each folder for detailed information about the project:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

### 📋 Prerequisites for 🚀 Running the Project Locally

Before you start, make sure you have the following installed:

- [NodeJS](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- Make sure port **80** is available, or update the port in [`docker-compose.yml`](./docker-compose.yml)

---

### 🔄 Cloning the Repository

```bash
git clone git@github.com:subratamondal1029/techkart.git
```

---

### ⚙️ Configuring Environment Variables

Use the [`.env.example(frontend)`](./frontend/.env.example) & [`.env.example(backend)`](./backend/.env.example) file as a template to create your own `.env` files:

```yaml
PORT=8000
ORIGIN=http://localhost
NODE_ENV=production
```

---

### 🏁 Starting the Project

```bash
cd techkart
docker compose up -d --build # build and up containers
mongorestore --uri="mongodb://localhost:27017" --db="techkart" ./backup/db/techkart/ # restore mongoDB backup
# 528 document(s) restored successfully. 0 document(s) failed to restore.
```

## 🤝 Collaborators

Special thanks to everyone who contributed to this project.

[![Subrata Mondal](https://avatars.githubusercontent.com/u/164600228?v=4&s=100)](https://github.com/subratamondal1029)  
 **Subrata Mondal**

## 📫 Contribute

Here you will explain how other developers can contribute to your project. For example, explaining how can create their branches, which patterns to follow and how to open an pull request

1. `git clone https://github.com/subratamondal1029/techkart.git`
2. `git checkout -b feature/NAME`
3. Follow commit patterns
4. Open a Pull Request explaining the problem solved or feature made, if exists, append screenshot of visual modifications and wait for the review!
