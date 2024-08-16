import React, { useState } from "react";
import { ArrowRight, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button, ButtonLoading, Input } from "../index";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import appwriteAuth from "../../appwrite/authService";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { toast } from "react-toastify";
import appWriteDb from "../../appwrite/DbServise";
import { Query } from "appwrite";

const Login = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPassword, setIspassword] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleLogin = async () => {
    const currentUrl = window.location.host;
    const redirectUrl = `http://${currentUrl}/${state?.redirect || ""}`;
    appwriteAuth
      .loginWithGogle(redirectUrl, `http://${currentUrl}`)
      .catch((error) => toast.error(error));
  };

  const handleLogin = async (data) => {
    setIsLoading(true);
    setError("");
    const toastId = toast.loading("Logging in...");
    try {
      const session = await appwriteAuth.emailPassLogin({
        email: data.email,
        password: data.password,
      });
      setIsLoading(false);
      if (session) {
        const userData = await appwriteAuth.getCurrentUser();
        const cart = await appWriteDb.getCart(userData.$id);
        const orders = await appWriteDb.getOrders([
          Query.equal("userId", userData.$id),
        ]);
        if (cart || orders) {
          dispatch(
            login({
              userData,
              isCartCreated: true,
              otherData: { cart: cart || [], orders: orders || [] },
            })
          );
        } else dispatch(login({ userData }));
        toast.update(toastId, {
          render: "Login successful",
          type: "success",
          autoClose: 3000,
          isLoading: false,
        });

        if (state?.redirect) {
          navigate(`/${state.redirect}`);
        } else navigate("/");
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Login failed",
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
      setError(error.message);
      setIsLoading(false);
      console.log("handleLogin :: error", error);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
            <svg
              width="50"
              height="56"
              viewBox="0 0 50 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z"
                fill="black"
              />
            </svg>
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Sign in to your account
          </h2>
          {state?.isSignUp !== false ? (
            <p className="mt-2 text-center text-sm text-gray-600 ">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                state={state ? state : null}
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Create a account
              </Link>
            </p>
          ) : null}
          <p className="text-center text-sm text-red-500">{error}</p>
          <form
            method="POST"
            className="mt-8"
            onSubmit={handleSubmit(handleLogin)}
          >
            <div className="space-y-5">
              <Input
                label="Email: "
                required
                type="email"
                placeholder="Enter Email"
                {...register("email", { required: true })}
                error={errors.email && true}
              />
              <div className="w-full relative flex items-center">
                <Input
                  label="Password"
                  required
                  type={isPassword ? "password" : "text"}
                  placeholder="Enter Password (Minimum 8)"
                  {...register("password", { required: true, minLength: 8 })}
                  error={errors.password && true}
                />
                <div>
                  {isPassword ? (
                    <EyeIcon
                      className="absolute top-9 right-2 cursor-pointer"
                      onClick={() => setIspassword(!isPassword)}
                    />
                  ) : (
                    <EyeOffIcon
                      className="absolute top-9 right-2 cursor-pointer"
                      onClick={() => setIspassword(!isPassword)}
                    />
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
                    Login <ArrowRight className="ml-2" size={16} />
                  </>
                )}
              </Button>
            </div>
          </form>
          {state?.isSignUp !== false ? (
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
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Login;
