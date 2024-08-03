import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./components";
import { useDispatch } from "react-redux";
import appwriteAuth from "./appwrite/authService";
import { useEffect, useState } from "react";
import { login, logout } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    appwriteAuth.getCurrentUser().then((userData) => {
      if (userData) {
        console.log(userData);
        dispatch(login({ userData }));
        if (userData.labels.length !== 0) {
          navigate(`/${userData.labels[0]}`);
        } else navigate("/");
      } else dispatch(logout());
    })
    .catch((err) => console.log(err.message))
  }, []);

  return (
    <>
    {
      isLoading ? "loading..." : (
        <>
        <Header />
        <Outlet />
        </>
      )
    }
    </>
  );
}

export default App;
