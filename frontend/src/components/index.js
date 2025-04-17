import { lazy } from "react";

const Input = lazy(() => import("./formComp/Input"));
const TextArea = lazy(() => import("./formComp/TextArea"));
const Button = lazy(() => import("./Button"));
const ButtonLoading = lazy(() => import("./ButtonLoading"));
const ProtectedRoute = lazy(() => import("../pages/ProtectedRoute"));
const Header = lazy(() => import("./Header"));
const Footer = lazy(() => import("./Footer"));
const Logo = lazy(() => import("./Logo"));
const ProductCard = lazy(() => import("./ProductCard"));
const MainLoader = lazy(() => import("./MainLoader"));
const AccountInfoCard = lazy(() => import("./AccountInfoCard"));
const OrderStatus = lazy(() => import("./OrderStatus"));
const CartPop = lazy(() => import("./CartPop"));
const AccessDenied = lazy(() => import("./AccessDenied"));

export {
  Input,
  TextArea,
  Button,
  ButtonLoading,
  Header,
  Footer,
  ProtectedRoute,
  Logo,
  ProductCard,
  MainLoader,
  AccountInfoCard,
  OrderStatus,
  CartPop,
  AccessDenied,
};
