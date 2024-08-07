import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { Footer, Header, MainLoader } from "./components";
import { useDispatch } from "react-redux";
import appwriteAuth from "./appwrite/authService";
import { useEffect, useState } from "react";
import { login, logout } from "./store/authSlice";
import appWriteDb from "./appwrite/DbServise";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const currentLocation = window.location.pathname;

  useEffect(() => {

    async function fetchUser() {
      setIsLoading(true);
      try {
        const userData = await appwriteAuth.getCurrentUser();
        if (userData) {
          const cart = await appWriteDb.getCart(userData.$id);
          if (cart) {
            dispatch(login({ userData, otherData: { cart } }));
          }else dispatch(login({ userData }));
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

    fetchUser()
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
