import { lazy } from "react";
import { Suspense } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { LoaderCircleIcon } from "lucide-react";

NProgress.configure({ showSpinner: false, minimum: 0.3, trickleSpeed: 200 });

const lazyWrapper = (importFunc) => {
  const LazyComponent = lazy(() => {
    NProgress.start();
    return importFunc().finally(() => {
      NProgress.done();
    });
  });

  return (props) => (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex justify-center items-center">
          <LoaderCircleIcon className="animate-spin" size={50} />
        </div>
      }
    >
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
