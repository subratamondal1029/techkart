import lazyWrapper from "../utils/lazyWrapper";

const Home = lazyWrapper(() => import("./Home"));
const Seller = lazyWrapper(() => import("./Seller"));
const ProductEdit = lazyWrapper(() => import("./ProductEdit"));
const ProtectedRoute = lazyWrapper(() => import("./ProtectedRoute"));
const Auth = lazyWrapper(() => import("./Auth"));
const Error = lazyWrapper(() => import("./Error"));
const Product = lazyWrapper(() => import("./Product"));
const Account = lazyWrapper(() => import("./Account"));
const Order = lazyWrapper(() => import("./Order"));
const Search = lazyWrapper(() => import("./Search"));
const Cart = lazyWrapper(() => import("./Cart"));
const Checkout = lazyWrapper(() => import("./Checkout"));
const OrderConfirm = lazyWrapper(() => import("./OrderConfirm"));
const Shipment = lazyWrapper(() => import("./Shipment"));
const Delivery = lazyWrapper(() => import("./Delivery"));
const Contact = lazyWrapper(() => import("./Contact"));

export {
  Home,
  Seller,
  ProductEdit,
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
  Contact,
};
