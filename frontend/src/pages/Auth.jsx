import React, { useState } from "react";
import { ArrowRight, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button, ButtonLoading, Input, Logo } from "../components";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLoading } from "../hooks";
import { useEffect } from "react";

const Auth = ({ isSignupPage = false }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { state, pathname, search } = useLocation();
  const [isPassword, setIspassword] = useState(true);

  const methods = useForm();

  const handleGoogleLogin = async () => {
    const successPath = `${state?.redirect || ""}`;
    const failsPath = pathname.replace("/", "");

    authService.loginWithGogle(successPath, failsPath);
  };

  const [handleSubmit, isLoading, error] = useLoading(
    async ({ name, email, password }) => {
      const toastMessage = isSignUp ? "Signing up..." : "Logging in...";
      const successToastMessage = isSignUp
        ? "Signup successful"
        : "Login successful";
      const failToastMessage = isSignUp ? "Signup failed" : "Login failed";

      let promise;
      if (isSignUp) {
        promise = authService.createUser({ name, email, password });
      } else {
        promise = authService.emailPassLogin({ email, password });
      }

      toast.promise(promise, {
        pending: toastMessage,
        success: successToastMessage,
        error: failToastMessage,
      });

      await promise;

      if (state?.redirect) {
        navigate(
          `${state.redirect.startsWith("/") ? "" : "/"}${state.redirect}`,
          { state: { fetchData: true } }
        );
      } else navigate("/", { state: { fetchData: true } });
    }
  );

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
              Have an account?{" "}
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
          <FormProvider {...methods}>
            <form
              method="POST"
              className="mt-5"
              onSubmit={methods.handleSubmit(handleSubmit)}
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
                {isSignUp && (
                  <Input
                    label="Confirm Password"
                    name="password_confirmation"
                    type={isPassword ? "password" : "text"}
                    placeholder="Confirm Password"
                    rules={{
                      required: true,
                      validate: (value) =>
                        value === methods.watch("password") ||
                        "Passwords do not match",
                    }}
                  />
                )}
                <p className="text-center text-sm text-red-500">{error}</p>
                <Button
                  classname={`w-full h-10 flex justify-center items-center text-3xl select-none ${
                    isLoading ? "cursor-not-allowed disabled:bg-blue-500" : ""
                  }`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ButtonLoading />
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
              <button className="w-full cursor-pointer text-black flex gap-2 items-center justify-center bg-gray-100 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200">
                <svg
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6"
                >
                  <path
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    fill="#FFC107"
                  ></path>
                  <path
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    fill="#FF3D00"
                  ></path>
                  <path
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    fill="#4CAF50"
                  ></path>
                  <path
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    fill="#1976D2"
                  ></path>
                </svg>
                Continue with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
