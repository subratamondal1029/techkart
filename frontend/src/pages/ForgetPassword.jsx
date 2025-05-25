import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Input } from "../components";
import PasswordAndConfirm from "../components/formComp/PasswordAndConfirm";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const methods = useForm();

  const submitForm = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen w-full p-2 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
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

            <Button type="submit" classname="mt-2">
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
    </div>
  );
};

export default ForgetPassword;
