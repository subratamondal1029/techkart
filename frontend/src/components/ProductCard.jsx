import React from "react";
import { Button, Image } from "./index";
import fileService from "../services/file.service";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  const { _id, image, name, price } = product;
  const navigate = useNavigate();
  const isProductInCart = useSelector((state) =>
    state.cart?.products?.some(({ product }) => product?._id === _id)
  );

  const handleClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      className="w-[90vw] max-w-sm aspect-[3/4] bg-white border border-gray-200 rounded-2xl shadow-md p-4 sm:p-5 flex flex-col justify-between cursor-pointer relative transition hover:shadow-xl"
      onClick={handleClick}
    >
      {isProductInCart && (
        <div
          className="absolute top-2 left-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow cursor-default select-none"
          onClick={(e) => e.stopPropagation()}
        >
          In Cart
        </div>
      )}

      <Image
        className="rounded-xl min-h-64"
        src={fileService.get(image)}
        alt="product image"
      />

      <div className="mt-4 sm:mt-6 flex flex-col justify-between flex-grow">
        <h5 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {name}
        </h5>

        <div className="flex items-center justify-between mt-auto">
          <span
            className="text-lg sm:text-xl font-bold text-gray-900 cursor-default"
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
};

export default ProductCard;
