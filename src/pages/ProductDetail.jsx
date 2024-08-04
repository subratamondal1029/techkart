import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import productImage from "../assets/imageProduct.jpg";
import { Button } from "../components";
import { Minus, Plus, ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();

  const handleAddToCart = () => {
    console.log("add to cart");
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center gap-20 p-5 px-5 sm:px-20 mt-5 xl:flex-row flex-col lg:items-center">
      <img
        src="https://media.croma.com/image/upload/v1690293464/Croma%20Assets/Computers%20Peripherals/Laptop/Images/273880_g6cpks.png"
        alt="product image"
        className="w-full max-w-[600px] h-auto rounded-lg"
      />
      <div className="w-full h-full flex justify-start flex-col items-start gap-3">
        <h3 className="text-2xl uppercase text-gray-500">Apple</h3>
        <h1 className="text-3xl font-bold ">Apple Macbook Air M1</h1>

        <p className="mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui veritatis
          officiis, molestias pariatur eaque iusto hic in sunt quibusdam,
          voluptatum ut nulla laboriosam vel modi, tempora enim consequuntur
          asperiores ipsam reiciendis atque voluptatem itaque! Quibusdam quis
          repudiandae iure delectus alias, ipsa sit assumenda veritatis aliquam
          impedit consequuntur quam cumque porro modi culpa tenetur iusto eius
          inventore.
        </p>

        <h3 className="font-extrabold text-3xl mt-2">₹ 2,00,000</h3>
        <hr className="w-full " />

        <div className="py-6 ">
          <ul className="space-y-5 pb-1 text-sm">
            <li>
              <span className="text-heading inline-block pr-2 font-semibold">
                SKU:
              </span>
              N/A
            </li>
            <li>
              <span className="text-heading inline-block pr-2 font-semibold">
                Category:
              </span>
              <Link
                className="hover:text-heading transition hover:underline"
                to="/"
              >
                Laptop
              </Link>
            </li>
            <li className="productTags">
              <span className="text-heading inline-block pr-2 font-semibold">
                Tags:
              </span>
              <p className="hover:text-heading inline-block pr-1.5 transition last:pr-0 ">
                laptop
              </p>
            </li>
          </ul>
        </div>

        <hr className="w-full " />
        <div className="flex gap-3 items-center xl:w-3/4 mt-3 md:w-2/4 w-full sm:w-3/4 ">
          <div className="w-full bg-gray-200 flex justify-between items-center text-2xl py-1 rounded-lg px-2">
            <Minus
              size={30}
              className="cursor-pointer hover:text-gray-700"
              onClick={() => setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))}
            />
            <p className="select-none">{quantity}</p>
            <Plus
              size={30}
              className="cursor-pointer hover:text-gray-700"
              onClick={() => setQuantity((prev) => prev + 1)}
            />
          </div>
          <Button
            classname="w-3/4 flex items-center justify-between py-3 px-3 select-none xl:px-5"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
