import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import showToast from "../utils/showToast";

const ProtectedRoute = ({ children, redirect = "", role = "user" }) => {
  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  redirect = redirect || pathname;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { isUser: true, redirect } });
    } else {
      const isAuthorized =
        userData.label === "admin" || userData.label === role;

      if (!isAuthorized) {
        showToast("error", "You are not authorized to access this page");
        navigate("/login", {
          state: { isUser: false, redirect, isStayReq: true },
        });
      }
    }
  }, [isLoggedIn, pathname, userData]);

  return children;
};

export default ProtectedRoute;
