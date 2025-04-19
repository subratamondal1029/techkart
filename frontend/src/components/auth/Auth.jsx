import React, { useState } from "react";
import { ArrowRight, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button, ButtonLoading, Input, Logo } from "../index";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { useSelector } from "react-redux";
import { login } from "../../store/auth.slice";
import { toast } from "react-toastify";
import { useLoading } from "../../hooks";
import { useEffect } from "react";

const Auth = ({ isSignupPage = false }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { state, pathname, search } = useLocation();
  const [isPassword, setIspassword] = useState(true);
  const [error, setError] = useState("");

  const methods = useForm();

  const handleGoogleLogin = async () => {
    const successPath = `${state?.redirect || ""}`;
    const failsPath = pathname.replace("/", "");

    authService.loginWithGogle(successPath, failsPath);
  };

  const [handleLogin, isLoading] = useLoading(async (data) => {
    setError("");
    const toastId = toast.loading("Logging in...");
    try {
      await authService.emailPassLogin({
        email: data.email,
        password: data.password,
      });
      toast.update(toastId, {
        render: "Login successful",
        type: "success",
        autoClose: 3000,
        isLoading: false,
      });

      // TODO: send state to fetch data in root
      if (state?.redirect) {
        navigate(`/${state.redirect}`);
      } else navigate("/");
    } catch (error) {
      toast.update(toastId, {
        render: "Login failed",
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
      setError(error.message);
    }
  });

  const [isSignUp, setIsSignUp] = useState(false);
  const [isUser, setIsUser] = useState(true);

  useEffect(() => {
    let isSignUp = isSignupPage !== undefined ? isSignupPage : state?.isSignUp;
    const isUser = state?.isUser === undefined ? true : state?.isUser;
    const isStayReq = state?.isStayReq;

    if (isLoggedIn && !isStayReq) navigate("/");

    if (isSignUp && !isUser)
      navigate("/login", { state: { ...state, isUser: false } });

    setIsSignUp(isSignUp);
    setIsUser(isUser);
  }, [pathname, search]);

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
    console.log(`isSignUp`, isSignUp);

    console.log("state", state);
  }, [state]);

  const onSubmit = (data) => {
    console.log("submit Data", data);
  };

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="w-full max-w-md">
          <div className="mb-2 flex justify-center">
            <Logo width="50px" />
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            {isSignUp ? "Create a Account" : "Sign in to your account"}
          </h2>
          {isSignUp ? (
            <p className="mt-2 text-center text-sm text-gray-600 ">
              have an account?{" "}
              <Link
                to={`/login`}
                state={state}
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
          ) : isUser && !isSignUp ? (
            <p className="mt-2 text-center text-sm text-gray-600 ">
              Don&apos;t have an account?{" "}
              <Link
                to={`/signup`}
                state={{ ...state, isUser }}
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Create a account
              </Link>
            </p>
          ) : null}
          <p className="text-center text-sm text-red-500">{error}</p>
          <FormProvider {...methods}>
            <form
              method="POST"
              className="mt-8"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="space-y-5">
                {isSignUp && (
                  <Input
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Enter Your Full Name"
                    rules={{
                      required: true,
                      minLength: 3,
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Only letters are allowed",
                      },
                    }}
                  />
                )}
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  rules={{
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  }}
                />
                <div className="w-full relative flex items-center">
                  <Input
                    label="Password"
                    name="password"
                    type={isPassword ? "password" : "text"}
                    placeholder="Enter Password"
                    rules={{
                      required: true,
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                        message:
                          "Password must be 8-20 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
                      },
                    }}
                  />
                  <div className="absolute bottom-2 right-2 cursor-pointer">
                    {isPassword ? (
                      <EyeIcon onClick={() => setIspassword(!isPassword)} />
                    ) : (
                      <EyeOffIcon onClick={() => setIspassword(!isPassword)} />
                    )}
                  </div>
                </div>
                <Button
                  classname="w-full flex justify-center items-center text-3xl select-none"
                  type="submit"
                >
                  {isLoading ? (
                    <ButtonLoading fillColor="fill-black" />
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Login"}{" "}
                      <ArrowRight className="ml-2" size={16} />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
          {isUser && (
            <div className="mt-3 space-y-3" onClick={handleGoogleLogin}>
              <button
                type="button"
                className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
              >
                <span className="mr-2 inline-block">
                  <svg
                    className="h-6 w-6 text-rose-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                </span>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
