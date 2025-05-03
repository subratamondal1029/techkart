import React from "react";
import { Button, Image } from "./index";
import fileService from "../services/file.service";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { _id, image, name, price } = product;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between cursor-pointer"
      onClick={handleClick}
    >
      <Image
        className="rounded-lg"
        src={fileService.get(image)}
        alt="product image"
      />

      <div className="mt-5">
        <h5 className="text-xl font-semibold tracking-tight text-gray-800">
          {name}
        </h5>

        <div className="flex items-center justify-between mt-5">
          <span
            className="text-2xl font-bold text-gray-900 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            ₹ {price?.toLocaleString()}
          </span>
          <Button classname="text-white rounded-lg text-sm px-5 py-2.5 text-center w-32 flex justify-between items-center">
            <Eye />
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
