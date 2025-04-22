import Logo from "./Logo";
import Image from "./Image";
import MainLoader from "./MainLoader";
import Header from "./Header";
import Input from "./formComp/Input";
import Footer from "./Footer";
import ProtectedRoute from "../pages/ProtectedRoute";
import Button from "./Button";
import { lazy } from "react";
import { Suspense } from "react";

const lazyWrapper = (importFunc) => {
  const LazyComponent = lazy(importFunc);
  return (props) => (
    <Suspense fallback={<></>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

const TextArea = lazyWrapper(() => import("./formComp/TextArea"));
const ButtonLoading = lazyWrapper(() => import("./ButtonLoading"));
const ProductCard = lazyWrapper(() => import("./ProductCard"));
const AccountInfoCard = lazyWrapper(() => import("./AccountInfoCard"));
const OrderStatus = lazyWrapper(() => import("./OrderStatus"));
const CartPop = lazyWrapper(() => import("./CartPop"));

export {
  Logo,
  Image,
  MainLoader,
  Header,
  Footer,
  ProtectedRoute,
  Button,
  Input,
  TextArea,
  ButtonLoading,
  ProductCard,
  AccountInfoCard,
  OrderStatus,
  CartPop,
};
