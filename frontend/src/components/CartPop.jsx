import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import appWriteDb from "../appwrite/DbServise";
import { storeProducts } from "../store/productSlice";


export default function CartPop({ setIsCartOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingClass, setLoadingClass] = useState("");
  const { otherData } = useSelector((state) => state.auth);
  const userData = useSelector((state) => state.auth.userData);
  const { products: allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const createProducts = otherData.cart.map((cartProduct) => {
      const productDetails = allProducts.find(
        (product) => product.$id === cartProduct.productId
      );

      return {
        id: productDetails.$id,
        name: productDetails.name,
        price: productDetails.price,
        image: productDetails.image,
        quantity: cartProduct.quantity,
      };
    });

    setProducts(createProducts.reverse());
  }, [otherData.cart, allProducts]);

  const handleDeleteProduct = async(productId) => {
    setLoadingClass("cursor-wait");
    const filteredProducts = products
      .filter((product) => product.id !== productId)
      .map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      }));

      try {
        const cart = await appWriteDb.addToCart(filteredProducts, userData.$id, "update");
        if (cart) {
          dispatch(login({ otherData: { cart, orders: otherData.orders } }));
          setLoadingClass("");
        }
      } catch (error) {
        console.warn(error.message);
        setLoadingClass("");
      }
  };

  return (
    <div
      className="z-30 m-auto absolute top-10 right-0 bg-custom-gradient my-6 w-screen max-w-sm rounded-lg border border-gray-200 p-4 pt-4 shadow-sm sm:p-6 lg:p-8"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <button className="relative ml-auto block text-gray-600 transition hover:scale-110">
        <span className="sr-only">Close cart</span>
        <X size={24} onClick={() => setIsCartOpen(false)} />
      </button>
      <div className="mt-6 space-y-6">
        <ul className="space-y-4 overflow-y-auto max-h-72 hide-scroll">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.id}`}
                className="flex items-center gap-4 relative"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded object-contain"
                />
                <div>
                  <h3 className="text-sm text-gray-900 truncate max-w-40">{product.name}</h3>
                  <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                    <div>
                      <dd className="inline font-bold">₹{product.price}</dd>
                      <dd className="inline"> x {product.quantity}</dd>
                    </div>
                  </dl>
                </div>
                <div className={`absolute right-0 top-1/4 text-white hover:text-gray-300 bg-black p-1 rounded-md ${loadingClass}`}>
                  <X
                    size={24}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteProduct(product.id);
                    }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="space-y-4 text-center">
          <button
            type="button"
            className="w-full rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            onClick={() => {
              navigate("/cart")
               setIsCartOpen(false)
              }}
          >
            View Cart ({products.length})
          </button>
          <Button classname="w-full" type="button" onClick={() => {navigate("/checkout"); setIsCartOpen(false)}}>
            Checkout
          </Button>
          <Link
            to="/"
            onClick={() => setIsCartOpen(false)}
            className="inline-block text-sm text-gray-600 transition hover:text-gray-700 hover:underline hover:underline-offset-4"
          >
            Continue shopping &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
