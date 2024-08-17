# Tech kart
## E-Commerce Website

### About Me
I am Subrata Mondal, a front-end web developer with knowledge of HTML, CSS, and JavaScript, specializing in frameworks like React and Tailwind. I created an e-commerce website using these skills, with React and Tailwind for the frontend and Appwrite for the backend.

## Description
This single-page application (SPA) includes multiple pages:
- **Home Page**: Displays products for users to browse.
- **Product Detail Page**: Shows detailed information about a product.
- **Login/Signup**: Users can sign in, sign up, or use Google login.
- **Cart**: Users can add products to the cart, view a cart preview, and adjust quantities or remove items.
- **Checkout Page**: Users fill in their contact information, and the address is auto-filled based on the postal code using the Indian Postal API. Razorpay is integrated for payment processing.
- **Order Confirmation and Details**: After checkout, users are redirected to an order details page to see the order status and cancel orders if needed.
- **Account Page**: Users can view their order history and personal information.
- **Product Search**: Users can search for products by typing keywords or by category.

Additional features include:
- **Shipment Master Dashboard**: 
  - Manage orders and update their status to "shipped".
  - Generate and download invoices with QR codes.
  - Store shipment invoices in Appwrite storage.
- **Delivery Boy Dashboard**:
  - Confirm deliveries by scanning QR codes.
  - Generate and store delivery invoices in Appwrite storage.
  - Allow users to download delivery invoices from the order details page once the order is delivered.
- **Seller Page**: Allows sellers to add products to the list, including images.

## Test Users
- **User**: `subrata@techkart.com` | Password: `subratalog`
- **Shipment Master**: `shipment@techkart.com` | Password: `shipmentlog`
- **Delivery Boy**: `delivery@techkart.com` | Password: `deliverylog`

## Features

### User Features
- **User Registration and Login**: Users can sign up, sign in, and use Google login.
- **Home Page**: Displays a list of products for users to browse.
- **Product Detail Page**: Shows detailed information about each product.
- **Shopping Cart**: Users can add products to their cart, view a cart preview, and adjust quantities or remove items.
- **Checkout**: Users can fill in their contact information, and the address is auto-filled based on the postal code using the Indian Postal API. Razorpay is integrated for payment processing.
- **Order Confirmation and Details**: After checkout, users are redirected to an order details page to see the order status and cancel orders if needed.
- **Account Page**: Users can view their order history and personal information.
- **Product Search**: Users can search for products by typing keywords or by category.

### Additional Features
- **Shipment Master Dashboard**: 
  - Manage orders and update their status to "shipped".
  - Generate and download invoices with QR codes.
  - Store shipment invoices in Appwrite storage.
- **Delivery Boy Dashboard**:
  - Confirm deliveries by scanning QR codes.
  - Generate and store delivery invoices in Appwrite storage.
  - Allow users to download delivery invoices from the order details page once the order is delivered.
- **Seller Page**: Allows sellers to add products to the list, including images.

## Technologies Used

### Frontend
- **React**: ^18.3.1
- **Tailwind CSS**: ^3.4.7
- **Redux Toolkit**: @reduxjs/toolkit ^2.2.7
- **Appwrite**: ^15.0.0
- **HTML5 QR Code**: ^2.3.8
- **jsPDF**: ^2.5.1
- **jsPDF AutoTable**: ^3.8.2
- **Lucide React**: ^0.424.0
- **QRCode**: ^1.5.4
- **React Hook Form**: ^7.52.1
- **React Redux**: ^9.1.2
- **React Router DOM**: ^6.26.0
- **React Toastify**: ^10.0.5

### Backend
- **Appwrite**: Used for database, storage, authentication, and cloud functions for Razorpay payment integration with JavaScript.

## Usage
This is a web application. Simply land on the webpage and start using it. For additional features, users need to log in.

## Testing
For testing and debugging, the following tools are used:
- **Postman**: For testing API endpoints.
- **Appwrite Function Logs**: For monitoring and debugging Appwrite cloud functions with Razorpay integration.
- **Browser Dev Tools**: For testing and debugging in the browser.
- **Redux DevTools Extension**: For debugging Redux state management.
- **ChatGPT and Google**: For additional troubleshooting and debugging assistance.

## License
This project is a personal project by Subrata Mondal and is not formally licensed.

## Contact Information
For any questions or issues, you can reach out to Subrata Mondal through the following channels:
- **Phone**: +91 9832674420
- **Email**: [subratamondal1020@outlook.com](mailto:subratamondal1020@outlook.com)
- **Portfolio Website**: [subratamondal](https://subratamondal.vercel.app)
- **GitHub Issues**: Users can raise issues on the GitHub repository.
