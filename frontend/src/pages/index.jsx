import { lazy, Suspense } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { MainLoader } from "../components";

NProgress.configure({ showSpinner: false, minimum: 0.3, trickleSpeed: 200 });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lazyWrapper = (importFunc) => {
  const LazyComponent = lazy(async () => {
    NProgress.start();
    // await delay(2000);
    try {
      return await importFunc();
    } finally {
      NProgress.done();
    }
  });

  return (props) => (
    <Suspense fallback={<MainLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

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
