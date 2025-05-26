<h1 align="center" style="font-weight: bold;">Techkart <span style="font-size: 12px;">(backend)</span> 🛠️</h1>

<p align="center">
 <a href="#features">Features</a> • 
 <a href="#plans">Upcoming</a> • 
 <a href="#tech">Technologies</a> • 
 <a href="#started">Getting Started</a> • 
  <a href="#routes">API Endpoints</a> •
 <a href="#colab">Collaborators</a> •
 <a href="#contribute">Contribute</a>
</p>

<p align="center">
    <b>TechKart (Backend) is the server-side backend of a scalable e-commerce platform built using the MERN stack. It provides RESTful APIs to handle everything from user authentication (email/password and Google OAuth), product and order management, to shipment tracking and payment processing.

The backend is designed with performance and security in mind — including features like refresh token handling, Redis-based secure token management, automated cleanup jobs, role-based access control, and more. It also includes integration with Razorpay for payments and Nodemailer for sending email notifications to users and developers.</b>

</p>

<h2 id="features"> 🚀 Features</h2>

### 🔐 Authentication & Authorization

- Login and register using email/password or Google OAuth
- Secure access using JWT with refresh token support
- Role-based access control (admin, seller, shipment master, delivery boy)
- Forgot password flow with unique secure token via Redis

### 🛍️ Product & Order Management

- Product CRUD for sellers
- Orders creation, tracking, and updates
- Shipment dashboard for managing orders (shipment master access)
- Delivery boys can update order status
- Pagination for large data lists (products, orders)
- Invoice generation for users and shipment packages

### 💸 Payments & Refunds

- Razorpay payment gateway integration
- Refund support after order cancellation
- Payment status tracking and updates

### ✉️ Email & Notifications

- Email alerts to users for order confirmation, status updates, and refunds
- Developer notifications for failed tasks and system reports

### ⚙️ System Utilities

- Daily auto-cleanup for failed files
- File cache system for faster file response
- Rate limiter to prevent spam and brute-force attacks
- Logs all API requests for future reporting

<h2 id="plans"> 🧪 Features in Development </h2>

- [ ] Admin monthly report (auto-send on 1st day)
- [ ] Email verification for new users
- [ ] Shipment management optimization (fetch nearest shipments)
- [ ] Delivery optimization (show nearby products for delivery boys)
- [ ] Product video support

<h2 id="tech">💻 Technologies</h2>

This project uses a variety of modern tools and libraries to build a scalable and secure backend:

### 🗄️ Backend & Server

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for routing and middleware
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **Redis** – In-memory data store (used for caching and secure tokens)

### 🔐 Authentication & Security

- **JWT** – Token-based authentication
- **Passport.js** – Authentication middleware
- **Passport Google OAuth2** – Google login integration
- **bcrypt** – Password hashing
- **cookie-parser** – Parse cookies
- **express-rate-limit** – Rate limiter to prevent abuse

### 📦 File & Media Handling

- **Multer** – File upload middleware
- **Cloudinary** – Cloud storage for images and videos

### 📧 Email & Scheduling

- **Nodemailer** – Sending emails
- **node-cron** – Scheduling automated tasks (e.g., daily cleanup, reports)

### 💳 Payments

- **Razorpay** – Payment gateway integration

### 📄 Documents & APIs

- **pdfmake** – Dynamic PDF invoice generation
- **Swagger UI Express** – Interactive API documentation

### 🌐 Others

- **axios** – Promise-based HTTP client
- **dotenv** – Load environment variables
- **CORS** – Cross-origin resource sharing

<h2 id="started">🚀 Getting started</h2>

### 📋 Prerequisites for 🚀 Running the Project Locally

Before you start, make sure you have the following installed:

- [NodeJS](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- Make sure port **8000** is available, or update the port in [`docker-compose.yml`](../docker-compose.yml)

---

### 🔄 Cloning the Repository

```bash
git clone git@github.com:subratamondal1029/techkart.git
```

---

### ⚙️ Configuring Environment Variables

Use the [`.env.example`](./.env.example) file as a template to create your own `.env` file:

```yaml
PORT=8000
ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

### 🏁 Starting the Project

```bash
cd techkart
docker cp ./backend/mongodb_data/ techkart-mongo:./backup
# will see "Successfully copied 28.2kB to techkart-mongo:./backup"
docker exec -it techkart-mongo bash # enter in the container shell
mongorestore --uri="mongodb://localhost:27017" --db="techkart" ./backup/techkart/
# will see "47 document(s) restored successfully."
rm -rf ./backup/* #optional

exit
docker compose build
docker compose up
```

<h2 id="routes">📍 API Endpoints</h2>

All available API endpoints are documented in:

- [`swagger.json`](./test/swagger.json)
- Or view them in your browser after starting the server: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)  
  (OpenAPI UI interface)

<h2 id="colab">🤝 Collaborators</h2>

Special thanks to everyone who contributed to this project.

[![Subrata Mondal](https://avatars.githubusercontent.com/u/164600228?v=4&s=100)](https://github.com/subratamondal1029)  
 **Subrata Mondal**

<h2 id="contribute">📫 Contribute</h2>

Here you will explain how other developers can contribute to your project. For example, explaining how can create their branches, which patterns to follow and how to open an pull request

1. `git clone https://github.com/subratamondal1029/techkart.git`
2. `git checkout -b feature/NAME`
3. Follow commit patterns
4. Open a Pull Request explaining the problem solved or feature made, if exists, append screenshot of visual modifications and wait for the review!
