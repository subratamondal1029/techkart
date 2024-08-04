import React from "react";
import { Button } from "./index";
import { ViewIcon } from "lucide-react";

export default function ProductCard({ name, price, image, openProduct }) {
  return (
    
      <div className="w-80 shadow-sm bg-gray-50">
        <img
          src={image}
          alt={`${name} image`}
          className="w-full"
        />

        <div className="px-5 pb-5">
          <p className="text-md font-semibold">{name}</p>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">₹ {price.toLocaleString("en-IN")}</p>
            <Button
            onClick={openProduct}
              type="button"
              classname="w-1/2 flex items-center justify-center py-2.5"
            >
              <ViewIcon size={20} className="mr-2" />
              View
            </Button>
          </div>
        </div>
      </div>
  );
}
