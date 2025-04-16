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
import { Suspense } from "react";

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
        // TODO: fetch product in home page on go to product section
        const products = await appWriteDb.getProducts();
        if (products) {
          const getWithImage = products.map((product) => ({
            ...product,
            // TODO: update image url from central function
            image: appWriteStorage.getImage(product.image).href,
          }));

          dispatch(storeProducts(getWithImage));
        }

        const userData = await appwriteAuth.getCurrentUser();
        if (userData) {
          // TODO: just fetch the cart and store in cart slice
          const cart = await appWriteDb.getCart(userData.$id);
          const orders = await appWriteDb.getOrders([
            Query.equal("userId", userData.$id),
          ]);

          if (cart || orders.length !== 0) {
            dispatch(
              login({
                userData,
                isCartCreated: true,
                otherData: { cart: cart || [], orders: orders || [] },
              })
            );
          } else dispatch(login({ userData }));
          // TODO: don't redirect on user found handle but something else
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

    // TODO: wrap in leader hook
    fetchUser();
  }, []); //TODO: run if the isLogin chnage in store

  return (
    <>
      {isLoading ? (
        <MainLoader />
      ) : (
        <>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
