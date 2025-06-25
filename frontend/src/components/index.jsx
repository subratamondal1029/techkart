import Logo from "./Logo";
import Image from "./Image";
import MainLoader from "./MainLoader";
import Header from "./Header";
import Input from "./formComp/Input";
import Footer from "./Footer";
import ProtectedRoute from "../pages/ProtectedRoute";
import Button from "./Button";
import UpdateForm from "./UpdateForm";
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
const ProductNotFound = lazyWrapper(() => import("./ProductNotFound"));
const OrderStatus = lazyWrapper(() => import("./OrderStatus"));
const CartPop = lazyWrapper(() => import("./CartPop"));
const LoadingError = lazyWrapper(() => import("./LoadingError"));
const Back = lazyWrapper(() => import("./Back"));
const Maintenance = lazyWrapper(() => import("./Maintenance"));
const ImageUpload = lazyWrapper(() => import("./ImageUpload"));
const DataList = lazyWrapper(() => import("./DataList"));
const TagInput = lazyWrapper(() => import("./formComp/TagInput"));
const Pagination = lazyWrapper(() => import("./Pagination"));
const PasswordAndConfirm = lazyWrapper(() =>
  import("./formComp/PasswordAndConfirm")
);

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
  ProductNotFound,
  OrderStatus,
  CartPop,
  LoadingError,
  Back,
  Maintenance,
  UpdateForm,
  ImageUpload,
  DataList,
  TagInput,
  Pagination,
  PasswordAndConfirm,
};
