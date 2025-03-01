import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Home, Seller, ProtectedRoute, Login, Error, SignUp, ProductDetail, Account, Orders, Search, Cart, Checkout, OrderConfirm, Shipment, Delivery } from "./pages";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} >
      <Route path="*" element={<Error />} />
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="/search/:searchValue" element={<Search />} />
      <Route path="placed" element={<OrderConfirm />} />
      <Route path="cart" element={<ProtectedRoute authontication isSignUp={true} redirect="cart"><Cart /></ProtectedRoute>} />
      <Route path="checkout" element={<ProtectedRoute authontication isSignUp={true} redirect="cart"><Checkout /></ProtectedRoute>} />
     <Route path="product/:productId" element={<ProductDetail />} />
     <Route path="account" element={<ProtectedRoute authontication redirect="account"><Account /></ProtectedRoute>} />
     <Route path="orders/:orderId" element={<ProtectedRoute authontication redirect="account"><Orders /></ProtectedRoute>} />
      <Route path="seller" element={<ProtectedRoute authontication isSignUp={false} redirect="seller"><Seller /></ProtectedRoute>}/>
      <Route path="shipment" element={<ProtectedRoute authontication isSignUp={false} redirect="shipment"><Shipment /></ProtectedRoute>}/>
      <Route path="delivery" element={<ProtectedRoute authontication isSignUp={false} redirect="delivery"><Delivery /></ProtectedRoute>}/>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        bodyClassName="toastBody"
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
      />
    </React.StrictMode>
  </Provider>
);
