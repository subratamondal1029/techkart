import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { Footer, Header, MainLoader } from "./components";
import { useDispatch } from "react-redux";
import appwriteAuth from "./appwrite/authService";
import { useEffect, useState } from "react";
import { login, logout } from "./store/authSlice";
import appWriteDb from "./appwrite/DbServise";
import { storeProducts } from "./store/productSlice";
import appWriteStorage from "./appwrite/storageService";
import { Query } from "appwrite";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const currentLocation = window.location.pathname;
  window.scrollTo(0, 0);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const products = await appWriteDb.getProducts();
        if (products) {
          const getWithImage = products.map((product) => ({
            ...product,
            image: appWriteStorage.getImage(product.image).href,
          }));

          dispatch(storeProducts(getWithImage));
        }

        const userData = await appwriteAuth.getCurrentUser();
        if (userData) {
          const cart = await appWriteDb.getCart(userData.$id);
          const orders = await appWriteDb.getOrders([Query.equal("userId", userData.$id)]);

          if (cart || orders.length !== 0) {
            dispatch(
              login({ userData, isCartCreated: true, otherData: { cart: cart || [], orders: orders || []} })
            );
          } else dispatch(login({ userData }));
          if (currentLocation !== "/login" || currentLocation !== "/signup") {
            navigate(currentLocation);
          } else navigate("/");
        } else dispatch(logout());
        setIsLoading(false);
      } catch (err) {
        console.warn(err.message);
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      {isLoading ? (
        <MainLoader />
      ) : (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
