import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/auth.slice";
import { storeCart } from "./store/cart.slice";
import { MainLoader, Header, Footer } from "./components";
import { useLoading } from "./hooks";
import authService from "./services/auth.service";
import cartService from "./services/cart.service";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { state } = useLocation();
  window.scrollTo(0, 0);

  const fetchUser = async () => {
    let userData;
    try {
      const { data } = await authService.getCurrentUser();
      userData = data;
    } catch (error) {
      if (error.status !== 401) {
        console.error(error);
        return;
      }

      try {
        await authService.refreshToken();
        const { data } = await authService.getCurrentUser();
        userData = data;
      } catch (error) {
        console.error(error);
      }
    }

    return userData;
  };

  const fetchCart = async () => {
    try {
      const { data } = await cartService.get();
      dispatch(storeCart(data));
    } catch (error) {
      console.error(error);
    }
  };

  const [fetchAllData, isLoading] = useLoading(async () => {
    console.log("Fetching data");
    const userData = await fetchUser();
    if (userData) {
      dispatch(login(userData));
      if (userData.label === "user") {
        fetchCart();
      }
    } else {
      dispatch(logout());
    }
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (state?.fetchData) {
      fetchAllData();
    }
  }, [state?.fetchData]);

  return (
    <>
      {isLoading ? (
        <MainLoader />
      ) : (
        <>
          <Header />
          <Suspense fallback={<MainLoader />}>
            <Outlet />
          </Suspense>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
