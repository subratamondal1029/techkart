import { lazy } from "react";
const Home = lazy(() => import("./Home"));
const Seller = lazy(() => import("./Seller"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Login = lazy(() => import("../components/auth/Login"));
const SignUp = lazy(() => import("../components/auth/SignUp"));
const Error = lazy(() => import("./Error"));
const ProductDetail = lazy(() => import("./ProductDetail"));
const Account = lazy(() => import("./Account"));
const Orders = lazy(() => import("./Orders"));
const Search = lazy(() => import("./Search"));
const Cart = lazy(() => import("./Cart"));
const Checkout = lazy(() => import("./Checkout"));
const OrderConfirm = lazy(() => import("./OrderConfirm"));
const Shipment = lazy(() => import("./Shipment"));
const Delivery = lazy(() => import("./Delivery"));

export {
  Home,
  Seller,
  ProtectedRoute,
  Login,
  SignUp,
  Error,
  ProductDetail,
  Account,
  Orders,
  Search,
  Cart,
  Checkout,
  OrderConfirm,
  Shipment,
  Delivery,
};
