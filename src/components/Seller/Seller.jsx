import React, { useEffect, useState } from "react";
import { Button, ButtonLoading, Input, TextArea } from "../index";
import { useForm } from "react-hook-form";
import appWriteStorage from "../../appwrite/storageService";
import appWriteDb from "../../appwrite/DbServise";
import { toast } from "react-toastify";

const Seller = () => {
  const { register, handleSubmit, formState: { errors }, reset} = useForm();
  const [isLoading, setIsLoading] = useState(false);
  

  const submit = (data) => {
    const toastId = toast.loading("Uploading...");
    setIsLoading(true);
    data = { ...data, tags: makeTags(data.tags), price: parseInt(data.price) };

    appWriteStorage
      .uploadFile(data.image[0])
      .then((image) => {
        data = { ...data, image: image.$id };
      })
      .finally(() => {
        appWriteDb.createProduct(data).then((res) => {
          if (res) {
            toast.update(toastId, {
              render: "Product Uploaded",
              type: "success",
              autoClose: 3000,
              isLoading: false,
            });
            setIsLoading(false)
          reset();
          } else {
            appWriteStorage.deleteFile(data.image).then((res) => {
              if (res) {
                console.log("image deleted successfully");
              }
            });
            console.log("error from db :: createProduct");
            toast.update(toastId, {
              render: "Product Upload Failed",
              type: "error",
              autoClose: 3000,
              isLoading: false,
            });
            setIsLoading(false)
          }
        });
      });
  };

  const makeTags = (value) => {
    if (value) {
      const splitValue = value.trim().split(",");
      return splitValue.map((tag) => tag.trim());
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col bg-slate-100 pb-10 pt-3">
      <h1 className="font-bold text-3xl my-4">Submit Your Product</h1>
      <form
        className="space-y-6 w-full max-w-md p-5 bg-white shadow-md rounded-md"
        onSubmit={handleSubmit(submit)}
      >

        <Input
          label="Product Name"
          required
          placeholder="Enter Your Product Name"
          error={errors.name && true}
          {...register("name", { required: true, minLength: 3 })}
        />
        <Input
          label="Company Name"
          required
          placeholder="Enter Your Company Name"
          error={errors.company && true}
          {...register("company", { required: true, minLength: 3 })}
        />
        <Input
          type="number"
          label="Price"
          required
          error={errors.price && true}
          placeholder="Price (1-99,999)"
          {...register("price", { required: true, validate: (value) => Number(value) !== 0})}
        />
        <Input
          label="category"
          placeholder="eg. Mobile"
          required
          error={errors.category && true}
          {...register("category", { required: true })}
        />
        <Input
          label="tags"
          error={errors.tags && true}
          placeholder="eg. Mobile, Electronic"
          required
          {...register("tags", { required: true, minLength: 10 })}
        />
        <TextArea
          label="Description"
          error={errors.description && true}
          required
          placeholder="Enter Your Product Description"
          {...register("description", { required: true, minLength: 10 })}
        />
        <Input
          type="file"
          label="Upload Image"
          required
          error={errors.image && true}
          accept="image/png, image/gif, image/jpeg, image/jpg, image/webp"
          {...register("image", { required: true })}
          classname="pb-10"
        />

        <Button type="submit" classname="w-full text-[17px] py-2">
          {isLoading ? <ButtonLoading fillColor="fill-black" /> : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Seller;
