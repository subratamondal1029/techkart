import React from "react";
import { Button } from "./index";
import fileService from "../services/file.service";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { _id, image, name, price } = product;
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between ">
      <Link to={`/product/${_id}`}>
        {/* TODO: add simmer Effect */}
        <img
          className="rounded-lg"
          src={fileService.get(image)}
          alt="product image"
        />
      </Link>
      <div className="mt-5">
        <Link to={`/product/${_id}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-800">
            {name}
          </h5>
        </Link>
        <div className="flex items-center justify-between mt-5">
          <span className="text-2xl font-bold text-gray-900">
            ₹ {price?.toLocaleString()}
          </span>
          <Button
            onClick={() => navigate(`/product/${_id}`)}
            classname="text-white rounded-lg text-sm px-5 py-2.5 text-center w-32 flex justify-between items-center"
          >
            <Eye />
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
