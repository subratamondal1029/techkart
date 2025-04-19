import React from "react";
import testService from "../services/test.service";
import { useEffect } from "react";
import Button from "./Button";
import fileService from "../services/file.service";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "./";

const Test = () => {
  const methods = useForm();

  const submit = (data) => {
    console.log(data);
  };

  return (
    <div className="bg-gray-700 text-white h-screen w-full">
      <h1 className="text-3xl ">Test</h1>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(submit)}
          className="mt-5 w-full max-w-96 mx-auto"
        >
          <Input
            label="Name"
            type="text"
            placeholder="Enter Your Full Name"
            classname="w-1/2"
            name="name"
            rules={{
              required: true,
              minLength: 3,
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "Only letters are allowed",
              },
            }}
            autoFocus="true"
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter Your Email"
            classname="w-1/2"
            name="email"
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            }}
          />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Test;
