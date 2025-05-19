import { Button, TagInput, UpdateForm } from ".";
import { useState } from "react";
import delay from "../utils/delay";
import { FormProvider, useForm } from "react-hook-form";

const Test = () => {
  const methods = useForm();

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen w-full bg-gray-800 text-white">
      <p className="text-3xl text-center pt-4">Test</p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <TagInput />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Test;
