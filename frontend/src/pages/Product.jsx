import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Button, ButtonLoading, Image, LoadingError } from "../components";
import ProductShimmer from "../components/shimmers/Product.shimmer";

import useLoading from "../hooks/useLoading";

import productService from "../services/product.service";
import fileService from "../services/file.service";
import cartService from "../services/cart.service";

import { addProduct } from "../store/product.slice";
import { addToCart } from "../store/cart.slice";

import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from "lucide-react";

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [isInCart, setIsInCart] = useState(false);
  const product = useSelector((state) =>
    state.products.data.find((p) => p._id === id)
  );
  const [productError, setProductError] = useState("");

  const [fetchProduct, isProductLoading] = useLoading(async () => {
    setProductError("");
    try {
      const { data: product } = await productService.getOne(id);
      dispatch(addProduct(product));
    } catch (error) {
      if (error.status === 404) {
        navigate("/404");
        return;
      }
      setProductError(error.message || "Something went wrong");
    }
  });

  useEffect(() => {
    if (!product) {
      fetchProduct();
    }
  }, [product]);

  useEffect(() => {
    setIsInCart(cart?.products?.some((p) => p.product._id === id) || false);
    setQuantity(
      cart?.products?.find((p) => p.product._id === id)?.quantity || 1
    );
  }, [cart, id]);

  const [handleAddToCart, isAddingToCart] = useLoading(async () => {
    if (isLoggedIn) {
      if (isInCart) {
        navigate("/cart");
      } else {
        const cartUpdateRequest = cartService.update({ id, quantity });

        toast.promise(cartUpdateRequest, {
          pending: "Adding to cart",
          success: "Added to cart",
          error: "Error adding to cart",
        });

        await cartUpdateRequest;
        dispatch(addToCart({ quantity, product }));
      }
    } else {
      navigate("/login", { state: { redirect: `/product/${id}` } });
    }
  });

  const back = () => {
    const history = window.history;
    if (history.length > 1) {
      history.back();
    } else navigate("/");
  };

  return product ? (
    <div className="w-full min-h-[80vh] flex items-center justify-center gap-20 p-5 px-5 sm:px-20 mt-10 xl:mt-5 xl:flex-row flex-col lg:items-center">
      <Button
        type="button"
        classname="flex items-center justify-start absolute top-20 left-4"
        onClick={back}
      >
        <ArrowLeft size={20} />
        Go back
      </Button>
      <div className="w-full max-w-[400px] h-auto rounded-lg flex items-center justify-center">
        <Image
          src={fileService.get(product.image)}
          alt={product.name}
          className="min-w-52"
        />
      </div>
      <div className="w-full h-full flex justify-start flex-col items-start gap-3">
        <h3 className="text-2xl uppercase text-gray-500">{product.company}</h3>
        <h1 className="text-3xl font-bold ">{product.name}</h1>

        <p className="mt-2">{product.description}</p>

        <h3 className="font-extrabold text-3xl mt-2">
          ₹ {product.price.toLocaleString("en-IN")}
        </h3>
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
                className="hover:text-heading transition hover:underline capitalize"
                to={`/search/${product.category}`}
              >
                {product.category}
              </Link>
            </li>
            <li className="productTags flex items-center justify-start">
              <p className="hover:text-heading pr-1.5 transition last:pr-0 flex flex-wrap justify-start gap-1">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    className="py-2 px-4 border rounded-full cursor-pointer hover:bg-gray-50"
                    to={`/search/${tag}`}
                  >
                    {tag}
                  </Link>
                ))}
              </p>
            </li>
          </ul>
        </div>

        <hr className="w-full " />
        <div className="flex gap-3 items-center xl:w-3/4 mt-3 md:w-2/4 w-full sm:w-3/4 ">
          <Button
            classname="w-full max-w-44 bg-gray-100 text-black hover:bg-gray-200 justify-between text-2xl py-2 rounded-xl px-4 shadow-sm transition-colors duration-200 focus:ring-0"
            disabled={isInCart}
          >
            <Minus
              size={26}
              className={`transition-colors duration-200 cursor-pointer ${
                isInCart
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                if (!isInCart)
                  setQuantity((prev) => (prev !== 1 ? prev - 1 : 1));
              }}
            />
            <p className="select-none text-black text-xl font-medium">
              {quantity}
            </p>
            <Plus
              size={26}
              className={`transition-colors duration-200 cursor-pointer ${
                isInCart
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                if (!isInCart) setQuantity((prev) => prev + 1);
              }}
            />
          </Button>

          <Button
            classname="w-full max-w-36 min-h-10 flex items-center justify-between py-3 px-3 select-none xl:px-5"
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <ButtonLoading fillColor="fill-black" classname="w-full" />
            ) : isInCart ? (
              <>
                <Check size={25} className="ml-2" /> Go to cart
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                Add to cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full min-h-[80vh] flex justify-center">
      {productError && (
        <LoadingError
          error={productError}
          retry={fetchProduct}
          classname="w-full"
        />
      )}
      {isProductLoading && <ProductShimmer />}
    </div>
  );
};

export default Product;
