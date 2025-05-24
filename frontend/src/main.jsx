import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  Home,
  Seller,
  ProtectedRoute,
  Auth,
  Error,
  Product,
  Account,
  Order,
  Search,
  Cart,
  Checkout,
  OrderConfirm,
  Shipment,
  Delivery,
  ProductEdit,
  Contact,
} from "./pages";
import Test from "./components/Test.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route path="test" element={<Test />} />
      <Route path="" element={<Home />} />
      <Route path="login" element={<Auth isSignupPage={false} />} />
      <Route path="signup" element={<Auth isSignupPage={true} />} />
      <Route path="/search" element={<Search />} />
      <Route path="placed" element={<OrderConfirm />} />
      <Route path="contact" element={<Contact />} />
      <Route
        path="cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route path="product/:id" element={<Product />} />
      <Route
        path="account/:page?"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="orders/:id"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="seller"
        element={
          <ProtectedRoute role="seller">
            <Seller />
          </ProtectedRoute>
        }
      />
      <Route
        path="product/edit/:id?"
        element={
          <ProtectedRoute role="seller">
            <ProductEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="shipment"
        element={
          <ProtectedRoute role="shipment">
            <Shipment />
          </ProtectedRoute>
        }
      />
      <Route
        path="delivery"
        element={
          <ProtectedRoute role="delivery">
            <Delivery />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeButton={false}
        closeOnClick={true}
        hideProgressBar={false}
        newestOnTop
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
        bodyClassName="toastBody"
        toastClassName="!min-h-10 !h-auto !p-2 text-sm rounded-md shadow-md flex items-center overflow-visible break-words "
      />
    </React.StrictMode>
  </Provider>
);
