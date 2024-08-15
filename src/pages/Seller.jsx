import React, { useEffect, useState } from "react";
import { AccessDenied, Button, ButtonLoading, Input, TextArea } from "../components";
import { useForm } from "react-hook-form";
import appWriteStorage from "../appwrite/storageService";
import appWriteDb from "../appwrite/DbServise";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Seller = () => {
  const { register, handleSubmit, formState: { errors }, reset} = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData)
  
   if (userData?.labels[0] !== "seller") {
    return <AccessDenied message="seller"/>
   }


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
          {...register("company", { required: true, minLength: 2 })}
        />
        <Input
          type="number"
          label="Price"
          required
          error={errors.price && true}
          placeholder="Price (1-99,999)"
          {...register("price", { required: true, validate: (value) => Number(value) !== 0})}
        />
        <div className="w-full">
       <select className="w-full bg-transparent p-2 border rounded-lg" {...register("category", { required: true })}>
        <option value="" hidden>Category</option>
         <option value="mobile">Mobile</option>
         <option value="laptop">Laptop</option>
         <option value="computer">Computer</option>
         <option value="audio">Audio</option>
       </select>
       <p className="mt-1 text-xs text-gray-500"> <span className="text-red-500">*</span> This field is required</p>
        </div>

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
          {...register("description", { required: true, minLength: 10, maxLength: 555 })}
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
