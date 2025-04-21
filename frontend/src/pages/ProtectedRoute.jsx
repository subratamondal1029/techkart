import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ProtectedRoute = ({
  authentication = true,
  children,
  isSignUp = true,
  redirect,
}) => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const navigate = useNavigate();
  // TODO: update it for auth pages also
  useEffect(() => {
    if (authentication && isLogin !== authentication) {
      navigate("/login", { state: { isSignUp, redirect } });
    } else if (!authentication && isLogin !== authentication) {
      navigate("/");
    }
  }, [isLogin, authentication]);

  return children;
};

export default ProtectedRoute;
