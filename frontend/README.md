<h1 align="center" style="font-weight: bold;">Techkart <span style="font-size: 12px;">(frontend)</span> 💻</h1>

<p align="center">
 <a href="#features">Features</a> • 
 <a href="#plans">Upcoming</a> • 
 <a href="#tech">Technologies</a> • 
 <a href="#started">Getting Started</a> • 
 <a href="#colab">Collaborators</a> •
 <a href="#contribute">Contribute</a>
</p>

<p align="center">
    <b>TechKart (frontend) is the client-side web application built using the MERN stack. It provides user authentication (email/password and Google OAuth), product and order management, to shipment tracking and payment processing.</b>
</p>

<h2 id="features"> 🚀 Features</h2>

### 🔐 Authentication & Authorization

- User login and registration with **email/password** and **Google OAuth**
- Role-based UI access and navigation (admin, seller, delivery boy, shipment master)
- Secure token handling and session management

### 🛍️ Product & Order Management

- Smooth **CRUD operations** on products with **optimistic UI updates** for faster feedback
- Infinite scrolling to efficiently fetch and display large lists of products and orders
- Real-time order tracking and status updates for all user roles
- QR code scanning support for shipment and delivery verification

### 💸 Payments

- Integration with Razorpay for seamless payment processing

### 🖥️ User Experience & Tools

- Responsive and modern UI built with **React** and **Tailwind CSS**
- State management using **Redux Toolkit** for scalable and maintainable app state
- Form handling and validation with **react-hook-form**
- Notifications with **react-toastify** for instant user feedback
- Progress indicators with **nprogress** for smooth loading experiences
- Protection of forms using **Google reCAPTCHA**

<h2 id="plans"> 🧪 Features in Development </h2>

- [ ] Admin Panel
- [ ] Delivery Dashboard
- [ ] Product page video support

<h2 id="tech">💻 Technologies</h2>

This project uses a variety of modern tools and libraries to build a robust and efficient frontend application:

## 💻 Technologies

1. React
2. Redux Toolkit
3. Axios
4. React Router DOM
5. React Hook Form
6. React Google reCAPTCHA
7. React Toastify
8. html5-qrcode
9. NProgress
10. Tailwind CSS
11. Vite
12. Lucide React (icons)

<h2 id="started">🚀 Getting started</h2>

### 📋 Prerequisites for 🚀 Running the Project Locally

Before you start, make sure you have the following installed:

- [NodeJS](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- Make sure port **80** is available, or update the port in [`docker-compose.yml`](../docker-compose.yml)

---

### 🔄 Cloning the Repository

```bash
git clone git@github.com:subratamondal1029/techkart.git
```

---

### ⚙️ Configuring Environment Variables

Use the [`.env.example`](./.env.example) file as a template to create your own `.env` file:

```yaml
VITE_RAZORPAY_KEY=rzp_test_abcdefGHIJ
VITE_BACKEND_BASE_URL=http://localhost:8000/api/v1
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

Open [http://localhost](http://localhost) in your browser

---

This frontend is fully integrated with the [TechKart backend](../backend/README.md)

---

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
