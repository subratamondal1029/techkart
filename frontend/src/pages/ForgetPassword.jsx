import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Input } from "../components";
import { PasswordAndConfirm } from "../components";
import { Link } from "react-router-dom";
import useLoading from "../hooks/useLoading";
import authService from "../services/auth.service";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import showToast from "../utils/showToast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const { token } = useParams();
  const [isVerify, setIsVerify] = useState(false);
  const navigate = useNavigate();
  const methods = useForm();

  const [submitForm, isLoading] = useLoading(async (data) => {
    try {
      await authService.updatePassword({ token, password: data.password });
      showToast("success", "Password updated successfully");
      navigate("/login");
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    }
  });

  const [verifyToken, isVerifying, verificationError] = useLoading(
    async (token) => {
      await authService.verifyToken(token);
      setIsVerify(true);
    }
  );

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  return (
    <div className="min-h-screen w-full p-2 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      {isVerify ? (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2 text-center text-blue-700">
            Reset Your Password
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Please enter your new password below. Make sure it’s strong and
            secure.
          </p>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(submitForm)}
              className="flex flex-col gap-4"
            >
              <PasswordAndConfirm isRequired={true} />

              <Button
                type="submit"
                classname="mt-2"
                loader={isLoading}
                disabled={isLoading}
              >
                Update Password
              </Button>
            </form>
          </FormProvider>
          <div className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </div>
      ) : verificationError ? (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center">
          <svg
            className="w-12 h-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
            <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
          </svg>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            {verificationError}
          </h2>
          <Link to="/login" className="text-blue-600 hover:underline text-sm">
            Request a new password reset link
          </Link>
        </div>
      ) : (
        isVerifying && (
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500 mb-4" />
            <p className="text-gray-600">Verifying your request...</p>
          </div>
        )
      )}
    </div>
  );
};

export default ForgetPassword;
