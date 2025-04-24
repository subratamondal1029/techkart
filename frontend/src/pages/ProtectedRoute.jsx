import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import showToast from "../utils/showToast";
import { MainLoader } from "../components";

const ProtectedRoute = ({ children, redirect = "", role = "user" }) => {
  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  redirect = redirect || pathname;
  const [isSendChild, setIsSendChild] = useState(false);

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
      } else {
        setIsSendChild(true);
      }
    }
  }, [isLoggedIn, pathname, userData]);

  return isSendChild ? (
    children
  ) : (
    <div className="w-full h-screen">
      <MainLoader />
    </div>
  );
};

export default ProtectedRoute;
