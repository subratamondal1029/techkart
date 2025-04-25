import lazyWrapper from "../utils/lazyWrapper";

const Home = lazyWrapper(() => import("./Home"));
const Seller = lazyWrapper(() => import("./Seller"));
const ProtectedRoute = lazyWrapper(() => import("./ProtectedRoute"));
const Auth = lazyWrapper(() => import("./Auth"));
const Error = lazyWrapper(() => import("./Error"));
const ProductDetail = lazyWrapper(() => import("./ProductDetail"));
const Account = lazyWrapper(() => import("./Account"));
const Orders = lazyWrapper(() => import("./Orders"));
const Search = lazyWrapper(() => import("./Search"));
const Cart = lazyWrapper(() => import("./Cart"));
const Checkout = lazyWrapper(() => import("./Checkout"));
const OrderConfirm = lazyWrapper(() => import("./OrderConfirm"));
const Shipment = lazyWrapper(() => import("./Shipment"));
const Delivery = lazyWrapper(() => import("./Delivery"));

export {
  Home,
  Seller,
  ProtectedRoute,
  Auth,
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
